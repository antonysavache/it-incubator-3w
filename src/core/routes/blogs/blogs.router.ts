import {Router} from "express";
import {handleValidationErrors} from "../../../shared/middlewares/error-handler.middleware";
import {blogsValidation} from "./blogs-validation.middleware";
import {authMiddleware} from "../../../shared/middlewares/auth.middleware";
import {blogsController} from "./blogs.controller";
import {SETTINGS} from "../../../settings";

export const blogsRouter = Router({});

blogsRouter.get(SETTINGS.PATH.ROOT, blogsController.getBlogs);
blogsRouter.post(SETTINGS.PATH.ROOT, blogsValidation, authMiddleware, handleValidationErrors, blogsController.createBlog);
blogsRouter.get(SETTINGS.PATH.ROOT_ENTITY, blogsController.getBlog);
blogsRouter.put(SETTINGS.PATH.ROOT_ENTITY, blogsValidation, authMiddleware, handleValidationErrors, blogsController.updateBlog)
blogsRouter.delete(SETTINGS.PATH.ROOT_ENTITY, authMiddleware, blogsController.deleteBlog)