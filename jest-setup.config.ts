import { SETTINGS } from './src/settings'
import {AppInit} from "./app-init";

const testSetup = AppInit.getInstance()

beforeAll(async () => {
    await testSetup.init(SETTINGS.DB_NAME, SETTINGS.DB_URL)
}, 10000)

// beforeEach(async () => {
//     const database = testSetup.getDatabase() // You'll need to add this method to AppInit
//     const collections = await database.collections()
//     await Promise.all(collections.map(collection => collection.deleteMany({})))
// }, 10000)

afterAll(async () => {
    await testSetup.close()
}, 10000)