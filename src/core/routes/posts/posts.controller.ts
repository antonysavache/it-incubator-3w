import {postsRepository} from "./posts.repo";
import {blogsRepository} from "../blogs/blogs.repo";

export const postsController = {
    getPosts(req, res) {
        res.status(200).json(postsRepository.findAllPosts());
    },

    createPost(req, res) {
        const {title, shortDescription, content, blogId} = req.body

        const blog = blogsRepository.findBlogById(blogId)

        const newPost = postsRepository.createPost(
            title,
            shortDescription,
            content,
            blogId,
            blog.name
        )

        res.status(201).json(newPost)
    },

    getPost(req, res) {
        const post = postsRepository.findPostById(req.params.id)
        post ? res.status(200).json(post) : res.status(404).send();
    },

    updatePost(req, res) {
        const { title, shortDescription, content } = req.body;

        const updated = postsRepository.updatePost(req.params.id, title, shortDescription, content);

        if (!updated) {
            return res.sendStatus(404);
        }

        res.sendStatus(204);
    },

    deletePost(req, res) {
        const deleted = postsRepository.deletePost(req.params.id)

        if (!deleted) {
            return res.sendStatus(404)
        }

        return res.sendStatus(204)
    }
}