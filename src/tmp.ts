// export function expected<A>(decoder: Decoder<A>, f: (e: DecodeError) => string): Decoder<A> {
//   return flow(
//     decoder,
//     E.mapLeft(e => ({ ...e, expected: f(e) }))
//   )
// }

// export function required<N extends string, A, M extends string = N>(
//   name: N,
//   decoder: Decoder<A>,
//   rename?: M
// ): Decoder<{ [K in M]: A }> {
//   const to = rename || name
//   return flow(
//     UnknownRecord,
//     E.chain(r =>
//       pipe(
//         decoder(r[name]),
//         E.bimap(
//           e => ({ ...e, expected: `required ${JSON.stringify(name)} field` }),
//           a => ({ [to]: a } as { [K in M]: A })
//         )
//       )
//     )
//   )
// }

// export function optional<N extends string, A, M extends string = N>(
//   name: N,
//   decoder: Decoder<A>,
//   rename?: M
// ): Decoder<{ [K in M]?: A }> {
//   const to = rename || name
//   return flow(
//     UnknownRecord,
//     E.chain(r => {
//       if (r[name] === undefined) {
//         return E.right({})
//       }
//       return pipe(
//         decoder(r[name]),
//         E.bimap(
//           e => ({ ...e, expected: `optional ${JSON.stringify(name)} field` }),
//           a => ({ [to]: a } as { [K in M]: A })
//         )
//       )
//     })
//   )
// }
