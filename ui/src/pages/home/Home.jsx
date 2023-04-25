/* eslint-disable react-hooks/exhaustive-deps */
import styles from './Home.module.css'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getFilesRequest } from '../../store/filesSlice'
import useAvailableFiles from '../../hooks/availableFiles'

import Table from 'react-bootstrap/Table'
import Loading from '../../components/Loading'
import Select from '../../components/Select'
import { Alert, Button, Col, Container, Row } from 'react-bootstrap'

const Home = () => {
  const { availableFiles } = useAvailableFiles()
  const dispatch = useDispatch()
  const {
    data: filesData,
    isLoading,
    selectedFile,
  } = useSelector((state) => state.files)

  useEffect(() => {
    dispatch(getFilesRequest())
  }, [])

  const getFilesInfo = (selectedOption) => {
    dispatch(getFilesRequest(selectedOption))
  }

  const TableRow = ({ fileName, lines }) => {
    return lines.map((line) => (
      <tr key={line.hex}>
        <td>{fileName}</td>
        <td>{line.text}</td>
        <td>{line.number}</td>
        <td>{line.hex}</td>
      </tr>
    ))
  }

  return (
    <div className={styles.home}>
      <Container>
        <Row className="align-items-center">
          <Col xs={7} sm={4} className="ps-0">
            <Select
              options={['All', ...availableFiles]}
              onChange={getFilesInfo}
            />
          </Col>
          <Col xs={5} sm={1}>
            <Button onClick={() => getFilesInfo(selectedFile)}>Refresh</Button>
          </Col>
        </Row>
      </Container>

      {isLoading && <Loading />}

      {!isLoading && !!filesData.length && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Text</th>
              <th>Number</th>
              <th>Hex</th>
            </tr>
          </thead>
          <tbody>
            {filesData.map((file, i) => (
              <TableRow
                key={`${file.name}-${i}`}
                fileName={file.file}
                lines={file.lines}
              />
            ))}
          </tbody>
        </Table>
      )}

      {!isLoading && !filesData.length && (
        <Alert variant={'danger'}>
          There was a problem downloading this file or it contains invalid lines
        </Alert>
      )}
    </div>
  )
}

export default Home
