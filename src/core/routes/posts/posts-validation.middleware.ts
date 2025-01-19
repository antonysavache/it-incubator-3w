import { body } from 'express-validator'
import {blogsRepository} from "../blogs/blogs.repo";

export const postsValidation = [
    body('blogId')
        .trim()
        .notEmpty().withMessage('Blog ID is required')
        .custom((blogId: string) => {
            const blog = blogsRepository.findById(blogId)
            if (!blog) {
                throw new Error('Blog not found')
            }
            return true
        }).withMessage('Blog not found'),

    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 30 }).withMessage('Title should not exceed 30 characters'),

    body('shortDescription')
        .trim()
        .notEmpty().withMessage('Short description is required')
        .isLength({ max: 100 }).withMessage('Short description should not exceed 100 characters'),

    body('content')
        .trim()
        .notEmpty().withMessage('Content is required')
        .isLength({ max: 1000 }).withMessage('Content should not exceed 1000 characters')
]