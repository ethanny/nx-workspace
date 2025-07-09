import { OmitType } from '@nestjs/swagger';
import { OperatorDto } from './operator.dto';
export class CreateOperatorDto extends OmitType(OperatorDto, ['operatorId'] as const) {}
