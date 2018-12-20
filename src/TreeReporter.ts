import { Either } from 'fp-ts/lib/Either'
import { DecodeError, LabeledProduct, IndexedProduct } from './index'

class Tree<A> {
  constructor(readonly value: A, readonly forest: Array<Tree<A>>) {}
}

const draw = (indentation: string, forest: Array<Tree<string>>): string => {
  let r: string = ''
  const len = forest.length
  let tree: Tree<string>
  for (let i = 0; i < len; i++) {
    tree = forest[i]
    const isLast = i === len - 1
    r += indentation + (isLast ? '└' : '├') + '─ ' + tree.value
    r += draw(indentation + (len > 1 && !isLast ? '│  ' : '   '), tree.forest)
  }
  return r
}

const drawTree = (tree: Tree<string>): string => {
  return tree.value + draw('\n', tree.forest)
}

const toArray = (error: LabeledProduct | IndexedProduct): Array<[string | number, DecodeError]> => {
  switch (error.type) {
    case 'LabeledProduct':
      const r: Array<[string | number, DecodeError]> = []
      for (const key in error.errors) {
        r.push([key, error.errors[key]])
      }
      return r
    case 'IndexedProduct':
      return error.errors
  }
}

const toTree = (error: DecodeError): Tree<string> => {
  const toTree = (error: DecodeError, withValue: boolean): Tree<string> => {
    switch (error.type) {
      case 'Leaf':
        return new Tree(`Expected ${error.expected}, but was ${JSON.stringify(error.actual)}`, [])
      case 'LabeledProduct':
      case 'IndexedProduct':
        return new Tree(
          withValue
            ? `Expected ${error.expected}, but was ${JSON.stringify(error.actual, null, 2)}`
            : `Invalid ${error.expected}`,
          toArray(error).reduce((acc: Array<Tree<string>>, [key, e]) => {
            acc.push(new Tree(`Invalid key ${JSON.stringify(key)}`, [toTree(e, false)]))
            return acc
          }, [])
        )
      case 'And':
      case 'Or':
        return new Tree(`Invalid ${error.expected}`, error.errors.map(error => toTree(error, false)))
    }
  }
  return toTree(error, true)
}

export const failure = (error: DecodeError): string => {
  return drawTree(toTree(error))
}

export const success = () => 'No errors!'

export const TreeReporter = {
  report: <A>(result: Either<DecodeError, A>): string => result.fold(failure, success)
}
