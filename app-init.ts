import { MongoClient, Db } from 'mongodb'
import {SETTINGS} from "./src/settings";
import {BlogsRepository, setBlogsRepository} from "./src/core/routes/blogs/blogs.repo";

export class AppInit {
    private static instance: AppInit | null = null
    private mongoClient: MongoClient | null = null
    private database: Db | null = null

    private constructor() {}

    // Singleton pattern to ensure only one instance exists
    public static getInstance(): AppInit {
        if (!AppInit.instance) {
            AppInit.instance = new AppInit()
        }
        return AppInit.instance
    }

    public async init(dbName: string = SETTINGS.DB_NAME, dbUrl: string = SETTINGS.DB_URL) {
        try {
            // Create MongoDB client
            this.mongoClient = new MongoClient(dbUrl)

            // Connect to the database
            await this.mongoClient.connect()
            console.log('Successfully connected to MongoDB')

            // Select the database
            this.database = this.mongoClient.db(dbName)

            // Initialize repositories
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

    // Method to initialize repositories
    private initializeRepositories() {
        if (!this.database) {
            throw new Error('Database not initialized')
        }

        // Initialize blogs repository
        const blogsCollection = this.database.collection('blogs')
        // @ts-ignore
        const blogsRepository = new BlogsRepository(blogsCollection)
        setBlogsRepository(blogsRepository)

        // You can add more repository initializations here
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