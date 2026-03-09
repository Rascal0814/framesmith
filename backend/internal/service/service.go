package service

import (
	"fmt"
	"math/rand"
	"sync"
	"time"

	"samplehub/internal/model"
)

// VideoService handles video business logic
type VideoService struct {
	mu     sync.RWMutex
	videos map[string]*model.Video
	nextID int
}

// NewVideoService creates a new video service
func NewVideoService() *VideoService {
	s := &VideoService{
		videos: make(map[string]*model.Video),
		nextID: 1,
	}
	s.initDemoData()
	return s
}

func (s *VideoService) initDemoData() {
	demos := []*model.Video{
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
	for _, v := range demos {
		s.videos[v.ID] = v
	}
	s.nextID = 4
}

// List returns all videos
func (s *VideoService) List(category string) []*model.Video {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var result []*model.Video
	for _, v := range s.videos {
		if category == "" || v.Category == category {
			result = append(result, v)
		}
	}
	return result
}

// Get returns a video by ID
func (s *VideoService) Get(id string) (*model.Video, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	v, ok := s.videos[id]
	if ok {
		s.mu.RUnlock()
		s.mu.Lock()
		s.videos[id].Views++
		s.mu.Unlock()
		s.mu.RLock()
	}
	return v, ok
}

// Create creates a new video
func (s *VideoService) Create(req *model.VideoRequest) *model.Video {
	s.mu.Lock()
	defer s.mu.Unlock()

	now := time.Now().Format("2006-01-02")
	video := &model.Video{
		ID:          fmt.Sprintf("%d", s.nextID),
		Title:       req.Title,
		Description: req.Description,
		Category:    req.Category,
		Tags:        req.Tags,
		Thumbnail:   fmt.Sprintf("/videos/thumb-%d.jpg", s.nextID),
		VideoURL:    req.VideoURL,
		Duration:    req.Duration,
		Views:       0,
		CreatedAt:   now,
		UserID:      req.UserID,
	}
	if video.Duration == 0 {
		video.Duration = rand.Intn(240) + 60
	}
	s.videos[video.ID] = video
	s.nextID++
	return video
}

// UserService handles user business logic
type UserService struct {
	mu    sync.RWMutex
	users map[string]*model.User
}

// NewUserService creates a new user service
func NewUserService() *UserService {
	s := &UserService{
		users: make(map[string]*model.User),
	}
	s.initDemoData()
	return s
}

func (s *UserService) initDemoData() {
	s.users["1"] = &model.User{
		ID:         "1",
		Name:       "张伟",
		Avatar:     "/videos/avatar.jpg",
		Bio:        "资深视频剪辑师，8年从业经验，擅长广告、宣传片、短视频制作。曾服务于特斯拉、Nike、vivo等知名品牌。",
		Skills:     []string{"Premiere", "After Effects", "Final Cut Pro", "DaVinci Resolve", "C4D"},
		VideoCount: 3,
	}
}

// Get returns a user by ID
func (s *UserService) Get(id string) (*model.User, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	u, ok := s.users[id]
	return u, ok
}

// CategoryService handles category business logic
type CategoryService struct {
	categories []string
}

// NewCategoryService creates a new category service
func NewCategoryService() *CategoryService {
	return &CategoryService{
		categories: []string{
			"广告宣传", "产品展示", "游戏", "文化", "金融", "短视频", "纪录片",
		},
	}
}

// List returns all categories
func (s *CategoryService) List() []string {
	return s.categories
}
