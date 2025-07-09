import Image from 'next/image';
import { ILayout } from "../../types/layout";
import styles from './styles.module.scss';

const ForgotPasswordLayout: React.FC<ILayout> = ({ children }) => {
    return (
        <div className={styles['forgot-password-layout']}>
            <div className={styles['forgot-password-layout__overlay']}>
                <div className={styles['forgot-password-layout__content']}>
                    <Image
                        src="/assets/images/logo.png"
                        alt="logo"
                        width={312}
                        height={191}
                    />
                    <div className={styles['forgot-password-layout__form']}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordLayout