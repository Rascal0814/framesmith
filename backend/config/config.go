package config

import "net/http"

// Route 定义路由结构
type Route struct {
	Method  string
	Path    string
	Handler http.HandlerFunc
}

// Routes 路由列表
var Routes = []Route{
	{"GET", "/api/videos", getVideos},
	{"POST", "/api/videos", createVideo},
	{"GET", "/api/videos/", getVideo},
	{"GET", "/api/users/", getUser},
	{"GET", "/api/categories", getCategories},
}

// CORS 中间件
func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}
