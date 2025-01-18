import { Collection, ObjectId, WithId, Filter, OptionalUnlessRequiredId, UpdateFilter } from 'mongodb'

export abstract class BaseRepository<T, TView, TCreate> {
    constructor(
        protected readonly collection: Collection<T>,
        protected readonly mapDocument: (doc: WithId<T>) => TView
    ) {}

    async create(data: TCreate): Promise<TView> {
        const result = await this.collection.insertOne(data as OptionalUnlessRequiredId<T>)

        const filter = { _id: result.insertedId } as Filter<T>
        const insertedDoc = await this.collection.findOne(filter)
        if (!insertedDoc) {
            throw new Error('Document not found after insert')
        }

        return this.mapDocument(insertedDoc)
    }

    async findAll(): Promise<TView[]> {
        const docs = await this.collection.find().toArray();
        return docs.map(this.mapDocument)
    }

    async findById(id: string): Promise<TView | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }

        const filter = { _id: new ObjectId(id) } as Filter<T>
        const doc = await this.collection.findOne(filter)
        return doc ? this.mapDocument(doc) : null
    }

    async update(id: string, data: Partial<Omit<T, '_id'>>): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }

        const filter = { _id: new ObjectId(id) } as Filter<T>
        const update = { $set: data } as UpdateFilter<T>

        const result = await this.collection.updateOne(filter, update)
        return result.matchedCount === 1
    }

    async delete(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }

        const filter = { _id: new ObjectId(id) } as Filter<T>
        const result = await this.collection.deleteOne(filter)
        return result.deletedCount === 1
    }

    async deleteAll(): Promise<void> {
        await this.collection.deleteMany({})
    }
}