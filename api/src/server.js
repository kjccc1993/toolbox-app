import express from 'express'
import routes from './routes/index.js'

const app = express()

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' })
})

//Rutas
routes(app)

export default app
