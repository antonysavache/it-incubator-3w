import { Request, Response } from "express";
import {blogsRepository} from "../blogs/blogs.repo";
import {postsRepository} from "../posts/posts.repo";

export const testingController = {
    async deleteAll(req: Request, res: Response) {
        await blogsRepository.deleteAll();
        await postsRepository.deleteAll();
        res.sendStatus(204);
    }
}