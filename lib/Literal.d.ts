/**
 * @since 3.0.0
 */
export declare type Literal = string | number | boolean | null;
/**
 * @since 3.0.0
 */
export declare function fold<R>(onString: (s: string) => R, onNumber: (n: number) => R, onBoolean: (b: boolean) => R, onNull: () => R): (literal: Literal) => R;
