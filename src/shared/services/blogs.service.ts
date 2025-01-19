import {BlogCreateModel, BlogViewModel} from "../models/blogs";
import {blogsRepository} from "../../core/routes/blogs/blogs.repo";

export class BlogService {
    async createBlog(data: BlogCreateModel): Promise<BlogViewModel> {
        const blog = await blogsRepository.create(data)

        return {
            ...blog,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
    }

    async findAllBlogs(): Promise<BlogViewModel[]> {
        const blogs = await blogsRepository.findAll()

        return blogs.map(blog => ({
            ...blog,
            createdAt: blog.createdAt || new Date().toISOString(),
            isMembership: false
        }))
    }

    async findBlogById(id: string): Promise<BlogViewModel | null> {
        const blog = await blogsRepository.findById(id)

        if (blog) {
            return {
                ...blog,
                createdAt: blog.createdAt || new Date().toISOString(),
                isMembership: false
            }
        }

        return null
    }
}

export const blogService = new BlogService()