import { Collection, MongoClient} from "mongodb";
import {SETTINGS} from "../../settings";
import {BlogDBModel} from "../models/blogs";
import {PostDBModel} from "../models/posts";

let client: MongoClient;
let blogsCollection: Collection<BlogDBModel>;
let postsCollection: Collection<PostDBModel>;

export async function runDb() {
    if (client) {
        return client;
    }

    try {
        client = new MongoClient(SETTINGS.DB_URL, {
            connectTimeoutMS: 5000,
            socketTimeoutMS: 5000,
            waitQueueTimeoutMS: 5000
        });

        await client.connect();

        const db = client.db(SETTINGS.DB_NAME);
        blogsCollection = db.collection<BlogDBModel>('blogs');
        postsCollection = db.collection<PostDBModel>('posts');

        await db.command({ ping: 1 });
        console.log("Connected successfully to mongo server");

        return true;
    } catch (error) {
        console.error("Database connection failed:", error);
        if (client) {
            await client.close();
        }
        throw false;
    }
}

export function getDbClient() {
    return client;
}

export function getBlogsCollection() {
    return blogsCollection;
}

export function getPostsCollection() {
    return postsCollection;
}