package chat

import (
	"errors"
	"fmt"
	"io"
	"log"
	"os"

	"github.com/google/uuid"
	"golang.org/x/net/websocket"
)

const bufferSize = 16

//Client is a basic struct for client
type Client struct {
	id     uuid.UUID
	ws     *websocket.Conn
	server *Server
	mesCh  chan *Fetch
	doneCh chan bool
	logger *log.Logger
}

//NewClient creates new client
func NewClient(ws *websocket.Conn, s *Server) *Client {
	if ws == nil {
		s.SendError(errors.New("Can't create client with empty websocket"))
		return nil
	}
	if s == nil {
		log.Fatal("Server is empty. What's going on")
	}
	id := uuid.New()
	return &Client{
		id:     id,
		ws:     ws,
		server: s,
		mesCh:  make(chan *Fetch, bufferSize),
		doneCh: make(chan bool),
		logger: log.New(os.Stdout, fmt.Sprintf("Client %s", id.String()), log.Lshortfile+log.Ldate+log.Ltime),
	}
}

//Conn returns active websocket connection
func (c *Client) Conn() *websocket.Conn {
	return c.ws
}

//GetID returns ID of the client
func (c *Client) GetID() uuid.UUID {
	return c.id
}

//SendMessage sends message to the client
func (c *Client) SendMessage(m *Fetch) {
	select {
	case c.mesCh <- m:
	default:
		c.server.DeleteClient(c)
		c.server.SendError(fmt.Errorf("Client %s has been disconnected", c.GetID().String()))
	}
}

//Done closes connection with client
func (c *Client) Done() {
	c.doneCh <- true
}

//Listen listens for events
func (c *Client) Listen() {
	c.logger.Println("Start to listen")
	go c.listenWrite()
	c.listenRead()
}

func (c *Client) listenWrite() {
	for {
		select {
		case msg := <-c.mesCh:
			websocket.JSON.Send(c.ws, msg)
		case <-c.doneCh:
			c.server.DeleteClient(c)
			c.logger.Println("Close connection")
			c.doneCh <- true
			return
		}
	}
}

func (c *Client) listenRead() {
	for {
		select {
		case <-c.doneCh:
			c.server.DeleteClient(c)
			c.doneCh <- true
		default:
			var msg Fetch
			err := websocket.JSON.Receive(c.ws, &msg)
			if err != nil {
				if err == io.EOF {
					c.doneCh <- true
				} else {
					c.server.SendError(err)
				}
			} else {
				switch msg.Type {
				case "ADD_MESSAGE":
					logger.Println("Received new message")
					c.server.SendMessageAll(NewMessage(msg.Data[0].Author, msg.Data[0].Body))
				default:
					c.server.sendPastMessages(c)
				}
			}
		}
	}
}
