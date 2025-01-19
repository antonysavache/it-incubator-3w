import {Collection, MongoClient} from "mongodb";
import {BaseRepository} from "../base/repository.base";

export type CollectionConfig<T extends BaseRepository<any, any, any> = BaseRepository<any, any, any>> = {
    name: string
    repositoryClass?: new (collection: Collection<any>) => T
}

export type DbSetupResult<T extends BaseRepository<any, any, any> = BaseRepository<any, any, any>> = {
    client: MongoClient
    collections: { [key: string]: Collection<any> }
    repositories: { [key: string]: T }
}