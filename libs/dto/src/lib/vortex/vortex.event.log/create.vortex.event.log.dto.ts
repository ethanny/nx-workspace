import { OmitType } from '@nestjs/swagger';
import { VortexEventLogDto } from './vortex.event.log.dto';
export class CreateVortexEventLogDto extends OmitType(VortexEventLogDto, ['logId'] as const) {}
