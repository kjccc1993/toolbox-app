import axios from 'axios'
import csvToJson from 'csvtojson'
import env from '../environment.js'

async function toolboxApiGetRequest(url) {
  return await axios.get(`${env.toolbox.baseUrl}${url}`, {
    headers: { Authorization: `Bearer ${env.toolbox.apiKey}` },
  })
}

export async function getAvailableFiles() {
  const response = await toolboxApiGetRequest('/files')
  
  return response.data?.files
}

export async function getFile(fileName) {
  const response = await toolboxApiGetRequest(`/file/${fileName}`)
  return response.data
}

export async function getFilesInformation(fileNames = []) {
  const filesRequests = fileNames.map(getFile)

  //Obtengo la info de los archivos que no dieron error
  const filesInfo = await Promise.allSettled(filesRequests).then(
    (responses) => {
      return responses
        .filter(({ status }) => status === 'fulfilled')
        .map(({ value }) => value)
    }
  )

  //Convierte los csv a json para facil manejo
  const parsers = filesInfo.map((value) => csvToJson().fromString(value))
  const jsonCsvs = await Promise.all(parsers)

  //Se formatea y se devuelven las lineas y archivos que no tengan errores
  return filterAndFormatCsvJsons(jsonCsvs)
}

function filterAndFormatCsvJsons(jsonCsvs) {
  return jsonCsvs
    .filter((jsonCsv) => jsonCsv.length)
    .map((jsonCsv) => {
      const lines = jsonCsv
        .filter(({ text, number, hex }) => text && +number && hex)
        .map(({ text, number, hex }) => ({
          text,
          number: +number,
          hex,
        }))

      return {
        file: jsonCsv[0]?.file,
        lines,
      }
    })
    .filter((formatted) => formatted.lines.length)
}
