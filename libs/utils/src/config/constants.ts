export const STORAGE_KEY = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    SESSION_ID: 'session_id',
    COGNITO_SESSION: 'coginto_session',
    PENDING_REFERENCE_IDS: 'pending_reference_ids',
    PROFILE_USER: 'profile_user'
};

export const ROUTES = {
    AUTH_LOGIN: '/auth/login',
    AUTH_SIGNUP: '/auth/registration',
    AUTH_COMPLETE_PROFILE: '/auth/set-new-password',

    AUTH_FORGOT_PASSWORD: '/forgot-password',
    AUTH_VERIFY_OTP: '/forgot-password/verify',

    DASHBOARD: '/dashboard'
};