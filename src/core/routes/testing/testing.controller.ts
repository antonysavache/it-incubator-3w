import { Request, Response } from "express";
import {getBlogsRepositories} from "../blogs/blogs.repo";
import {getPostsRepositories} from "../posts/posts.repo";

export const testingController = {
    async deleteAll(req: Request, res: Response) {
        await getBlogsRepositories().deleteAll();
        await getPostsRepositories().deleteAll();
        res.sendStatus(204);
    }
}