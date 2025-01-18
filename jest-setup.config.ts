import { MongoClient } from 'mongodb'
import { SETTINGS } from './src/settings'

let mongoClient: MongoClient | null = null;

beforeAll(async () => {
    try {
        mongoClient = new MongoClient(SETTINGS.DB_URL, {
            connectTimeoutMS: 5000,
            socketTimeoutMS: 5000,
            waitQueueTimeoutMS: 5000
        });

        await mongoClient.connect();
        await mongoClient.db(SETTINGS.DB_NAME).command({ ping: 1 });
        console.log("Database connection established");
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
});

beforeEach(async () => {
    if (!mongoClient) {
        throw new Error("Database is not connected");
    }

    try {
        const db = mongoClient.db(SETTINGS.DB_NAME);
        await Promise.all([
            db.collection('blogs').deleteMany({}),
            db.collection('posts').deleteMany({})
        ]);
    } catch (error) {
        console.error("Failed to clear database:", error);
        throw error;
    }
});

afterAll(async () => {
    if (mongoClient) {
        await mongoClient.close();
        mongoClient = null;
        console.log("Database connection closed");
    }
});