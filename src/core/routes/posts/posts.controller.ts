import { Request, Response } from "express";
import { getBlogsRepositories} from "../blogs/blogs.repo";
import {getPostsRepositories} from "./posts.repo";

export const postsController = {
    async getPosts(req: Request, res: Response) {
        const posts = await getPostsRepositories().findAll();
        res.status(200).json(posts);
    },

    async createPost(req: Request, res: Response) {
        const { title, shortDescription, content, blogId } = req.body;
        const blog = await getBlogsRepositories().findById(blogId);

        if (!blog) {
            res.sendStatus(404);
            return
        }

        const newPost = await getPostsRepositories().create(
            {
                title,
                shortDescription,
                content,
                blogId,
                blogName: blog.name
            }
        );

        res.status(201).json(newPost);
    },

    async getPost(req: Request, res: Response) {
        const post = await getPostsRepositories().findById(req.params.id);
        if (!post) {
            res.sendStatus(404);
            return
        }
        res.status(200).json(post);
    },

    async updatePost(req: Request, res: Response) {
        const { id } = req.params;
        const { title, shortDescription, content } = req.body;

        const updated = await getPostsRepositories().update(id, {title, shortDescription, content});
        if (!updated) {
            res.sendStatus(404);
            return
        }
        res.sendStatus(204);
    },

    async deletePost(req: Request, res: Response) {
        const { id } = req.params;
        const deleted = await getPostsRepositories().delete(id);
        if (!deleted) {
            res.sendStatus(404);
            return
        }
        res.sendStatus(204);
    }
}