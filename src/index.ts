import {runDb} from "./shared/db/mongo-db";
import {app} from "./app";
import {SETTINGS} from "./settings";
import {launchBlogsRepositories} from "./core/routes/blogs/blogs.repo";
import {launchPostsRepositories} from "./core/routes/posts/posts.repo";

const startApp = async () => {
    if (await runDb()) {
        app.listen(SETTINGS.PORT, () => {
            console.log('...server started on port ' + SETTINGS.PORT)
        })

        launchBlogsRepositories();
        launchPostsRepositories();
    } else {
        console.error('Failed to start app:')
        process.exit(1)
    }
}

startApp();