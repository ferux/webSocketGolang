package chat

import (
	"fmt"
	"time"

	"github.com/google/uuid"
)

//Message describes message send or recieved.
type Message struct {
	ID        uuid.UUID `json:"id,omitempty"`
	Author    string    `json:"author,omitempty"`
	Body      string    `json:"body,omitempty"`
	Timestamp time.Time `json:"timestamp,omitempty"`
}

//NewMessage generates new message
func NewMessage(auth, text string) *Message {
	if len(text) == 0 {
		return nil
	}
	return &Message{
		ID:        uuid.New(),
		Author:    auth,
		Body:      text,
		Timestamp: time.Now(),
	}
}

//String formats message in readable format
func (m *Message) String() string {
	return fmt.Sprintf("%s [%s]: %s", m.Author, m.Timestamp.Format("04:05:06"), m.Body)
}
