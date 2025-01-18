import request from 'supertest'
import {app} from "../../../app"
import {SETTINGS} from "../../../settings"
import {basicAuthMock, blogsMock, getBasicAuthHeader} from "./blogs.mock"
import {launchBlogsRepositories} from "./blogs.repo";

describe('blogs testing', () => {
    beforeAll(async () => {
        await launchBlogsRepositories()
    })

    describe('GET /blogs', () => {
        it('should return array with created blogs', async () => {
            return request(app)
                .get(SETTINGS.PATH.BLOGS)
                .expect(200)
                .expect(res => {
                    expect(res.body).toEqual([])
                })
        })
    })

    describe('POST /blogs', () => {
        describe('20*', ()=> {
            it('201/create blog with the correct data', async () => {
                const createdResponse = await request(app)
                    .post(SETTINGS.PATH.BLOGS)
                    .set('Authorization', getBasicAuthHeader())
                    .send(blogsMock.correct)
                    .expect(201)

                expect(createdResponse.body).toEqual({
                    id: expect.any(String),
                    ...blogsMock.correct,
                    createdAt: expect.any(String)
                })

                const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
                expect(createdResponse.body.createdAt).toMatch(isoDateRegex)
            })
        })

        describe('40*', ()=> {
            it('400/shouldn/t create with incorrect name', async () => {
                await request(app)
                    .post(SETTINGS.PATH.BLOGS)
                    .set('Authorization', getBasicAuthHeader())
                    .send(blogsMock.incorrectName)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: 'name'
                            }]
                        })
                    })
            })

            it('400/shouldn/t create with incorrect description', async () => {
                await request(app)
                    .post(SETTINGS.PATH.BLOGS)
                    .set('Authorization', getBasicAuthHeader())
                    .send(blogsMock.incorrectDescription)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: 'description'
                            }]
                        })
                    })
            })

            it('400/shouldn/t create with incorrect url', async () => {
                await request(app)
                    .post(SETTINGS.PATH.BLOGS)
                    .set('Authorization', getBasicAuthHeader())
                    .send(blogsMock.incorrectUrl)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: 'websiteUrl'
                            }]
                        })
                    })
            })

            it('400/shouldn/t create with all incorrect fields', async () => {
                await request(app)
                    .post(SETTINGS.PATH.BLOGS)
                    .set('Authorization', getBasicAuthHeader())
                    .send(blogsMock.incorrect)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: expect.arrayContaining([
                                {
                                    message: expect.any(String),
                                    field: "name"
                                },
                                {
                                    message: expect.any(String),
                                    field: "description"
                                },
                                {
                                    message: expect.any(String),
                                    field: "websiteUrl"
                                }
                            ])
                        })
                        expect(res.body.errorsMessages).toHaveLength(3)
                    })
            })

            it('400/should/t create with url having multiple validation errors', async () => {
                const blogWithBadUrl = {
                    ...blogsMock.correct,
                    websiteUrl: "badurl" + "a".repeat(100)
                }

                await request(app)
                    .post(SETTINGS.PATH.BLOGS)
                    .set('Authorization', getBasicAuthHeader())
                    .send(blogWithBadUrl)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: 'websiteUrl'
                            }]
                        })
                        expect(res.body.errorsMessages).toHaveLength(1)
                    })
            })
        })

        it('401/should not create unauthorized', async () => {
            const createdResponse = await request(app)
                .post(SETTINGS.PATH.BLOGS)
                .set('Authorization', basicAuthMock.incorrect.login + basicAuthMock.incorrect.password)
                .send(blogsMock.correct)
                .expect(401)

            expect(createdResponse.body).toEqual({})
        })
    })

    describe('GET /blogs/:id', () => {
        let createdBlog: any = null

        beforeAll(async () => {
            await request(app)
                .delete('/testing/all-data')
                .expect(204)

            const createResponse = await request(app)
                .post(SETTINGS.PATH.BLOGS)
                .set('Authorization', getBasicAuthHeader())
                .send(blogsMock.correct)
                .expect(201)

            createdBlog = createResponse.body
        })

        describe('20*', () => {
            it('200/should return blog by id', async () => {
                const response = await request(app)
                    .get(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
                    .expect(200)

                expect(response.body).toEqual(createdBlog)
            })
        })

        describe('40*', () => {
            it('404/should return if blog not found', async () => {
                await request(app)
                    .get(`${SETTINGS.PATH.BLOGS}/nonexistentid`)
                    .expect(404)
            })
        })
    })

    describe('PUT /blogs/:id', () => {
        let createdBlog: any = null

        beforeAll(async () => {
            await request(app)
                .delete('/testing/all-data')
                .expect(204)

            const createResponse = await request(app)
                .post(SETTINGS.PATH.BLOGS)
                .set('Authorization', getBasicAuthHeader())
                .send(blogsMock.correct)
                .expect(201)

            createdBlog = createResponse.body
        })

        describe('20*', () => {
            it('204/should update existing blog with correct fields', async () => {
                const updatedData = {
                    name: "Upd Blog Name",
                    description: "Updated Blog Description",
                    websiteUrl: "https://updated.com"
                }

                await request(app)
                    .put(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
                    .set('Authorization', getBasicAuthHeader())
                    .send(updatedData)
                    .expect(204)

                const response = await request(app)
                    .get(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
                    .expect(200)

                expect(response.body).toEqual({
                    ...createdBlog,
                    ...updatedData
                })
            })
        })

        describe('40*', () => {
            it('400/If the inputModel has incorrect values', async () => {
                const incorrectData = {
                    name: "",
                    description: "Valid Description",
                    websiteUrl: "https://valid-url.com"
                }

                await request(app)
                    .put(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
                    .set('Authorization', getBasicAuthHeader())
                    .send(incorrectData)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: 'name'
                            }]
                        })
                    })
            })

            it('400/If the inputModel has incorrect URL format', async () => {
                const incorrectUrlData = {
                    name: "Valid Name",
                    description: "Valid Description",
                    websiteUrl: "invalid-url"
                }

                await request(app)
                    .put(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
                    .set('Authorization', getBasicAuthHeader())
                    .send(incorrectUrlData)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: 'websiteUrl'
                            }]
                        })
                    })
            })

            it('400/If the inputModel has all fields incorrect', async () => {
                const allIncorrectData = {
                    name: "",
                    description: "",
                    websiteUrl: "invalid-url"
                }

                await request(app)
                    .put(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
                    .set('Authorization', getBasicAuthHeader())
                    .send(allIncorrectData)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: expect.arrayContaining([
                                {
                                    message: expect.any(String),
                                    field: 'name'
                                },
                                {
                                    message: expect.any(String),
                                    field: 'description'
                                },
                                {
                                    message: expect.any(String),
                                    field: 'websiteUrl'
                                }
                            ])
                        })
                        expect(res.body.errorsMessages).toHaveLength(3)
                    })
            })

            it('401/If the user is unauthorized', async () => {
                const updatedData = {
                    name: "Updated Blog Name",
                    description: "Updated Blog Description",
                    websiteUrl: "https://updated.com"
                }

                await request(app)
                    .put(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
                    .set('Authorization', basicAuthMock.incorrect.login + basicAuthMock.incorrect.password)
                    .send(updatedData)
                    .expect(401)
            })

            it('404/If the blog does not exist', async () => {
                const updatedData = {
                    name: "Upd Blog Name",
                    description: "Updated Blog Description",
                    websiteUrl: "https://updated.com"
                }

                await request(app)
                    .put(`${SETTINGS.PATH.BLOGS}/nonexistent-id`)
                    .set('Authorization', getBasicAuthHeader())
                    .send(updatedData)
                    .expect(404)
            })
        })
    })

    describe('DELETE /blogs/:id', () => {
        let createdBlog: any = null

        beforeAll(async () => {
            await request(app)
                .delete('/testing/all-data')
                .expect(204)

            const createResponse = await request(app)
                .post(SETTINGS.PATH.BLOGS)
                .set('Authorization', getBasicAuthHeader())
                .send(blogsMock.correct)
                .expect(201)

            createdBlog = createResponse.body
        })

        describe('20*', () => {
            it('204/should delete existing blog', async () => {
                await request(app)
                    .delete(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
                    .set('Authorization', getBasicAuthHeader())
                    .expect(204)

                await request(app)
                    .get(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
                    .expect(404)
            })
        })

        describe('40*', () => {
            it('401/should not delete blog if unauthorized', async () => {
                await request(app)
                    .delete(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
                    .set('Authorization', basicAuthMock.incorrect.login + basicAuthMock.incorrect.password)
                    .expect(401)
            })

            it('404/should not delete non-existent blog', async () => {
                await request(app)
                    .delete(`${SETTINGS.PATH.BLOGS}/nonexistent-id`)
                    .set('Authorization', getBasicAuthHeader())
                    .expect(404)
            })
        })
    })
})