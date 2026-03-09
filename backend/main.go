package main

import (
	"fmt"
	"log"
	"net/http"

	"samplehub/config"
	"samplehub/handlers"
)

func main() {
	// 初始化
	handlers.Init()

	// 注册路由
	mux := http.NewServeMux()

	// 视频相关
	mux.HandleFunc("/api/videos", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "GET":
			handlers.GetVideos(w, r)
		case "POST":
			handlers.CreateVideo(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/api/videos/", handlers.GetVideo)
	mux.HandleFunc("/api/users/", handlers.GetUser)
	mux.HandleFunc("/api/categories", handlers.GetCategories)

	// 启动服务器
	fmt.Println("🚀 Backend server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", config.CORS(mux)))
}
