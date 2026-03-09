package router

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"samplehub/internal/handler"
)

// New creates a new router
func New(h *handler.Handler) *gin.Engine {
	gin.SetMode(gin.ReleaseMode)

	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next()
	})

	// Health check
	r.GET("/health", h.HealthCheck)

	// API routes
	api := r.Group("/api")
	{
		// Video routes
		api.GET("/videos", h.ListVideos)
		api.GET("/videos/:id", h.GetVideo)
		api.POST("/videos", h.CreateVideo)

		// User routes
		api.GET("/users/:id", h.GetUser)

		// Category routes
		api.GET("/categories", h.ListCategories)
	}

	return r
}
