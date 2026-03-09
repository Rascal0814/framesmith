package model

// Video represents a video work
type Video struct {
	ID          string   `json:"id"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Thumbnail   string   `json:"thumbnail"`
	VideoURL    string   `json:"video_url"`
	Category    string   `json:"category"`
	Tags        []string `json:"tags"`
	Duration    int      `json:"duration"`
	Views       int      `json:"views"`
	CreatedAt   string   `json:"created_at"`
	UserID      string   `json:"user_id"`
}

// User represents a video editor
type User struct {
	ID         string   `json:"id"`
	Name       string   `json:"name"`
	Avatar     string   `json:"avatar"`
	Bio        string   `json:"bio"`
	Skills     []string `json:"skills"`
	VideoCount int      `json:"video_count"`
}

// VideoRequest represents create video request
type VideoRequest struct {
	Title       string   `json:"title" binding:"required"`
	Description string   `json:"description" binding:"required"`
	Category    string   `json:"category" binding:"required"`
	Tags        []string `json:"tags"`
	VideoURL    string   `json:"video_url"`
	Duration    int      `json:"duration"`
	UserID      string   `json:"user_id"`
}
