package main

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"net/url"
	"sort"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

type RandomImage struct {
	Message string
	Status  string
}

type AllBreeds struct {
	Message map[string]map[string][]string
	Status  string
}

type ImagesByBreed struct {
	Message []string
	Status  string
}

func fatalErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func publicInterface(url string) []byte {
	response, err := http.Get(url)
	fatalErr(err)

	responseData, err := io.ReadAll(response.Body)
	fatalErr(err)

	return responseData
}

func (a *App) GetRandomImageUrl() string {
	responseData := publicInterface("https://dog.ceo/api/breeds/image/random")

	var data RandomImage
	json.Unmarshal(responseData, &data)

	return data.Message
}

func (a *App) GetBreedList() []string {
	var breeds []string

	responseData := publicInterface("https://dog.ceo/api/breeds/list/all")

	var data AllBreeds
	json.Unmarshal(responseData, &data)

	for k, _ := range data.Message {
		breeds = append(breeds, k)
	}

	sort.Strings(breeds)

	return breeds
}

func (a *App) GetImageUrlsByBreed(breed string) []string {
	url, err := url.JoinPath("https://dog.ceo/api/", "breed", breed, "images")
	fatalErr(err)
	responseData := publicInterface(url)

	var data ImagesByBreed
	json.Unmarshal(responseData, &data)

	return data.Message
}
