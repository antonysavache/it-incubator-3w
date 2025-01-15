import {Router} from "express";
import {SETTINGS} from "../../../settings";
import {authMiddleware} from "../../../shared/middlewares/auth.middleware";
import {handleValidationErrors} from "../../../shared/middlewares/error-handler.middleware";
import {postsController} from "./posts.controller";
import {postsValidation} from "./posts-validation.middleware";
import {postsRepository} from "./posts.repo";


export const postsRouter = Router({});

postsRouter.get(SETTINGS.PATH.ROOT, postsController.getPosts);
postsRouter.post(SETTINGS.PATH.ROOT,
    authMiddleware,
    postsValidation,
    handleValidationErrors,
    postsController.createPost);
postsRouter.get(SETTINGS.PATH.ROOT_ENTITY, postsController.getPost);
postsRouter.put(SETTINGS.PATH.ROOT_ENTITY, postsValidation, authMiddleware, handleValidationErrors, postsController.updatePost)
postsRouter.delete(SETTINGS.PATH.ROOT_ENTITY, authMiddleware, postsController.deletePost)