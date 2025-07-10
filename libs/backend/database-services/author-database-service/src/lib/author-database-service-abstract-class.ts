import { AuthorsDto, BooksDto } from '@dto';

export abstract class AuthorDatabaseServiceAbstract {

    // abstract findAllAuthorRecords(): Promise<AuthorsDto[]>;

    abstract findAuthorRecordById(id: string): Promise<AuthorsDto | null>;

    // abstract findBooksOfAuthor(bookId: string): Promise<BooksDto[]>;

    // abstract createRecord(userDto: AuthorsDto): Promise<AuthorsDto>;

    // abstract updateAuthorRecord(userData: AuthorsDto): Promise<AuthorsDto>;

    // abstract convertToDto(record: AuthorsDto): Promise<AuthorsDto>

    // abstract convertToDtoList(records: AuthorsDto[]): Promise<AuthorsDto[]>
}