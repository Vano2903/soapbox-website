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
			return err
		}
		// e.Record.Set("id:autogenerate", "")
		if err := e.Next(); err != nil {
			return err
		}

		person.Set("user", e.Record.Id)
		return e.App.Save(person)
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

		return e.App.RunInTransaction(func(tx core.App) error {
			person, err := tx.FindRecordById("people", authRecord.GetString("person"))
			if err != nil {
				return err
			}

			team, err := tx.FindRecordById("teams", e.Record.GetString("team"))
			if err != nil {
				return err
			}

			e.Record.Set("uses", e.Record.GetInt("uses")-1)
			team.Set("members+", []string{person.Id})

			if err := tx.Save(team); err != nil {
				return err
			}
			return e.Next()
		})
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
