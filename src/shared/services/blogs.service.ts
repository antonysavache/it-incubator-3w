import {BlogCreateModel, BlogViewModel} from "../models/blogs";
import {blogsRepository} from "../../core/routes/blogs/blogs.repo";
import {TimestampService} from "./time-stamp.service";

export class BlogService {
    async createBlog(data: BlogCreateModel): Promise<BlogViewModel> {
        // Create the blog using the repository
        const blog = await blogsRepository.create(data)

        // Add business logic for additional properties
        return {
            ...blog,
            createdAt: TimestampService.generate(),
            isMembership: false
        }
    }

    async findAllBlogs(): Promise<BlogViewModel[]> {
        const blogs = await blogsRepository.findAll()

        // Add business logic for additional properties
        return blogs.map(blog => ({
            ...blog,
            createdAt: TimestampService.generate(),
            isMembership: false
        }))
    }

    async findBlogById(id: string): Promise<BlogViewModel | null> {
        const blog = await blogsRepository.findById(id)

        // Add business logic for additional properties
        if (blog) {
            return {
                ...blog,
                createdAt: TimestampService.generate(),
                isMembership: false
            }
        }

        return null
    }
}

export const blogService = new BlogService()