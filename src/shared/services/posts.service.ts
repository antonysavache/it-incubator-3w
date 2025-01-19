import {PostCreateModel, PostViewModel} from "../models/posts";
import {blogsRepository} from "../../core/routes/blogs/blogs.repo";
import {postsRepository} from "../../core/routes/posts/posts.repo";
import {TimestampService} from "./time-stamp.service";

export class PostService {
    async createPost(data: PostCreateModel): Promise<{
        createdAt: string;
        blogName: string;
        id: string;
        shortDescription: string;
        title: string;
        blogId: string;
        content: string
    }> {
        // Validate blog exists
        const blog = await blogsRepository.findById(data.blogId)
        if (!blog) {
            throw new Error('Blog not found')
        }

        // Create the post using the repository
        const post = await postsRepository.create(data)

        // Add business logic for additional properties
        return {
            ...post,
            createdAt: TimestampService.generate(),
            blogName: blog.name
        }
    }

    async findAllPosts(): Promise<PostViewModel[]> {
        const posts = await postsRepository.findAll()

        // Add business logic for additional properties
        return Promise.all(posts.map(async post => {
            const blog = await blogsRepository.findById(post.blogId)
            return {
                ...post,
                createdAt: TimestampService.generate(),
                blogName: blog?.name || ''
            }
        }))
    }

    async findPostById(id: string): Promise<{
        createdAt: string;
        blogName: string;
        id: string;
        shortDescription: string;
        title: string;
        blogId: string;
        content: string
    }> {
        const post = await postsRepository.findById(id)

        // Add business logic for additional properties
        if (post) {
            const blog = await blogsRepository.findById(post.blogId)
            return {
                ...post,
                createdAt: TimestampService.generate(),
                blogName: blog?.name || ''
            }
        }

        return null
    }
}

export const postService = new PostService()