import { ApiProperty } from '@nestjs/swagger';
import { CameraStatusEnum } from '../enums/camera.status.enum';
export class OperatorDto {
    @ApiProperty()
    operatorId!: string;

    @ApiProperty()
    operatorName?: string;

    @ApiProperty()
    operatorCode?: string;

    @ApiProperty()
    imageUploadEndpoint?: string;

    @ApiProperty()
    siteMonitoringAwsSecretArn?: string;

    @ApiProperty()
    siteMonitoringEndpoint?: string;

    @ApiProperty({ enum: CameraStatusEnum })
    cameraStatus?: CameraStatusEnum;

}
