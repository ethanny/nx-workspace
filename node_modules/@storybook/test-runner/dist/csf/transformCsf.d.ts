import * as t from '@babel/types';

interface TestContext {
    storyExport?: t.Identifier;
    name: t.Literal;
    title: t.Literal;
    id: t.Literal;
}
type TemplateResult = t.Statement | t.Statement[];
type FilePrefixer = () => TemplateResult;
type TestPrefixer = (context: TestContext) => TemplateResult;
interface TransformOptions {
    clearBody?: boolean;
    beforeEachPrefixer?: FilePrefixer;
    testPrefixer?: TestPrefixer;
    insertTestIfEmpty?: boolean;
    makeTitle?: (userTitle: string) => string;
}
declare const transformCsf: (code: string, { clearBody, testPrefixer, beforeEachPrefixer, insertTestIfEmpty, makeTitle, }?: TransformOptions) => string;

export { TestContext, TestPrefixer, transformCsf };
