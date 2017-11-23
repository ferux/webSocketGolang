package chat

//Fetch is a struct used for communicating with clients
type Fetch struct {
	Type string     `json:"type,omitempty"`
	Data []*Message `json:"data,omitempty"`
}

//NewFetch returns object prepared to send to clients.
func NewFetch(author, text string) *Fetch {
	msg := NewMessage(author, text)
	return &Fetch{
		Type: "ADD_MESSAGE",
		Data: []*Message{msg},
	}
}

//AddMessageFetch yolo
func AddMessageFetch(m *Message) *Fetch {
	return &Fetch{
		Type: "ADD_MESSAGE",
		Data: []*Message{m},
	}
}

//AddAllMessagesFetch yolo
func AddAllMessagesFetch(m []*Message) *Fetch {
	return &Fetch{
		Type: "RECEIVE_DATA",
		Data: m,
	}
}
