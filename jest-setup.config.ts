import { BaseTestSetup } from "./src/shared/base/jest-setup.base"
import { SETTINGS } from "./src/settings"

class TestSetup extends BaseTestSetup {
    async init() {
        const collections = [
            { name: 'blogs' },
            { name: 'posts' }
        ]

        return this.setupApp(collections)
    }
}

const testSetup = new TestSetup(
    SETTINGS.DB_NAME,
    SETTINGS.DB_URL
)

beforeAll(async () => {
    await testSetup.init()
})

beforeEach(async () => {
    await testSetup.clearDb()
})

afterAll(async () => {
    await testSetup.closeDb()
})