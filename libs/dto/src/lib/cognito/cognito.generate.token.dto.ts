import { ApiProperty } from '@nestjs/swagger';

export class CognitoGenerateTokenDto {


    @ApiProperty()
    code!: string;

    @ApiProperty()
    alternateResponseUrl?: string;

}
