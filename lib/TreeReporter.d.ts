import { Either } from 'fp-ts/lib/Either';
import { DecodeError } from './index';
export declare const failure: (error: DecodeError) => string;
export declare const success: () => string;
export declare const TreeReporter: {
    report: <A>(result: Either<DecodeError, A>) => string;
};
