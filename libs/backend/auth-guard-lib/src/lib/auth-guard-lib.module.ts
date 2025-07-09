import { ConfigurationLibModule } from '@configuration-lib';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyHeaderGuard } from './cognito.api.key.header.guard';
import { CognitoAuthGuard } from './cognito.auth.guard';
import { JWTStrategy } from './jwt.strategy';

@Module({
    imports: [ConfigurationLibModule, PassportModule.register({ defaultStrategy: 'jwt' })],
    providers: [
        JWTStrategy,
        CognitoAuthGuard,
        ApiKeyHeaderGuard
    ],
    exports: [
        JWTStrategy,
        CognitoAuthGuard,
        ApiKeyHeaderGuard
    ],
})
export class AuthGuardLibModule { }
