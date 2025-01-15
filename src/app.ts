import express from "express";
import {SETTINGS} from "./settings";
import {testingRouter} from "./core/routes/testing/testing.router";
import {blogsRouter} from "./core/routes/blogs/blogs.router";
import {postsRouter} from "./core/routes/posts/posts.router";

export const app = express();
app.use(express.json());

app.use(SETTINGS.PATH.TESTING, testingRouter);
app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);