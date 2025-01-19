// src/core/routes/posts/posts.repo.ts
import { BaseRepository } from '../../../shared/base/repository.base'
import { PostCreateModel, PostDBModel, PostViewModel } from "../../../shared/models/posts"
import {Collection, Filter} from 'mongodb'

export class PostsRepository extends BaseRepository<PostDBModel, PostViewModel, PostCreateModel> {
    constructor(collection: Collection<PostDBModel>) {
        super(
            collection,
            (post) => ({
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt
            })
        )
    }

    async findByBlogId(blogId: string): Promise<PostViewModel[]> {
        const filter = { blogId } as Filter<PostDBModel>
        const posts = await this.collection.find(filter).toArray()
        return posts.map(this.mapDocument)
    }
}

export let postsRepository: BaseRepository<PostDBModel, PostViewModel, PostCreateModel>

export const setPostsRepository = (repo: BaseRepository<PostDBModel, PostViewModel, PostCreateModel>) => {
    postsRepository = repo
}