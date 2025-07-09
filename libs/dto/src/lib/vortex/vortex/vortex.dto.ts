import { ApiProperty } from '@nestjs/swagger';
import { VortexStatusEnum } from '../enums/vortex.status.enum';
import { RecordStatusEnum } from '../enums/record.status.enum';
import { FirmwareUpdateStatusEnum } from '../enums/firmware.update.status.enum';
import { CameraStatusEnum } from '../enums/camera.status.enum';
export class VortexDto {
    @ApiProperty()
    vortexId!: string;

    @ApiProperty()
    vortexDeviceId?: string;

    @ApiProperty({ enum: VortexStatusEnum })
    vortexStatus?: VortexStatusEnum;

    @ApiProperty({ enum: RecordStatusEnum })
    recordStatus?: RecordStatusEnum;

    @ApiProperty()
    operatorCode?: string;

    @ApiProperty()
    operatorName?: string;

    @ApiProperty()
    manufacturedDate?: Date;

    @ApiProperty({ enum: CameraStatusEnum })
    cameraStatus?: CameraStatusEnum;

    @ApiProperty()
    cameraPreviousStatus?: string;

    @ApiProperty()
    cameraPausedUntil?: Date;

    @ApiProperty()
    lastCommand?: string;

    @ApiProperty()
    lastCommandStatus?: string;

    @ApiProperty()
    lastCommandDate?: Date;

    @ApiProperty()
    lastCommandAcknowledgedDate?: Date;

    @ApiProperty()
    firmwareName?: string;

    @ApiProperty()
    firmwareVersion?: string;

    @ApiProperty()
    firmwareVersionRequested?: string;

    @ApiProperty()
    sensors?: any;

    @ApiProperty({ enum: FirmwareUpdateStatusEnum })
    firmwareUpdateStatus?: FirmwareUpdateStatusEnum;

    @ApiProperty()
    eventLogId?: string;

}
