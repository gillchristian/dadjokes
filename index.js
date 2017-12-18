const trae = require('trae')
const ora = require('ora')

const { traverseP, map, join, head, tail } = require('./utils')


trae.defaults({ baseUrl: 'https://www.reddit.com' })

main()

function main() {

  const spinner = ora('Fetching /r/dadjokes front-page ...')

  console.log()
  spinner.start()

  trae.get('/r/dadjokes.json')
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
      spinner.succeed('Here is /r/dadjokes front-page:')
      console.log()
      console.log(jokes)
    })
    .catch(e => {
      spinner.fail('There was an error:')
      console.error(e)
    })
}

function formatJoke(child) {
  let joke = ' ' + child.title + '\n'

  if (child.selftext) {
    joke += '\n'

    const lines = child.selftext.split('\n') 
    const firstLine = head(lines)
    const rest = tail(lines).map(line => '   ' + line).join('\n')

    joke += ' - ' +  firstLine
    if (rest) {
      joke += rest
    }
  }

  joke += '\n\n ' + child.url + '\n\n'
  joke += '----------------------------------------\n'

  return joke
}
