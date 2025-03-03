package main

import (
	"encoding/json"
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/PuerkitoBio/goquery"
)

type Response struct {
	AvailableYears []int     `json:"availableYears"`
	Sections       []Section `json:"sections"`
}

type Section struct {
	Year   int     `json:"year"`
	Groups []Group `json:"groups"`
}

type Group struct {
	Name   string    `json:"name"`
	Author string    `json:"author"`
	Date   time.Time `json:"date"`
	Number int       `json:"number"`
	Id     string    `json:"id"`
	Images []Image   `json:"images"`
}

type Image struct {
	Width  int    `json:"width"`
	Height int    `json:"height"`
	Thumb  string `json:"thumb"`
	Full   string `json:"full"`
}

func scrapeGroup(url string) (Group, error) {
	title := strings.Split(strings.Split(url, "dir=")[1], "&section=")[0]

	fmt.Printf("Scraping section %s at: %s\n", title, url)
	var group Group
	group.Name = title

	baseUrl := "https://www.boxrally.eu"

	res, err := http.Get(url)
	if err != nil {
		log.Fatal("error getting page", err)
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		log.Printf("ERROR: status code error: %d %s\n", res.StatusCode, res.Status)
		return group, err
	}

	// Load the HTML document
	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		log.Fatal(err)
	}

	// Find the review items
	doc.Find("a").Each(func(i int, s *goquery.Selection) {
		// For each item found, get the title
		val, exists := s.Attr("href")
		if !exists {
			return
		}

		if !strings.HasPrefix(val, "/boxrally/thumb/thumbnail.aspx?") {
			return
		}
		fmt.Println(val)

		var img Image
		img.Thumb = baseUrl + val
		img.Full = baseUrl + strings.Split(val, "&image=")[1]

		resp, err := http.Get(img.Full)
		if err != nil {
			log.Fatal("error getting image", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != 200 {
			// log.Fatalf("status code error: %d %s", resp.StatusCode, resp.Status)
			log.Printf("ERROR: status code error: %d %s\n", res.StatusCode, res.Status)
			return
		}

		image, _, err := image.DecodeConfig(resp.Body)
		if err != nil {
			log.Println("error decoding image", err)
			return
		}
		img.Height = image.Height
		img.Width = image.Width

		group.Images = append(group.Images, img)
	})
	return group, nil
}

func main() {
	years := []int{2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015}
	baseUrl := "https://www.boxrally.eu/boxrally/gallery/"
	sectionUrl := baseUrl + "default.asp?section=%d"

	response := new(Response)
	response.AvailableYears = years
	wg := new(sync.WaitGroup)
	for _, year := range years {
		go func() {
			defer wg.Done()
			wg.Add(1)
			var section Section
			section.Year = year
			scrapeUrl := fmt.Sprintf(sectionUrl, year)
			fmt.Println("Scraping year", year, "at", scrapeUrl)
			res, err := http.Get(scrapeUrl)
			if err != nil {
				log.Fatal("error getting page", err)
			}
			defer res.Body.Close()
			if res.StatusCode != 200 {
				log.Fatalf("status code error: %d %s", res.StatusCode, res.Status)
			}

			// Load the HTML document
			doc, err := goquery.NewDocumentFromReader(res.Body)
			if err != nil {
				log.Fatal("goquery:", err)
			}

			// Find the review items
			// counter := 0
			doc.Find("a").Each(func(i int, s *goquery.Selection) {
				// For each item found, get the title
				val, exists := s.Attr("href")
				if !exists {
					return
				}

				if !strings.HasPrefix(val, "default.asp?dir=") {
					return
				}
				fmt.Println("val", val)
				// if counter == 1 {
				// url
				// fmt.Println("normal url", baseUrl+val)
				// url := url.QueryEscape(baseUrl + val)
				// if err != nil {
				// 	log.Fatal("error parsing url", err)
				// }
				esacpedSpacesUrl := strings.ReplaceAll(baseUrl+val, " ", "%20")
				fmt.Println("scraping group", esacpedSpacesUrl)
				group, err := scrapeGroup(esacpedSpacesUrl)
				if err != nil {
					log.Println("error scraping group", err)
					return
				}
				section.Groups = append(section.Groups, group)
				// }
				// counter++
				// return
				// done = true
			})
			response.Sections = append(response.Sections, section)
			responseJson, err := json.MarshalIndent(section, "", "  ")
			if err != nil {
				log.Fatal("error marshalling response", err)
			}
			f, err := os.OpenFile(fmt.Sprintf("response-%d.json", year), os.O_CREATE|os.O_WRONLY, 0644)
			if err != nil {
				log.Fatal("error opening file", err)
			}
			defer f.Close()
			f.Write(responseJson)
		}()
	}

	log.Println("Waiting for all goroutines to finish")
	wg.Wait()
	log.Println("All goroutines finished, saving to file...")
	//write response json to response.json file
	responseJson, err := json.MarshalIndent(response, "", "  ")
	if err != nil {
		log.Fatal("error marshalling response", err)
	}
	f, err := os.OpenFile("response.json", os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatal("error opening file", err)
	}
	defer f.Close()
	f.Write(responseJson)

	fmt.Println("Done")
}
