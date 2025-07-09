import { CreateUserDto, MessageQueueDto, UsersDto } from "@dto";
import ENV from "../config";
import { AxiosConfig } from "./axiosConfig";

const PROCESS_SNS = `?processSNSqueue=${ENV.API_PROCESS_SNS_QUEUE || true}`;

class UserApi extends AxiosConfig {
    constructor() {
        // TODO set shouldRedirectUnauthorized = true
        super(ENV.API_USER_URL as string, true, false);
    }

    public getUserById = async (id: string): Promise<UsersDto> => {
        return await this.axiosInstance.get(`/${id}${PROCESS_SNS}`);
    };

    public createUser = async (params: CreateUserDto): Promise<MessageQueueDto<CreateUserDto>> => {
        return await this.axiosInstance.post(`${PROCESS_SNS}`, params);
    };
}

export default new UserApi();
