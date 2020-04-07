/**
 * @since 3.0.0
 */
export type Literal = string | number | boolean | null

/**
 * @since 3.0.0
 */
export function fold<R>(
  onString: (s: string) => R,
  onNumber: (n: number) => R,
  onBoolean: (b: boolean) => R,
  onNull: () => R
): (literal: Literal) => R {
  return (literal) => {
    if (typeof literal === 'string') {
      return onString(literal)
    } else if (typeof literal === 'number') {
      return onNumber(literal)
    } else if (typeof literal === 'boolean') {
      return onBoolean(literal)
    } else {
      return onNull()
    }
  }
}
