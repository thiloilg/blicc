package channel

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/blicc-org/blicc/delivery/pkg/channel/datadelivery"
	"github.com/blicc-org/blicc/delivery/pkg/channel/forwarding"
	"github.com/gorilla/websocket"
)

type Payload struct {
	Channel string          `json:"channel"`
	Data    json.RawMessage `json:"data"`
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		incomingOrigin := r.Header.Get("Origin")
		expectedOrigin := os.Getenv("APP_ORIGIN")

		if incomingOrigin == expectedOrigin {
			log.Printf("Upgrade to origin %s was successful! \n", incomingOrigin)
			return true
		} else {
			log.Printf("Origin %s is not allowed. Expected %s as origin. \n", incomingOrigin, expectedOrigin)
			return true
		}
	},
}

func ListenAndServe(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	log.Println("Connection established...")
	reader(ws)
}

func reader(conn *websocket.Conn) {
	publisher := make(map[string]bool)

	for {
		messageType, jsonData, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error occurred by reading incoming message!")
			log.Println(err)
		}

		if messageType == websocket.TextMessage {
			log.Println("Successful message type text message!")

			var p Payload
			json.Unmarshal(jsonData, &p)

			if _, ok := publisher[p.Channel]; !ok {
				publisher[p.Channel] = false
			}

			switch c := strings.Split(p.Channel, "/")[1]; c {
			case "data-delivery":
				datadelivery.Handle(conn, &p.Channel, &p.Data, publisher)
			case "forwarding":
				forwarding.Handle(conn, &p.Channel, &p.Data)
			default:
				log.Println("No channel is matching")
			}
		} else {
			conn.Close()
			log.Printf("wrong messageType: %d \n", messageType)
			break
		}
	}
}
