import { ObjectId } from 'mongodb'

export interface PostDBModel {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export interface PostViewModel {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}

export interface PostCreateModel {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}

export type PostUpdateModel = Partial<PostCreateModel>