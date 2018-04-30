const trae = require('trae')
const ora = require('ora')
const chalk = require('chalk')

const {
  composeN,
  traverseP,
  map,
  filter,
  join,
  head,
  tail,
  omit,
  Pair,
} = require('./utils')

// -----

trae.defaults({ baseUrl: 'https://www.reddit.com' })

module.exports = {
  main,
  formatJoke,
}

// -----

// omitExtraOptions :: { [String]: a } -> { [String]: a }
const omitExtraOptions = omit(['help', 'h', 'version', 'v'])

// flagMap :: [Pair]
const flagMap = [
  ['3am', '/r/3amjokes'],
  ['dota2', '/r/dota2dadjokes'],
  ['dadjokes', '/r/dadjokes'],
]

function main({ flags }) {
  const subreddits = omitExtraOptions(flags)

  // hasFlag :: Pair -> Bool
  const hasFlag = pair => subreddits[Pair.fst(pair)]

  // getSubreddit :: [Pair] -> String
  const getSubreddit = composeN(Pair.snd, head, filter(hasFlag))

  const subreddit = getSubreddit(flagMap)

  const spinner = ora(chalk.bold.yellow(`Fetching ${subreddit} front-page ...`))

  console.log()
  spinner.start()

  trae
    .get(`${subreddit}.json`)
    .then(r => r.data.data)
    .then(d => d.children)
    .then(map(child => child.data.permalink))
    .then(map(url => url.replace(/\/$/, '.json')))
    .then(map(trae.get))
    .then(traverseP)
    .then(map(r => r.data[0].data))
    .then(map(d => d.children[0].data))
    .then(map(formatJoke))
    .then(join('\n'))
    .then(jokes => {
      spinner.succeed(chalk.bold.yellow(`Here is ${subreddit} front-page:`))
      console.log()
      console.log(jokes)
    })
    .catch(e => {
      spinner.fail(chalk.bold.red('Ups, there was an error:'))

      console.log()
      console.error(e.message[0].toUpperCase() + e.message.slice(1))
    })
}

function formatJoke(child) {
  let joke = ' ' + chalk.bold.white(child.title) + '\n'

  if (child.selftext) {
    joke += '\n'

    const lines = child.selftext.split('\n')
    const firstLine = head(lines)
    const rest = tail(lines)
      .map(line => '   ' + line)
      .join('\n')

    joke += chalk.bold.green('   ' + firstLine)
    if (rest) {
      joke += chalk.bold.green(rest)
    }
  }

  joke += '\n\n ' + child.url + '\n\n'
  joke += '----------------------------------------\n'

  return joke
}
