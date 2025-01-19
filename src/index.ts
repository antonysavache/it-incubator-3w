import { app } from './app'
import {AppInit} from "../app-init";

const startServer = async () => {
    try {
        await AppInit.getInstance().init()

        const PORT = process.env.PORT || 3000
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        console.error('Failed to start the server:', error)
        process.exit(1)
    }
}

startServer()