import * as toolboxService from '../services/toolbox.service.js'
import { errorResponse, HttpStatusCode } from '../utils/error.js'

export async function getFiles(req, res) {
  const { fileName } = req.query
  let { availableFiles, error } = await getAvailableFiles()

  //Algo ocurrió
  if (error) {
    return errorResponse(res, error.statusCode, error.message)
  }

  if (fileName && !availableFiles.includes(fileName)) {
    return errorResponse(
      res,
      HttpStatusCode.NotFound,
      `Provided fileName not found: ${fileName}`
    )
  } else if (fileName) {
    availableFiles = availableFiles.filter((f) => f === fileName)
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

export async function getFilesList(req, res) {
  const { availableFiles, error } = await getAvailableFiles()
  //Algo ocurrió
  if (error) {
    return errorResponse(res, error.statusCode, error.message)
  }

  res.json({ files: availableFiles })
}

async function getAvailableFiles() {
  let availableFiles = []
  try {
    availableFiles = await toolboxService.getAvailableFiles()
  } catch (error) {
    //Algo pasó, en este punto deberiamos registrar el problema
    //usando un error tracking como Rollbar o Sentry
    console.log({ error })

    return {
      error: {
        statusCode: HttpStatusCode.InternalServerError,
        message: 'Error trying to get availbale files',
      },
    }
  }

  //Error en caso de no haber archivos disponibles para la descarga,
  //en este caso nunca va a pasar porque la API siempre devuelve la lista
  //pero se valida en caso de que eso cambie
  if (!availableFiles.length) {
    return {
      error: {
        statusCode: HttpStatusCode.NotFound,
        message: 'Could not find available files',
      },
    }
  }

  return { availableFiles }
}
