

export class ForgotPasswordCommand {
  constructor(
    public readonly email: string,
    public readonly processSNSqueue: boolean,
    public readonly alternateResponseUrl?: string
  ) { }
}