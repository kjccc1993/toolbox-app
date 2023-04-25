import Table from 'react-bootstrap/Table'
import styles from './Home.module.css'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getFilesRequest } from '../../store/filesSlice'
import Loading from '../../components/Loading'

const Home = () => {
  const { data: filesData, isLoading } = useSelector((state) => state.files)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getFilesRequest())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className={styles.home}>
      <Table striped bordered hover>
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
    </div>
  )
}

export default Home
