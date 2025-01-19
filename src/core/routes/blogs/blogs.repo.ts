import { BaseRepository } from '../../../shared/base/repository.base'
import { BlogCreateModel, BlogDBModel, BlogViewModel } from "../../../shared/models/blogs"
import { Collection } from 'mongodb'

export class BlogsRepository extends BaseRepository<BlogDBModel, BlogViewModel, BlogCreateModel> {
    constructor(collection: Collection<BlogDBModel>) {
        super(
            collection,
            (blog) => ({
                id: blog._id.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt || new Date().toISOString(),
                isMembership: blog.isMembership ?? false
            })
        )
    }
}

export let blogsRepository: BaseRepository<BlogDBModel, BlogViewModel, BlogCreateModel>

export const setBlogsRepository = (repo: BaseRepository<BlogDBModel, BlogViewModel, BlogCreateModel>) => {
    blogsRepository = repo
}