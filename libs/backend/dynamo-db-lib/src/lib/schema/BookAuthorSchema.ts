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
            PK: { type: 'string', value: 'BOOK#{id}', required: true },
            SK: { type: 'string', required: true },
            title: { type: 'string', required: true },
            publisher: { type: 'string', required: true },
            date_published: { type: 'string', required: true },
            genres: { type: 'array', items: { type: 'string' }, required: true, },
            GSI1PK: { type: 'string', value: 'AUTHOR#{id}', required: true },
        },
        Author: {
            PK: { type: 'string', value: 'AUTHOR#{id}', required: true },
            SK: { type: 'string', required: true },
            name: { type: 'string', required: true },
            GSI1PK: { type: 'string', value: 'BOOK#{id}', required: true },
        }
    },
}

type Book = Entity<typeof BookAuthorSchema.models.Book>
type Author = Entity<typeof BookAuthorSchema.models.Author>

export { Book, Author, BookAuthorSchema }
