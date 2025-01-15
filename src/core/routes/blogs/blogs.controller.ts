import {blogsRepository} from "./blogs.repo";

export const blogsController = {
    getBlogs(req, res) {
        res.status(200).json(blogsRepository.findAllBlogs());
    },

    createBlog(req, res) {
        const {name, description, websiteUrl} = req.body
        const newBlog = blogsRepository.createBlog(name, description, websiteUrl)
        res.status(201).json(newBlog)
    },

    getBlog(req, res) {
        const blog = blogsRepository.findBlogById(req.params.id)

        if (!blog) {
            return res.sendStatus(404)
        }

        res.status(200).json(blog)
    },

    updateBlog(req, res) {
        const { id } = req.params;
        const { name, description, websiteUrl } = req.body;

        const updated = blogsRepository.updateBlog(id, name, description, websiteUrl);

        if (!updated) {
            return res.sendStatus(404);
        }

        res.sendStatus(204);
    },

    deleteBlog(req, res) {
        const { id } = req.params;

        const deleted = blogsRepository.deleteBlog(id);

        if (!deleted) {
            return res.sendStatus(404);
        }

        res.sendStatus(204);
    }
}