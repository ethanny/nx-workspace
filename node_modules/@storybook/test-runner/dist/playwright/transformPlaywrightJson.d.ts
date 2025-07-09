/**
 * Generate one test file per component so that Jest can
 * run them in parallel.
 */
declare const transformPlaywrightJson: (index: Record<string, any>) => {
    [key: string]: string;
};

export { transformPlaywrightJson };
