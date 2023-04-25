import app from '../../server.js'
import supertest from 'supertest'
import { expect } from 'chai'
import {
  mockToolboxFilesResponse,
  mockToolboxCsvDataReponses,
} from '../__stub-data/toolbox-stub-data.js'
import env from '../../environment.js'
import nock from 'nock'
import { stubGetFilesResponse } from '../__stub-data/files-controller-stub-data.js'

describe('Files API', () => {
  let server = null
  let request = null

  before((done) => {
    server = app.listen(done)
    request = supertest.agent(server)
  })

  describe('/data', () => {
    it('should return formatted data based on csv files', async () => {
      //Agrego respuestas controladas para evitar llamadas a la api externa
      //durante los tests
      nock(env.toolbox.baseUrl)
        .get(`/files`)
        .reply(200, mockToolboxFilesResponse)
      mockToolboxFilesResponse.files.forEach((fileName) => {
        nock(env.toolbox.baseUrl)
          .get(`/file/${fileName}`)
          .reply(200, mockToolboxCsvDataReponses[fileName])
      })

      const resp = await request.get('/files/data').expect(200)

      //la informacion obtenida tiene el formato esperado
      expect(resp.body).to.deep.equal(stubGetFilesResponse)
    })

    it('should return an error message if no files are available', async () => {
      nock(env.toolbox.baseUrl).get(`/files`).reply(200, { files: [] })
      const resp = await request.get('/files/data').expect(404)

      //No hay archivos disponibles, error
      expect(resp.body.message).to.equal('Could not find available files')
    })
  })

  describe('/list', () => {
    it('should return the a list like the toolbox api', async () => {
      nock(env.toolbox.baseUrl).get(`/files`).reply(200, mockToolboxFilesResponse)
      const resp = await request.get('/files/list').expect(200)

      //La respuesta es identica a la que devuelve toolbox
      expect(resp.body).to.deep.equal(mockToolboxFilesResponse)
    })

    it('should return an error message if no files are available', async () => {
      nock(env.toolbox.baseUrl).get(`/files`).reply(200, { files: [] })
      const resp = await request.get('/files/list').expect(404)

      //No hay archivos disponibles, error
      expect(resp.body.message).to.equal('Could not find available files')
    })
  })
})
