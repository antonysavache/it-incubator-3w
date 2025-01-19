import { app } from "./app"
import { SETTINGS } from "./settings"
import { BlogsRepository, setBlogsRepository } from "./core/routes/blogs/blogs.repo"
import { PostsRepository, setPostsRepository } from "./core/routes/posts/posts.repo"
import { AppInit } from "./shared/base/app-init.base"

const startApp = async () => {
    try {
        const appInit = new AppInit(
            SETTINGS.DB_NAME,
            SETTINGS.DB_URL
        )

        const { repositories } = await appInit.init([
            {
                name: 'blogs',
                repositoryClass: BlogsRepository
            },
            {
                name: 'posts',
                repositoryClass: PostsRepository
            }
        ])

        setBlogsRepository(repositories.blogs)
        setPostsRepository(repositories.posts)

        app.listen(SETTINGS.PORT, () => {
            console.log('Server started on port ' + SETTINGS.PORT)
        })
    } catch (error) {
        console.error('Failed to start app:', error)
        process.exit(1)
    }
}

startApp()