import app from './server.js'
import env from './environment.js'

const port = env.port
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`)
})

server.on('error', console.error)
