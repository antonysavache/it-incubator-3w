import { ObjectId } from 'mongodb'

export interface BlogDBModel {
    _id: ObjectId
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}

export interface BlogViewModel {
    id: string
    name: string
    description: string
    websiteUrl: string
}

export interface BlogCreateModel {
    name: string
    description: string
    websiteUrl: string
}

export type BlogUpdateModel = Partial<BlogCreateModel>