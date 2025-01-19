import { Collection, MongoClient } from 'mongodb'
import {BaseRepository} from "./repository.base";
import {CollectionConfig, DbSetupResult} from "../models/config";

export class AppInit {
    constructor(
        private readonly dbName: string,
        private readonly dbUrl: string
    ) {}

    private async connectToDB(): Promise<MongoClient> {
        try {
            const client = new MongoClient(this.dbUrl)
            await client.connect()

            await client.db(this.dbName).command({ ping: 1 })
            console.log('Successfully connected to MongoDB')

            return client
        } catch (error) {
            console.error('Failed to connect to db:', error)
            throw new Error('DB Connection failed')
        }
    }

    private async setupCollectionsAndRepositories(
        client: MongoClient,
        collectionConfigs: CollectionConfig[]
    ): Promise<{
        collections: { [key: string]: Collection<any> },
        repositories: { [key: string]: BaseRepository<any, any, any> }
    }> {
        try {
            const db = client.db(this.dbName)
            const collections: { [key: string]: Collection<any> } = {}
            const repositories: { [key: string]: BaseRepository<any, any, any> } = {}

            for (const config of collectionConfigs) {
                collections[config.name] = db.collection(config.name)

                if (config.repositoryClass) {
                    repositories[config.name] = new config.repositoryClass(
                        collections[config.name]
                    )
                }
            }

            return { collections, repositories }
        } catch (error) {
            console.error('Failed to setup collections and repositories:', error)
            throw new Error('Collections and repositories setup failed')
        }
    }

    async init(collectionConfigs: CollectionConfig[]): Promise<DbSetupResult> {
        const client = await this.connectToDB()
        const { collections, repositories } = await this.setupCollectionsAndRepositories(
            client,
            collectionConfigs
        )

        return {
            client,
            collections,
            repositories
        }
    }
}