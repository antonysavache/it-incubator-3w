import request from "supertest";
import {app} from "../../../app";
import {SETTINGS} from "../../../settings";
import {blogsMock, getBasicAuthHeader} from "../blogs/blogs.mock";
import {postsMock} from "./posts.mock";

describe('posts testing', () => {
    let createdBlog: any = null

    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204)

        const createBlogResponse = await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', getBasicAuthHeader())
            .send(blogsMock.correct)
            .expect(201)

        createdBlog = createBlogResponse.body
        postsMock.correct.blogId = createdBlog.id;
        postsMock.incorrectTitle.blogId = createdBlog.id;
        postsMock.incorrectContent.blogId = createdBlog.id;
        postsMock.incorrectDescription.blogId = createdBlog.id;
        postsMock.allFieldsEmpty.blogId = createdBlog.id;
    })

    describe('GET /posts', ()=> {
        describe('20*', () => {
            it('should return all posts', async () => {
                await request(app)
                    .get(SETTINGS.PATH.POSTS)
                    .expect(200)
                    .expect(res => {
                        expect(res.body).toEqual([])
                    })
            });
        })
    })

    describe('POST /posts', () => {
        describe('20*', () => {
            it('should create post with correct data', async () => {
                const response = await request(app)
                    .post(SETTINGS.PATH.POSTS)
                    .set('Authorization', getBasicAuthHeader())
                    .send(postsMock.correct)
                    .expect(201)

                expect(response.body).toEqual({
                    id: expect.any(String),
                    title: postsMock.correct.title,
                    shortDescription: postsMock.correct.shortDescription,
                    content: postsMock.correct.content,
                    blogId: createdBlog.id,
                    blogName: createdBlog.name,
                })
            })
        })

        describe('40*', () => {
            it('should return 400 with empty fields', async () => {
                await request(app)
                    .post(SETTINGS.PATH.POSTS)
                    .set('Authorization', getBasicAuthHeader())
                    .send(postsMock.allFieldsEmpty)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: expect.arrayContaining([
                                {
                                    message: expect.any(String),
                                    field: "title"
                                },
                                {
                                    message: expect.any(String),
                                    field: "shortDescription"
                                },
                                {
                                    message: expect.any(String),
                                    field: "content"
                                },
                            ])
                        })
                    })
            })

            it('should return 400 with too long title', async () => {
                await request(app)
                    .post(SETTINGS.PATH.POSTS)
                    .set('Authorization', getBasicAuthHeader())
                    .send(postsMock.incorrectTitle)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: "title"
                            }]
                        })
                    })
            })

            it('should return 400 with too long description', async () => {
                await request(app)
                    .post(SETTINGS.PATH.POSTS)
                    .set('Authorization', getBasicAuthHeader())
                    .send(postsMock.incorrectDescription)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: "shortDescription"
                            }]
                        })
                    })
            })

            it('should return 400 with too long content', async () => {
                await request(app)
                    .post(SETTINGS.PATH.POSTS)
                    .set('Authorization', getBasicAuthHeader())
                    .send(postsMock.incorrectContent)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: "content"
                            }]
                        })
                    })
            })

            it('should return 400 with non-existent blogId', async () => {
                await request(app)
                    .post(SETTINGS.PATH.POSTS)
                    .set('Authorization', getBasicAuthHeader())
                    .send({...postsMock.correct, blogId: "nonexistentId"})
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: "blogId"
                            }]
                        })
                    })
            })

            it('should return 401 without authorization', async () => {
                await request(app)
                    .post(SETTINGS.PATH.POSTS)
                    .send(postsMock.correct)
                    .expect(401)
            })
        })
    })

    describe('GET /posts/:id', () => {
        let createdPost: any = null;

        beforeAll(async () => {
            const createBlogResponse = await request(app)
                .post(SETTINGS.PATH.BLOGS)
                .set('Authorization', getBasicAuthHeader())
                .send(blogsMock.correct)
                .expect(201)

            const blog = createBlogResponse.body

            const createPostResponse = await request(app)
                .post(SETTINGS.PATH.POSTS)
                .set('Authorization', getBasicAuthHeader())
                .send({
                    title: "Test Title",
                    shortDescription: "Test Description",
                    content: "Test Content",
                    blogId: blog.id
                })
                .expect(201)

            createdPost = createPostResponse.body
        })

        describe('20*', () => {
            it('200/should return post by id', async () => {
                const response = await request(app)
                    .get(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
                    .expect(200)

                expect(response.body).toEqual(createdPost)
            })
        })

        describe('40*', () => {
            it('404/should return if post not found', async () => {
                await request(app)
                    .get(`${SETTINGS.PATH.POSTS}/123`)
                    .expect(404)
            })
        })
    })

    describe('PUT /posts/:id', () => {
        let createdBlog: any = null
        let createdPost: any = null

        beforeAll(async () => {
            await request(app)
                .delete('/testing/all-data')
                .expect(204)

            const createBlogResponse = await request(app)
                .post(SETTINGS.PATH.BLOGS)
                .set('Authorization', getBasicAuthHeader())
                .send(blogsMock.correct)
                .expect(201)

            createdBlog = createBlogResponse.body

            const createPostResponse = await request(app)
                .post(SETTINGS.PATH.POSTS)
                .set('Authorization', getBasicAuthHeader())
                .send({
                    title: "Test Title",
                    shortDescription: "Test Description",
                    content: "Test Content",
                    blogId: createdBlog.id
                })
                .expect(201)

            createdPost = createPostResponse.body
        }, 10000)

        describe('20*', () => {
            it('204/should update existing post with correct data', async () => {
                const updatedData = {
                    title: "Updated Title",
                    shortDescription: "Updated Description",
                    content: "Updated Content",
                    blogId: createdBlog.id
                }

                await request(app)
                    .put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
                    .set('Authorization', getBasicAuthHeader())
                    .send(updatedData)
                    .expect(204)

                const response = await request(app)
                    .get(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
                    .expect(200)

                expect(response.body).toEqual({
                    ...createdPost,
                    ...updatedData,
                })
            })
        })

        describe('40*', () => {
            it('400/should return error if title is too long', async () => {
                await request(app)
                    .put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
                    .set('Authorization', getBasicAuthHeader())
                    .send({
                        ...postsMock.correct,
                        title: "a".repeat(31),
                        blogId: createdBlog.id
                    })
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: "title"
                            }]
                        })
                    })
            })

            it('400/should return error if shortDescription is too long', async () => {
                await request(app)
                    .put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
                    .set('Authorization', getBasicAuthHeader())
                    .send({
                        ...postsMock.correct,
                        shortDescription: "a".repeat(101),
                        blogId: createdBlog.id
                    })
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: "shortDescription"
                            }]
                        })
                    })
            })

            it('400/should return error if content is too long', async () => {
                await request(app)
                    .put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
                    .set('Authorization', getBasicAuthHeader())
                    .send({
                        ...postsMock.correct,
                        content: "a".repeat(1001),
                        blogId: createdBlog.id
                    })
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: "content"
                            }]
                        })
                    })
            })

            it('400/should return error if blogId not found', async () => {
                await request(app)
                    .put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
                    .set('Authorization', getBasicAuthHeader())
                    .send({
                        ...postsMock.correct,
                        blogId: "nonexistentId"
                    })
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: "blogId"
                            }]
                        })
                    })
            })

            it('401/should return error if not authorized', async () => {
                await request(app)
                    .put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
                    .send(postsMock.correct)
                    .expect(401)
            })

            it('404/should return error if post not found', async () => {
                await request(app)
                    .put(`${SETTINGS.PATH.POSTS}/nonexistentId`)
                    .set('Authorization', getBasicAuthHeader())
                    .send({
                        ...postsMock.correct,
                        blogId: createdBlog.id
                    })
                    .expect(404)
            })
        })
    })

    describe('DELETE /posts/:id', () => {
        let createdBlog: any = null;
        let createdPost: any = null;

        beforeAll(async () => {
            await request(app)
                .delete('/testing/all-data')
                .expect(204)

            const createBlogResponse = await request(app)
                .post(SETTINGS.PATH.BLOGS)
                .set('Authorization', getBasicAuthHeader())
                .send(blogsMock.correct)
                .expect(201)

            createdBlog = createBlogResponse.body

            const createPostResponse = await request(app)
                .post(SETTINGS.PATH.POSTS)
                .set('Authorization', getBasicAuthHeader())
                .send({
                    title: "Test Title",
                    shortDescription: "Test Description",
                    content: "Test Content",
                    blogId: createdBlog.id
                })
                .expect(201)

            createdPost = createPostResponse.body
        }, 10000)

        describe('20*', () => {
            it('204/should delete existing post', async () => {
                await request(app)
                    .delete(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
                    .set('Authorization', getBasicAuthHeader())
                    .expect(204)

                await request(app)
                    .get(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
                    .expect(404)
            })
        })

        describe('40*', () => {
            it('401/should return error if not authorized', async () => {
                await request(app)
                    .delete(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
                    .expect(401)
            })

            it('404/should return error if post not found', async () => {
                await request(app)
                    .delete(`${SETTINGS.PATH.POSTS}/nonexistentId`)
                    .set('Authorization', getBasicAuthHeader())
                    .expect(404)
            })
        })
    })
})