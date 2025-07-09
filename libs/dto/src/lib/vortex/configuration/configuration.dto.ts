import { ApiProperty } from '@nestjs/swagger';
export class ConfigurationDto {
    @ApiProperty()
    configurationId!: string;

    @ApiProperty()
    lastGeneratedVortexId?: string;

}
