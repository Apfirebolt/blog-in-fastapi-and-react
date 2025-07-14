export interface BlogPost {
    id?: string
    title: string
    content: string
    author?: string
    createdAt?: string
    updatedAt?: string
}

export interface ApiResponse {
    data: BlogPost | BlogPost[]
    message?: string
}