// traverseP :: [Promise(a)] ->  Promise([a])
const traverseP = ps => Promise.all(ps)

// map :: (a -> b) -> [a] -> [b]
const map = fn => xs => xs.map(fn)

// join :: String -> [String] -> String
const join = what => xs => xs.join(what)

// head :: [a] -> a|undefined
const head = xs => xs[0]

// tail :: [a] -> [a]
const tail = xs => xs.slice(1)

module.exports = {
  traverseP,
  map,
  join,
  head,
  tail,
}
