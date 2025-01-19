import { Request, Response } from "express";
import { postsRepository } from "./posts.repo";
import {TimestampService} from "../../../shared/services/time-stamp.service";
import {postService} from "../../../shared/services/posts.service";

export const postsController = {
    async getPosts(req: Request, res: Response) {
        // Reset timestamp before each operation to ensure consistency
        TimestampService.reset()
        const posts = await postService.findAllPosts();
        res.status(200).json(posts);
    },

    async createPost(req: Request, res: Response) {
        // Reset timestamp before each operation to ensure consistency
        TimestampService.reset()
        const { title, shortDescription, content, blogId } = req.body;
        // @ts-ignore
        const newPost = await postService.createPost({
            title,
            shortDescription,
            content,
            blogId
        });
        res.status(201).json(newPost);
    },

    async getPost(req: Request, res: Response) {
        // Reset timestamp before each operation to ensure consistency
        TimestampService.reset()
        const post = await postService.findPostById(req.params.id);
        if (!post) {
            res.sendStatus(404);
            return
        }
        res.status(200).json(post);
    },

    async updatePost(req: Request, res: Response) {
        const { id } = req.params;
        const { title, shortDescription, content, blogId } = req.body;

        const updated = await postsRepository.update(id, {
            title,
            shortDescription,
            content,
            blogId
        });

        if (!updated) {
            res.sendStatus(404);
            return
        }
        res.sendStatus(204);
    },

    async deletePost(req: Request, res: Response) {
        const { id } = req.params;
        const deleted = await postsRepository.delete(id);
        if (!deleted) {
            res.sendStatus(404);
            return
        }
        res.sendStatus(204);
    }
}