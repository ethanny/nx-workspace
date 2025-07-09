import { ApiProperty } from '@nestjs/swagger';

export class CognitoConfirmUserDto {
    @ApiProperty()
    email!: string;

    @ApiProperty()
    code!: string;

    @ApiProperty()
    alternateResponseUrl?: string;

}
