import { MongoClient } from 'mongodb'
import {AppInit} from "./app-init.base";
import {CollectionConfig} from "../models/config";

export class BaseTestSetup {
    protected mongoClient: MongoClient | null = null

    constructor(
        protected readonly dbName: string = 'test-db',
        protected readonly dbUrl: string = 'mongodb://localhost:27017'
    ) {}

    protected async setupApp(collections: CollectionConfig[]) {
        try {
            const appInit = new AppInit(this.dbName, this.dbUrl)
            const { client } = await appInit.init(collections)
            this.mongoClient = client

            return { mongoClient: this.mongoClient }
        } catch (error) {
            console.error('Failed to initialize test database:', error)
            throw error
        }
    }

    async clearDb() {
        if (!this.mongoClient) {
            throw new Error('Database not initialized')
        }

        const db = this.mongoClient.db(this.dbName)
        const collections = await db.collections()

        await Promise.all(
            collections.map(collection => collection.deleteMany({}))
        )
    }

    async closeDb() {
        if (this.mongoClient) {
            await this.mongoClient.close()
            this.mongoClient = null
        }
    }
}