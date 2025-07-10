import { Entity } from "dynamodb-onetable";

const BookAuthorSchema = {
    format: 'onetable:1.1.0',
    version: '0.0.1',
    indexes: {
        primary: {
            hash: 'PK',
            sort: 'SK',
        },
        GSI1: {
            hash: 'GSI1PK',
        }
    },
    models: {
        Book: {
            PK: { type: String, value: 'BOOK#{id}', required: true },
            SK: { type: String, required: true },
            title: { type: String, required: true },
            publisher: { type: String, required: true },
            date_published: { type: String, required: true },
            genres: { type: Array, items: { type: 'string' }, required: true, },
            GSI1PK: { type: String, value: 'AUTHOR#{id}'},
        },
        Author: {
            PK: { type: String, value: 'AUTHOR#{id}', required: true },
            SK: { type: String, required: true },
            name: { type: String, required: true },
            GSI1PK: { type: String, value: 'BOOK#{id}'},
        }
    },
}

type BookDataType = Entity<typeof BookAuthorSchema.models.Book>
type AuthorDataType = Entity<typeof BookAuthorSchema.models.Author>

export { BookDataType, AuthorDataType, BookAuthorSchema }
