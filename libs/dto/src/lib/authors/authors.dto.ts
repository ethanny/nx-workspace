import { ApiProperty } from "@nestjs/swagger";

export class AuthorsDto{
    @ApiProperty()
    name!: string
}