import {BaseRepository} from '../../../shared/base/repository.base'
import {getBlogsCollection} from '../../../shared/db/mongo-db'
import {BlogCreateModel, BlogDBModel, BlogViewModel} from "../../../shared/models/blogs";

class BlogsRepository extends BaseRepository<BlogDBModel, BlogViewModel, BlogCreateModel> {
    constructor() {
        super(
            getBlogsCollection(),
            (blog) => ({
                id: blog._id.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt
            })
        )
    }
}

let blogsRepository: BlogsRepository;

export function launchBlogsRepositories() {
    blogsRepository = new BlogsRepository();
}

export function getBlogsRepositories() {
    return blogsRepository;
}

