'use client';

import { DropdownMenu, Typography } from '@components-web';
import useAuth from '@data-access/hooks/useAuth';
import { useStore } from '@data-access/state-management';
import { ROUTES } from '@utils/config/constants';
import { useRouter } from 'next/navigation';

const ProfileHeaderMenu = () => {
    const router = useRouter();
    const authedUser = useStore(state => state.authedUser);
    const { clearUserDetails } = useAuth();

    const handleLogout = () => {
        clearUserDetails();
        router.replace(ROUTES.AUTH_LOGIN);
    };

    return (
        <DropdownMenu
            placement='bottom-end'
            className='h-full flex-centered'
            menu={[
                [{ label: 'Logout', onClick: handleLogout }]
            ]}
            trigger={<div>
                <Typography>
                    Hi, <Typography component='span' variant='body1-thicker'>{authedUser.email}</Typography>
                </Typography>
            </div>} />
    );
}

export default ProfileHeaderMenu;