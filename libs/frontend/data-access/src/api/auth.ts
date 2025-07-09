import { CognitoCompleteNewPasswordDto, CognitoConfirmCodeDto, CognitoDto, CognitoEmailDto } from "@dto";
import ENV from "../config";
import { AxiosConfig } from "./axiosConfig";

class AuthApi extends AxiosConfig {
    constructor() {
        super(ENV.API_AUTHENTICATION_URL as string, false, false);
    }

    public login = async <T>(params: CognitoDto): Promise<T> => {
        return await this.axiosInstance.post(`/login`, params);
    };

    public createUser = async (params: CognitoDto): Promise<CognitoDto> => {
        return await this.axiosInstance.post(`/admin-create-user`, params);
    }

    public completeNewPassword = async <T>(params: CognitoCompleteNewPasswordDto): Promise<T> => {
        return await this.axiosInstance.post(`/complete-new-password`, params);
    }

    public forgotPassword = async <T>(params: CognitoEmailDto): Promise<T> => {
        return await this.axiosInstance.post(`/forgot-password`, params);
    }

    public confirmPasswordCode = async (params: CognitoConfirmCodeDto): Promise<CognitoConfirmCodeDto> => {
        return await this.axiosInstance.post(`/confirm-password-code`, params);
    }

    public resendConfirmationCode = async (params: CognitoEmailDto): Promise<CognitoEmailDto> => {
        return await this.axiosInstance.post(`/resend-confirmation-code`, params);
    }
}

export default new AuthApi();
