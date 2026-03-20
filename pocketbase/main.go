package main

import (
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func main() {
	app := pocketbase.New()

	app.OnRecordCreateRequest("users").BindFunc(func(e *core.RecordRequestEvent) error {
		peopleCollection, err := e.App.FindCollectionByNameOrId("people")
		if err != nil {
			return err
		}

		person := core.NewRecord(peopleCollection)
		person.Set("name", e.Record.GetString("name"))
		person.Set("lastName", e.Record.GetString("lastName"))
		person.Set("email", e.Record.GetString("email"))
		person.Set("id:autogenerate", "")

		e.Record.Set("person", person.Id)
		if err := e.App.Save(person); err != nil {
			e.App.Delete(person)
			return err
		}
		// e.Record.Set("id:autogenerate", "")
		if err := e.Next(); err != nil {
			e.App.Delete(person)
			return err
		}

		person.Set("user", e.Record.Id)
		if err := e.App.Save(person); err != nil {
			e.App.Delete(person)
			return err
		}
		return nil
	})

	app.OnRecordUpdate("users").BindFunc(func(e *core.RecordEvent) error {
		personId := e.Record.GetString("person")

		person, err := e.App.FindRecordById("people", personId)
		if err != nil {
			return err
		}
		person.Set("name", e.Record.GetString("name"))
		person.Set("lastName", e.Record.GetString("lastName"))
		person.Set("email", e.Record.GetString("email"))

		if err := e.App.Save(person); err != nil {
			return err
		}
		return e.Next()
	})

	app.OnRecordCreateRequest("teams").BindFunc(func(e *core.RecordRequestEvent) error {
		authRecord := e.Auth
		if authRecord == nil {
			return apis.NewUnauthorizedError("Must be authenticated to create a team", nil)
		}

		if e.Auth.IsSuperuser() {
			return e.Next()
		}

		person, err := e.App.FindRecordById("people", authRecord.GetString("person"))
		if err != nil {
			return err
		}
		e.App.Logger().Info("Creating team for user", "person", person.Id, "user", e.Auth.Id)

		e.Record.Set("owner", person.Id)
		e.Record.Set("members+", []string{person.Id})
		e.App.Logger().Info("team data", "team", e.Record)
		return e.Next()
	})

	app.OnRecordUpdateRequest("teamInvitations").BindFunc(func(e *core.RecordRequestEvent) error {
		authRecord := e.Auth
		if authRecord == nil {
			return apis.NewBadRequestError("Must be authenticated to join a team", nil)
		}

		if e.Auth.IsSuperuser() {
			return e.Next()
		}

		// return e.App.RunInTransaction(func(tx core.App) error {
		person, err := e.App.FindRecordById("people", authRecord.GetString("person"))
		if err != nil {
			return err
		}
		// e.App.Logger().Info("Joining team for user", "person", person.Id, "user", e.Auth.Id)

		team, err := e.App.FindRecordById("teams", e.Record.GetString("team"))
		if err != nil {
			return err
		}
		e.App.Logger().Info("Joining team for user", "person", person.Id, "user", e.Auth.Id, "team", team.Id)
		e.App.Logger().Info("team data", "team", team)

		if e.Record.GetInt("uses") != -1 {
			if e.Record.GetInt("uses") == 0 {
				return apis.NewBadRequestError("This invite has no uses left", nil)
			}
			e.Record.Set("uses", e.Record.GetInt("uses")-1)
		}
		team.Set("members+", []string{person.Id})

		if err := e.App.Save(team); err != nil {
			return err
		}
		e.App.Logger().Info("joined correctly", "team", team.Id)
		return e.Next()
		// })
	})

	app.OnRecordCreateRequest("eventParticipations").BindFunc(func(e *core.RecordRequestEvent) error {
		authRecord := e.Auth
		if authRecord == nil {
			return apis.NewUnauthorizedError("Must be authenticated to participate in an event", nil)
		}

		event, err := e.App.FindRecordById("events", e.Record.GetString("event"))
		if err != nil {
			return err
		}
		e.App.Logger().Info("Creating event participation", "event", event.Id, "team", e.Record.GetString("team"))

		if !e.Auth.IsSuperuser() {
			if !event.GetBool("subscriptionsOpen") {
				return apis.NewBadRequestError("Event subscriptions are closed", nil)
			}
			if event.GetInt("maxSubscriptions") != 0 && (event.GetInt("numSubscriptions")+1 >= event.GetInt("maxSubscriptions")) {
				return apis.NewBadRequestError("Event is full", nil)
			}
		}

		event.Set("numSubscriptions", event.GetInt("numSubscriptions")+1)
		if err := app.Save(event); err != nil {
			return err
		}

		return e.Next()
	})

	app.OnRecordDeleteRequest("eventParticipations").BindFunc(func(e *core.RecordRequestEvent) error {
		authRecord := e.Auth
		if authRecord == nil {
			return apis.NewUnauthorizedError("Must be authenticated to participate in an event", nil)
		}

		event, err := e.App.FindRecordById("events", e.Record.GetString("event"))
		if err != nil {
			return err
		}
		e.App.Logger().Info("Deleting event participation", "event", event.Id, "team", e.Record.GetString("team"))

		if !e.Auth.IsSuperuser() {
			if !event.GetBool("subscriptionsOpen") {
				return apis.NewBadRequestError("Event subscriptions are closed", nil)
			}
		}

		if e.Auth.IsSuperuser() && event.GetInt("numSubscriptions") <= 0 {
			e.App.Logger().Debug("numSubscriptions is already 0, not decrementing")
			return e.Next()
		}

		event.Set("numSubscriptions", event.GetInt("numSubscriptions")-1)
		if err := app.Save(event); err != nil {
			return err
		}

		return e.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
