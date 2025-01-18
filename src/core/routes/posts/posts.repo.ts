import { BaseRepository } from '../../../shared/base/repository.base'
import { Filter } from 'mongodb'
import {PostCreateModel, PostDBModel, PostViewModel} from "../../../shared/models/posts";
import {getPostsCollection} from "../../../shared/db/mongo-db";

class PostsRepository extends BaseRepository<PostDBModel, PostViewModel, PostCreateModel> {
    constructor() {
        super(
            getPostsCollection(),
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

let postsRepository: PostsRepository;

export function launchPostsRepositories() {
    postsRepository = new PostsRepository();
}

export function getPostsRepositories() {
    return postsRepository;
}

