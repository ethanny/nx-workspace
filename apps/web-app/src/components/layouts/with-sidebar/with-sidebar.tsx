
import { Header } from '@components-web';
import ProfileHeaderMenu from '@web-app/components/modules/dashboard/profile-header-menu/profile-header-menu';
import dynamic from 'next/dynamic';
import styles from './with-sidebar.module.scss';

const Sidebar = dynamic(() => import('@components-web/navigation/sidebar/sidebar'), { ssr: false });

const WithSidebar = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className={styles['sidebar-layout']}>
            <Sidebar
                isToggleDisabled={true} />

            <div className={styles['sidebar-layout__content']}>
                <div className={styles['sidebar-layout__header']}>
                    <Header rightAction={<ProfileHeaderMenu />} />
                </div>

                {children}
            </div>
        </div>
    )
}

export default WithSidebar;