declare const getJestConfig: () => {
    runner: string;
    globalSetup: string;
    globalTeardown: string;
    testEnvironment: string;
    setupFilesAfterEnv: string[];
    rootDir: string;
    roots: string[];
    reporters: string[];
    testMatch: string[];
    transform: {
        '^.+\\.stories\\.[jt]sx?$': string;
        '^.+\\.[jt]sx?$': string;
    };
    snapshotSerializers: string[];
    testEnvironmentOptions: {
        'jest-playwright': {
            browsers: string[];
            collectCoverage: boolean;
        };
    };
    watchPlugins: string[];
    watchPathIgnorePatterns: string[];
};

export { getJestConfig };
