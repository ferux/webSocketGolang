package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/ferux/webSocketServer/chat"
)

var (
	listen    string
	assets    string
	debugFlag bool
	logger    *log.Logger
)

func main() {
	flag.StringVar(&listen, "listen", ":8080", "Server listen addres:port")
	flag.BoolVar(&debugFlag, "debug", false, "Puts server into debug mode")
	flag.StringVar(&assets, "dir", "webroot", "Location of assets")
	flag.Parse()
	s := chat.NewServer()
	go s.Listen("/ws")
	http.Handle("/", http.FileServer(http.Dir(assets)))
	http.ListenAndServe(listen, nil)
}

func debugF(pattern string, args ...interface{}) {
	if args == nil {
		logger.Println(pattern)
		return
	}
	logger.Printf(pattern, args)
}

func debugErr(err error) {
	if !debugFlag {
		return
	}
	if err != nil {
		logger.Printf("Got an error: %v", err)
	}
}
