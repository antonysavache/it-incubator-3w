export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    DB_NAME: 'blogs-platform',
    DB_URL: 'mongodb+srv://admin:admin@lessons.x4ym2.mongodb.net/?retryWrites=true&w=majority&appName=lessons',
    PATH: {
        ROOT: '/',
        ROOT_ENTITY: '/:id',
        TESTING: '/testing',
        ALL_DATA: '/all-data',
        TESTING_DELETE: '/testing/all-data',
        BLOGS: '/blogs',
        POSTS: '/posts'
    },
}

