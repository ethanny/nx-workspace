'use client';

import { Form } from '@components-web';
import { useStore } from '@data-access/state-management';
import { STORAGE_KEY } from '@utils/config/constants';
import Cookies from 'js-cookie';
import { schema, structure } from './new-password.structure';
import { useHandleNewPassword } from './useHandleNewPassword';

interface IForm {
    email: string;
    password: string;
    confirmPassword: string;
}

const NewPasswordForm = () => {
    const authedUser = useStore((state) => state.authedUser);

    const newPasswordMutation = useHandleNewPassword();

    const onSubmitForm = (data: IForm) => {
        newPasswordMutation.mutate({
            session: Cookies.get(STORAGE_KEY.COGNITO_SESSION) as string,
            password: data.password,
            email: data.email
        });
    }

    return (
        <div>
            <Form<IForm>
                structure={structure}
                schema={schema}
                onSubmitForm={onSubmitForm}
                isProcessing={newPasswordMutation.isPending}
                data={{
                    email: authedUser.email,
                    password: '',
                    confirmPassword: ''
                }} />
        </div>
    )
}

export default NewPasswordForm;