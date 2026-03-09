package handlers

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"samplehub/models"
)

var videos = []models.Video{
	{
		ID:          "1",
		Title:       "特斯拉自动驾驶宣传片",
		Description: "为特斯拉中国区制作的自动驾驶功能展示视频，包含城市道路和高速场景",
		Thumbnail:   "/videos/thumb-1.jpg",
		VideoURL:    "/videos/demo.mp4",
		Category:    "广告宣传",
		Tags:        []string{"汽车", "自动驾驶", "科技"},
		Duration:    180,
		Views:       12500,
		CreatedAt:   "2026-02-15",
		UserID:      "1",
	},
	{
		ID:          "2",
		Title:       "Nike跑步产品短片",
		Description: "Nike Flyknit系列跑鞋广告，展现运动激情与产品性能",
		Thumbnail:   "/videos/thumb-2.jpg",
		VideoURL:    "/videos/demo.mp4",
		Category:    "广告宣传",
		Tags:        []string{"运动", "Nike", "跑步"},
		Duration:    120,
		Views:       8900,
		CreatedAt:   "2026-02-10",
		UserID:      "1",
	},
	{
		ID:          "3",
		Title:       "vivo X100产品视频",
		Description: "vivo X100智能手机发布会开场视频，展示夜景拍摄功能",
		Thumbnail:   "/videos/thumb-3.jpg",
		VideoURL:    "/videos/demo.mp4",
		Category:    "产品展示",
		Tags:        []string{"手机", "摄影", "夜景"},
		Duration:    240,
		Views:       15200,
		CreatedAt:   "2026-01-28",
		UserID:      "1",
	},
}

var users = map[string]models.User{
	"1": {
		ID:         "1",
		Name:       "张伟",
		Avatar:     "/videos/avatar.jpg",
		Bio:        "资深视频剪辑师，8年从业经验，擅长广告、宣传片、短视频制作。曾服务于特斯拉、Nike、vivo等知名品牌。",
		Skills:     []string{"Premiere", "After Effects", "Final Cut Pro", "DaVinci Resolve", "C4D"},
		VideoCount: 3,
	},
}

var categories = []string{"广告宣传", "产品展示", "游戏", "文化", "金融", "短视频", "纪录片"}

// GetVideos 获取视频列表
func GetVideos(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	category := r.URL.Query().Get("category")

	if category != "" {
		var filtered []models.Video
		for _, v := range videos {
			if v.Category == category {
				filtered = append(filtered, v)
			}
		}
		json.NewEncoder(w).Encode(filtered)
		return
	}

	json.NewEncoder(w).Encode(videos)
}

// GetVideo 获取单个视频详情
func GetVideo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id := r.URL.Path[len("/api/videos/"):]

	for i, v := range videos {
		if v.ID == id {
			videos[i].Views++
			json.NewEncoder(w).Encode(videos[i])
			return
		}
	}

	http.Error(w, `{"error": "Video not found"}`, http.StatusNotFound)
}

// CreateVideo 创建视频
func CreateVideo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var video models.Video
	if err := json.NewDecoder(r.Body).Decode(&video); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	video.ID = strconv.Itoa(len(videos) + 1)
	video.CreatedAt = time.Now().Format("2006-01-02")
	video.Views = 0
	video.Thumbnail = fmt.Sprintf("/videos/thumb-%d.jpg", len(videos)+1)
	video.VideoURL = "/videos/demo.mp4"

	videos = append(videos, video)
	json.NewEncoder(w).Encode(video)
}

// GetUser 获取用户信息
func GetUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id := r.URL.Path[len("/api/users/"):]

	if user, ok := users[id]; ok {
		json.NewEncoder(w).Encode(user)
		return
	}

	http.Error(w, `{"error": "User not found"}`, http.StatusNotFound)
}

// GetCategories 获取分类列表
func GetCategories(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categories)
}

// Init 初始化数据（防止编译器优化）
func Init() {
	rand.Seed(time.Now().UnixNano())
}
