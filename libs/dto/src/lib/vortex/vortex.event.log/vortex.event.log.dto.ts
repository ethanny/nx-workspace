import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from '../enums/status.enum';
export class VortexEventLogDto {
    @ApiProperty()
    logId!: string;

    @ApiProperty()
    referenceId?: string;

    @ApiProperty()
    entityReferenceId?: string;

    @ApiProperty()
    action?: string;

    @ApiProperty({ enum: StatusEnum })
    status?: StatusEnum;

    @ApiProperty()
    sessionId?: string;

    @ApiProperty()
    ExpiryDate?: number;

    @ApiProperty()
    errorMessage?: any;

    @ApiProperty()
    data?: any;

}
