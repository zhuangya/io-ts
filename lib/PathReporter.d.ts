import { DecodeError } from '.';
import { Either } from 'fp-ts/lib/Either';
export declare const failure: (error: DecodeError) => string[];
export declare const success: () => never[];
export declare const PathReporter: {
    report: <A>(result: Either<DecodeError, A>) => string[];
};
