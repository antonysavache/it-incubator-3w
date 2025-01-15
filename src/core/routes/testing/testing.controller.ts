import {blogsRepository} from "../blogs/blogs.repo";
import {postsRepository} from "../posts/posts.repo";

export const testingController = {
    deleteAll(req, res) {
        blogsRepository.clearAll();
        postsRepository.clearAll();
        res.status(204).send();
    }
}