import { Injectable } from '@nestjs/common';
import { Model, Table } from 'dynamodb-onetable';
import { AuthorDataType, BookAuthorSchema } from '@dynamo-db-lib';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { AuthorDatabaseServiceAbstract } from './author-database-service-abstract-class';
import { AuthorsDto } from '@dto';

@Injectable()
export class AuthorDatabaseServiceService implements AuthorDatabaseServiceAbstract {
    private readonly authorsTable: Model<AuthorDataType>

    private readonly client: DynamoDBClient
    private readonly table: Table

    constructor(){
        this.client = new DynamoDBClient({  
            region: "ap-southeast-2",
            profile: "ethan",
            endpoint: "http://localhost:8000"
        })

        this.table = new Table({
            client: this.client,
            name: "Book-Author",
            schema: BookAuthorSchema
        })

        this.authorsTable = this.table.getModel<AuthorDataType>('Author')
    }

    async findAuthorRecordById(id: string): Promise<AuthorsDto | null> {
        const authorRecord: AuthorDataType | undefined = await this.authorsTable.get({
            PK: `AUTHOR#${id}`,
            SK: 'METADATA'
        })

        if (!authorRecord) {
            return null;
        }
        
        return this.convertToDto(authorRecord)
    }

    async convertToDto(record: AuthorDataType): Promise<AuthorsDto> {
        const dto = new AuthorsDto();
        dto.name = record.name ? record.name : '';

        return dto;
    }

    async convertToDtoList(records: AuthorDataType[]): Promise<AuthorsDto[]> {
        const dtoList: AuthorsDto[] = [];

        for (const record of records) {
            const dto: AuthorsDto = await this.convertToDto(record);

            dtoList.push(dto);
        }

        return dtoList;
    }
}
