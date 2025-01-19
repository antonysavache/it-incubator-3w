import { MongoClient, Db } from 'mongodb'
import { SETTINGS } from "./src/settings"
import { BlogsRepository, setBlogsRepository } from "./src/core/routes/blogs/blogs.repo"
import { PostsRepository, setPostsRepository } from "./src/core/routes/posts/posts.repo"

export class AppInit {
    private static instance: AppInit | null = null
    private mongoClient: MongoClient | null = null
    private database: Db | null = null

    private constructor() {}

    public static getInstance(): AppInit {
        if (!AppInit.instance) {
            AppInit.instance = new AppInit()
        }
        return AppInit.instance
    }

    public async init(dbName: string = SETTINGS.DB_NAME, dbUrl: string = SETTINGS.DB_URL) {
        try {
            this.mongoClient = new MongoClient(dbUrl)
            await this.mongoClient.connect()
            console.log('Successfully connected to MongoDB')

            this.database = this.mongoClient.db(dbName)
            this.initializeRepositories()

            return {
                mongoClient: this.mongoClient,
                database: this.database
            }
        } catch (error) {
            console.error('Failed to initialize application:', error)
            throw error
        }
    }

    private initializeRepositories() {
        if (!this.database) {
            throw new Error('Database not initialized')
        }

        // Initialize blogs repository
        const blogsCollection = this.database.collection('blogs')
        // @ts-ignore
        const blogsRepository = new BlogsRepository(blogsCollection)
        setBlogsRepository(blogsRepository)

        // Initialize posts repository
        const postsCollection = this.database.collection('posts')
        // @ts-ignore
        const postsRepository = new PostsRepository(postsCollection)
        setPostsRepository(postsRepository)
    }

    public async close() {
        if (this.mongoClient) {
            await this.mongoClient.close()
            this.mongoClient = null
            this.database = null
        }
    }
}

export const initializeApp = async () => {
    const appInit = AppInit.getInstance()
    return appInit.init()
}