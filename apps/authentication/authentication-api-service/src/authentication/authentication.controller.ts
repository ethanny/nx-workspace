import { CognitoConfirmCodeDto, CognitoConfirmUserDto, CognitoDto, CognitoEmailDto, CognitoGenerateTokenDto } from '@dto';
import { Body, Controller, DefaultValuePipe, Delete, Param, ParseBoolPipe, Post, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';


import { AdminCreateUserCommand } from './commands/admin.create.user/admin.create.user.command';
import { ChangePasswordCommand } from './commands/change.password/change.password.command';
import { CompleteNewPasswordCommand } from './commands/complete.new.password/complete.new.password.command';
import { ConfirmPasswordCodeCommand } from './commands/confirm.password.code/confirm.password.code.command';
import { ConfirmUserCommand } from './commands/confirm.user/confirm.user.command';
import { DeleteUserCommand } from './commands/delete.user/delete.user.command';
import { ForgotPasswordCommand } from './commands/forgot.password/forgot.password.command';
import { GenerateTokenCommand } from './commands/generate.token/generate.token.command';
import { LoginCommand } from './commands/login/login.command';
import { ResendConfirmationCodeCommand } from './commands/resend.confirmation.code/resend.confirmation.code.command';
import { ResendInvitationCommand } from './commands/resend.invitation/resend.invitation.command';
import { SignUpUserCommand } from './commands/sign.up.user/sign.up.user.command';




@Controller('authentication')
@ApiTags('authentication')
export class AuthenticationController {
  constructor(
    private readonly commandBus: CommandBus
  ) { }



  @Post('admin-create-user')
  adminCreateUser(@Body() adminCreateUserDto: CognitoDto) {
    const { email } = adminCreateUserDto;
    const command = new AdminCreateUserCommand(email);
    return this.commandBus.execute(command);
  }

  @Post('login')
  login(@Body() loginDto: CognitoDto) {
    const { email, password } = loginDto;
    const command = new LoginCommand(email, password);
    return this.commandBus.execute(command);
  }

  @Post('complete-new-password')
  completeNewPassword(@Body() completeNewPasswordDto: CompleteNewPasswordCommand) {
    const { email, password, session } = completeNewPasswordDto;
    const command = new CompleteNewPasswordCommand(email, password, session);
    return this.commandBus.execute(command);
  }

  @Post('forgot-password')
  forgotPassword(@Body() data: CognitoEmailDto, @Query('processSNSqueue', new DefaultValuePipe(true), new ParseBoolPipe({ optional: true })) processSNSqueue: boolean) {
    const { email } = data;
    const command = new ForgotPasswordCommand(email, processSNSqueue);
    return this.commandBus.execute(command);
  }

  @Post('confirm-password-code')
  confirmPasswordCode(@Body() data: CognitoConfirmCodeDto) {
    const { email, code, password } = data;
    const command = new ConfirmPasswordCodeCommand(email, password, code);
    return this.commandBus.execute(command);
  }

  @Post('resend-confirmation-code')
  resendConfirmationCode(@Body() data: CognitoEmailDto) {
    const { email } = data;
    const command = new ResendConfirmationCodeCommand(email);
    return this.commandBus.execute(command);
  }

  @Post('change-password')
  changePassword(@Body() data: CognitoDto) {
    const { email, password } = data;
    const command = new ChangePasswordCommand(email, password);
    return this.commandBus.execute(command);
  }

  @Post('confirm-user')
  confirmUser(@Body() data: CognitoConfirmUserDto) {
    const { email, code } = data;
    const command = new ConfirmUserCommand(email, code);
    return this.commandBus.execute(command);
  }

  @Post('resend-invitation')
  resendInvitation(@Body() data: CognitoDto) {
    const { email } = data;
    const command = new ResendInvitationCommand(email);
    return this.commandBus.execute(command);
  }

  @Post('generate-token')
  generateToken(@Body() data: CognitoGenerateTokenDto) {
    const { code } = data;
    const command = new GenerateTokenCommand(code);
    return this.commandBus.execute(command);
  }

  @Post('sign-up-user')
  signUpUser(@Body() data: CognitoDto) {
    const { email, password } = data;
    const command = new SignUpUserCommand(email, password);
    return this.commandBus.execute(command);
  }

  @Delete('email/:email')
  deleteUser(@Param('email') email: string) {
    const command = new DeleteUserCommand(email);
    return this.commandBus.execute(command);
  }

}
