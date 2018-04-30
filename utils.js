// composeN :: (a1 -> a2) -> ... -> (an -> am) -> (a1 -> am)
const composeN = (...fns) => xs => fns.reduceRight((prev, fn) => fn(prev), xs)

// traverseP :: [Promise(a)] ->  Promise([a])
const traverseP = ps => Promise.all(ps)

// map :: (a -> b) -> [a] -> [b]
const map = fn => xs => xs.map(fn)

// map :: (a -> Bool) -> [a] -> [a]
const filter = fn => xs => xs.filter(fn)

// join :: String -> [String] -> String
const join = what => xs => xs.join(what)

// head :: [a] -> a|undefined
const head = xs => xs[0]

// tail :: [a] -> [a]
const tail = xs => xs.slice(1)

const Pair = {
  fst: head,
  snd: composeN(head, tail),
}

// omit :: [String] -> { [String]: a } -> { [String]: a }
const omit = keys => xs =>
  Object.entries(xs).reduce((r, [key, value]) => {
    if (!keys.includes(key)) {
      r[key] = value
    }
    return r
  }, {})

module.exports = {
  composeN,
  traverseP,
  map,
  filter,
  join,
  head,
  tail,
  omit,
  Pair,
}
