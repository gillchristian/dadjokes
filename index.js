const trae = require('trae')
const ora = require('ora')

const traversP = ps => Promise.all(ps)
const map = fn => xs => xs.map(fn)
const tap = label => d => (console.log(label, d), d)

trae.defaults({ baseUrl: 'https://www.reddit.com' })

const spinner = ora('Fetching /r/dadjokes front-page ...')

console.log()
spinner.start()

trae.get('/r/dadjokes.json')
  .then(r => r.data.data)
  .then(d => d.children)
  .then(map(child => child.data.permalink))
  .then(map(url => url.replace(/\/$/, '')))
  .then(map(url => `${url}.json`))
  .then(map(trae.get))
  .then(traversP)
  .then(map(r => r.data[0].data))
  .then(map(d => d.children[0].data))
  .then(children => {

    spinner.succeed('Here are the top jokes:')
    console.log()
    console.log('----------------------------------------')
    console.log()

    map(child => {
      console.log(child.title)
      if (child.selftext) {
        console.log('- ', child.selftext)
      }
      console.log()
      console.log(child.url)
      console.log()
      console.log('----------------------------------------')
      console.log()
    })(children)
  })
  .catch(e => {
    spinner.fail('There was an error:')
    console.error(e)
  })
