import { Router } from 'express'
import { filesController } from '../controllers/index.js'
const filesRouter = Router()

filesRouter.route('/data').get(filesController.getFiles)
filesRouter.route('/list').get(filesController.getFilesList)

export default filesRouter
