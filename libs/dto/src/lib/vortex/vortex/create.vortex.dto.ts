import { OmitType } from '@nestjs/swagger';
import { VortexDto } from './vortex.dto';
export class CreateVortexDto extends OmitType(VortexDto, ['vortexId'] as const) {}
