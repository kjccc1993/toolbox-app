import express from 'express'
import routes from './routes/index.js'
import middlewares from './middlewares/index.js'

const app = express()

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' })
})

//Middlewares como autenticacion, interceptores de respuesta,
//body parsers, etc, se cargarían aqui dentro
middlewares(app)

//Rutas
routes(app)

export default app
