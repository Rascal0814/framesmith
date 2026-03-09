// Package main provides the API server for SampleHub
package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"samplehub/internal/handler"
	"samplehub/internal/router"
)

var (
	version   = "v1.0.0"
	port      = flag.Int("port", 8080, "server port")
	enableLog = flag.Bool("log", false, "enable request logging")
)

func main() {
	flag.Parse()

	// Initialize handler
	h := handler.New()

	// Create router
	r := router.New(h)

	// Server address
	addr := fmt.Sprintf(":%d", *port)

	// Start server in goroutine
	go func() {
		log.Printf("starting server %s on %s", version, addr)
		if err := r.Run(addr); err != nil {
			log.Fatalf("failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("shutting down server...")
}
