package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"samplehub/internal/model"
	"samplehub/internal/service"
)

// Handler holds all service dependencies
type Handler struct {
	videoService    *service.VideoService
	userService     *service.UserService
	categoryService *service.CategoryService
}

// New creates a new handler
func New() *Handler {
	return &Handler{
		videoService:    service.NewVideoService(),
		userService:     service.NewUserService(),
		categoryService: service.NewCategoryService(),
	}
}

// ListVideos handles GET /api/videos
func (h *Handler) ListVideos(c *gin.Context) {
	category := c.Query("category")
	videos := h.videoService.List(category)
	c.JSON(http.StatusOK, videos)
}

// GetVideo handles GET /api/videos/:id
func (h *Handler) GetVideo(c *gin.Context) {
	id := c.Param("id")
	video, ok := h.videoService.Get(id)
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "video not found"})
		return
	}
	c.JSON(http.StatusOK, video)
}

// CreateVideo handles POST /api/videos
func (h *Handler) CreateVideo(c *gin.Context) {
	var req model.VideoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	video := h.videoService.Create(&req)
	c.JSON(http.StatusCreated, video)
}

// GetUser handles GET /api/users/:id
func (h *Handler) GetUser(c *gin.Context) {
	id := c.Param("id")
	user, ok := h.userService.Get(id)
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}

// ListCategories handles GET /api/categories
func (h *Handler) ListCategories(c *gin.Context) {
	categories := h.categoryService.List()
	c.JSON(http.StatusOK, categories)
}

// HealthCheck handles GET /health
func (h *Handler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
