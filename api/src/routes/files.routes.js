import { Router } from 'express'
import { filesController } from '../controllers/index.js'
const filesRouter = Router()

filesRouter.route('/data').get(filesController.getFiles)

export default filesRouter
