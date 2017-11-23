package chat

import (
	"log"
	"net/http"
	"os"

	"golang.org/x/net/websocket"

	"github.com/google/uuid"
)

var logger = *log.New(os.Stdout, "Server ", log.Lshortfile+log.Ldate+log.Ltime)

//Server is a struct that implements server state
type Server struct {
	clients    map[uuid.UUID]*Client
	messages   []*Message
	sendAllMsg chan *Message
	sendPM     chan *Message
	addClient  chan *Client
	delClient  chan *Client
	errChan    chan error
	doneChan   chan bool
}

//NewServer creates a new server to work with
func NewServer() *Server {
	return &Server{
		clients:    make(map[uuid.UUID]*Client),
		addClient:  make(chan *Client),
		delClient:  make(chan *Client),
		errChan:    make(chan error),
		sendAllMsg: make(chan *Message),
		doneChan:   make(chan bool),
		messages:   make([]*Message, 0),
	}
}

//AddClient adds new client to the server array
func (s *Server) AddClient(c *Client) {
	s.addClient <- c
}

//DeleteClient removes client from client array
func (s *Server) DeleteClient(c *Client) {
	s.delClient <- c
}

//SendMessageAll sends message to all active clients
func (s *Server) SendMessageAll(m *Message) {
	s.sendAllMsg <- m
}

func (s *Server) sendMessageAll(m *Message) {
	for _, client := range s.clients {
		client.SendMessage(AddMessageFetch(m))
	}
}

//SendPrivate sends private message to specified user
func (s *Server) SendPrivate(id uuid.UUID, m *Message) {
	for key, c := range s.clients {
		if key == id {
			c.SendMessage(AddMessageFetch(m))
		}
	}
}

//SendError writes error to log
func (s *Server) SendError(err error) {
	if err != nil {
		s.errChan <- err
	}
}

func (s *Server) sendError(err error) {
	logger.Printf("Got an error: %v\n", err)
}

func (s *Server) sendPastMessages(c *Client) {
	logger.Println("Sending past messages to client")
	c.SendMessage(AddAllMessagesFetch(s.messages))

}

//Listen starts to listening for incoming connections
func (s *Server) Listen(pattern string) {
	logger.Println("Initializing server")

	onConnected := func(ws *websocket.Conn) {
		defer func() {
			if err := ws.Close(); err != nil {
				s.errChan <- err
			}
		}()
		client := NewClient(ws, s)
		s.AddClient(client)
		logger.Println("New client starts listening")
		client.Listen()
	}
	http.Handle(pattern, websocket.Handler(onConnected))
	logger.Println("Created handler")

	for {
		select {
		case c := <-s.addClient:
			logger.Println("New Client connected")
			s.clients[c.GetID()] = c
			s.sendPastMessages(c)
		case c := <-s.delClient:
			logger.Printf("Disconnecting client: %v", c.GetID().String())
			delete(s.clients, c.GetID())
		case msg := <-s.sendAllMsg:
			if msg == nil {
				return
			}
			logger.Printf("Send message: %v", msg)
			s.messages = append(s.messages, msg)
			s.sendMessageAll(msg)
		case err := <-s.errChan:
			s.sendError(err)
		case <-s.doneChan:
			return
		}
	}
}
