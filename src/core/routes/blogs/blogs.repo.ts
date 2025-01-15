export type BlogType = {
    id: string
    name: string
    description: string
    websiteUrl: string
}

export class BlogsRepository {
    private blogs: BlogType[] = []

    createBlog(name: string, description: string, websiteUrl: string): BlogType {
        const newBlog: BlogType = {
            id: (+new Date()).toString(),
            name,
            description,
            websiteUrl
        }
        this.blogs.push(newBlog)
        return newBlog
    }

    findAllBlogs(): BlogType[] {
        return this.blogs
    }

    findBlogById(id: string): BlogType | null {
        const blog = this.blogs.find(blog => blog.id === id)
        return blog || null
    }

    updateBlog(id: string, name: string, description: string, websiteUrl: string): boolean {
        const blog = this.blogs.find(b => b.id === id)
        if (!blog) return false

        blog.name = name
        blog.description = description
        blog.websiteUrl = websiteUrl

        return true
    }

    deleteBlog(id: string): boolean {
        const blogIndex = this.blogs.findIndex(b => b.id === id)
        if (blogIndex === -1) return false

        this.blogs.splice(blogIndex, 1)
        return true
    }

    clearAll(): void {
        this.blogs = []
    }
}

export const blogsRepository = new BlogsRepository()