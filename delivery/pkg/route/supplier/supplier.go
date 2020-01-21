package supplier

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
	"github.com/jmespath/go-jmespath"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type Data struct {
	Url   string
	Query string
}

func reader(conn *websocket.Conn) {
	for {
		messageType, jsonData, err := conn.ReadMessage()

		var data Data
		json.Unmarshal([]byte(jsonData), &data)
		data.Query = strings.Replace(data.Query, "`", "'", -1)
		if err != nil {
			log.Println(err)
			return
		}

		response, err := http.Get(data.Url)

		if err != nil {
			log.Println(err)
		}

		res, _ := ioutil.ReadAll(response.Body)

		var d interface{}

		json.Unmarshal([]byte(res), &d)

		transformed, err := jmespath.Search(data.Query, d)
		if err != nil {
			log.Fatal(err)
		}

		marshalled, _ := json.Marshal(transformed)

		if err := conn.WriteMessage(messageType, marshalled); err != nil {
			log.Println(err)
			return
		}
	}
}

func Route(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	log.Println("Connection established...")
	reader(ws)
}
