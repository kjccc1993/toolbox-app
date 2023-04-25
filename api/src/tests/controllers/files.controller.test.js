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
import { HttpStatusCode } from '../../utils/error.js'

describe('Files API', () => {
  let server = null
  let request = null

  before((done) => {
    server = app.listen(done)
    request = supertest.agent(server)
  })

  describe('/data', () => {
    const mockToolboxRequests = () => {
      nock(env.toolbox.baseUrl)
        .get(`/files`)
        .reply(HttpStatusCode.OK, mockToolboxFilesResponse)
      mockToolboxFilesResponse.files.forEach((fileName) => {
        nock(env.toolbox.baseUrl)
          .get(`/file/${fileName}`)
          .reply(HttpStatusCode.OK, mockToolboxCsvDataReponses[fileName])
      })
    }

    it('should return formatted data based on csv files', async () => {
      //Agrego respuestas controladas para evitar llamadas a la api externa
      //durante los tests
      mockToolboxRequests()
      const resp = await request.get('/files/data').expect(HttpStatusCode.OK)

      //la informacion obtenida tiene el formato esperado
      expect(resp.body).to.deep.equal(stubGetFilesResponse)
    })

    it('should return an error message if no files are available', async () => {
      nock(env.toolbox.baseUrl)
        .get(`/files`)
        .reply(HttpStatusCode.OK, { files: [] })
      const resp = await request
        .get('/files/data')
        .expect(HttpStatusCode.NotFound)

      //No hay archivos disponibles, error
      expect(resp.body.message).to.equal('Could not find available files')
    })

    it('should return formatted data filtering by fileName', async () => {
      mockToolboxRequests()
      const resp = await request
        .get(`/files/data?fileName=test1.csv`)
        .expect(HttpStatusCode.OK)

      expect(resp.body.length).to.equal(1)
      expect(resp.body[0]).to.deep.equal(stubGetFilesResponse[0])
    })

    it('should return an error when the given fileName does not exist', async () => {
      const fileName = 'test111.csv'
      mockToolboxRequests()
      const resp = await request
        .get(`/files/data?fileName=${fileName}`)
        .expect(HttpStatusCode.NotFound)

      expect(resp.body.message).to.equal(
        `Provided fileName not found: ${fileName}`
      )
    })
  })

  describe('/list', () => {
    it('should return the a list like the toolbox api', async () => {
      nock(env.toolbox.baseUrl)
        .get(`/files`)
        .reply(HttpStatusCode.OK, mockToolboxFilesResponse)
      const resp = await request.get('/files/list').expect(HttpStatusCode.OK)

      //La respuesta es identica a la que devuelve toolbox
      expect(resp.body).to.deep.equal(mockToolboxFilesResponse)
    })

    it('should return an error message if no files are available', async () => {
      nock(env.toolbox.baseUrl)
        .get(`/files`)
        .reply(HttpStatusCode.OK, { files: [] })
      const resp = await request
        .get('/files/list')
        .expect(HttpStatusCode.NotFound)

      expect(resp.body.message).to.equal('Could not find available files')
    })
  })
})
