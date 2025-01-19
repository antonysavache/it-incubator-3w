import { Request, Response } from "express";
import {blogsRepository} from "./blogs.repo";

export const blogsController = {
    async getBlogs(req: Request, res: Response) {
        const blogs = await blogsRepository.findAll();
        res.status(200).json(blogs);
    },

    async createBlog(req: Request, res: Response) {
        const { name, description, websiteUrl } = req.body;
        const newBlog = await blogsRepository.create({name, description, websiteUrl});
        res.status(201).json(newBlog);
    },

    async getBlog(req: Request, res: Response) {
        const blog = await blogsRepository.findById(req.params.id);
        if (!blog) {
            res.sendStatus(404);
            return
        }
        res.status(200).json(blog);
    },

    async updateBlog(req: Request, res: Response) {
        const { id } = req.params;
        const { name, description, websiteUrl } = req.body;

        const updated = await blogsRepository.update(id, {name, description, websiteUrl});
        if (!updated) {
            res.sendStatus(404);
            return
        }
        res.sendStatus(204);
    },

    async deleteBlog(req: Request, res: Response) {
        const { id } = req.params;
        const deleted = await blogsRepository.delete(id);
        if (!deleted) {
            res.sendStatus(404);
            return
        }
        res.sendStatus(204);
    }
}