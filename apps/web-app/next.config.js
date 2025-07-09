//@ts-check


const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
    nx: {
        // Set this to true if you would like to use SVGR
        // See: https://github.com/gregberge/svgr
        svgr: false,
    },
    env: {
        DEFAULT_REGION: process.env.DEFAULT_REGION,

        API_PROCESS_SNS_QUEUE: process.env.API_PROCESS_SNS_QUEUE,
        // Api URLs
        API_AUTHENTICATION_URL: process.env.API_AUTHENTICATION_URL,
        API_USER_URL: process.env.API_USER_URL,
        HEARTBEAT_INTERVAL: process.env.HEARTBEAT_INTERVAL,
        ENABLE_HEARTBEAT: process.env.ENABLE_HEARTBEAT
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/auth/login',
                permanent: true
            }
        ]
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack']
        });
        return config;
    }
};

const plugins = [
    // Add more Next.js plugins to this list if needed.
    withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
