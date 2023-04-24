import * as toolboxService from '../services/toolbox.service.js'
import { errorResponse, HttpStatusCode } from '../utils/error.js'

export async function getFiles(req, res) {
  let availableFiles = []
  try {
    availableFiles = await toolboxService.getAvailableFiles()
  } catch (error) {
    //Algo pasó, en este punto deberiamos registrar el problema
    //usando un error tracking como Rollbar o Sentry
    console.log({ error })

    return errorResponse(
      res,
      HttpStatusCode.InternalServerError,
      'Error trying to get availbale files'
    )
  }

  //Error en caso de no haber archivos disponibles para la descarga,
  //en este caso nunca va a pasar porque la API siempre devuelve la lista
  //pero se valida en caso de que eso cambie
  if (!availableFiles.length) {
    return errorResponse(
      res,
      HttpStatusCode.NotFound,
      'Could not find available files'
    )
  }

  try {
    const filesInfo = await toolboxService.getFilesInformation(availableFiles)
    return res.json(filesInfo)
  } catch (error) {
    //Algo pasó, en este punto deberiamos registrar el problema
    //usando un error tracking como Rollbar o Sentry
    console.log({ error })

    errorResponse(
      res,
      HttpStatusCode.InternalServerError,
      'Error descargando los archivos'
    )
  }
}
