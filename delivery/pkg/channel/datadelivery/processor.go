package datadelivery

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"strings"

	"github.com/jmespath/go-jmespath"
)

func Process(data Data) interface{} {
	var d interface{}

	data.Url = strings.TrimSpace(data.Url)

	response, err := httpWithResponse.Get(data.Url)
	if err != nil {
		log.Printf("Error occurred by fetching the data from external api: %s \n", err)
	}

	res, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Printf("Error occurred by reading external api response: %s \n", err)
	}

	err = json.Unmarshal([]byte(res), &d)
	if err != nil {
		log.Printf("Error occurred by unmarshalling external api response: %s \n", err)
	}

	queried, err := jmespath.Search(data.Query, d)
	if err != nil {
		log.Printf("Error occurred by querying response with given query: %s \n", err)
	}
	return queried
}
