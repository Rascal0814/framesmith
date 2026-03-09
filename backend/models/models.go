package models

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

type User struct {
	ID         string   `json:"id"`
	Name       string   `json:"name"`
	Avatar     string   `json:"avatar"`
	Bio        string   `json:"bio"`
	Skills     []string `json:"skills"`
	VideoCount int      `json:"video_count"`
}
