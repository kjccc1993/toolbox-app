import { Router } from 'express'
import filesRouter from './files.routes.js'

const mainRouter = Router()
mainRouter.use('/files', filesRouter)

export default (app) => {
  app.use('/', mainRouter)
}
