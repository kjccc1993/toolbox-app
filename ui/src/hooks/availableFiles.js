import { useEffect, useState } from 'react'
import env from '../environment'

const useAvailableFiles = () => {
  const [availableFiles, setAvailableFiles] = useState([])
  const getAvailableFiles = async () => {
    const url = `${env.apiUrl}/list`
    const resp = await fetch(url)
    const { files } = await resp.json()

    setAvailableFiles(files)
  }

  useEffect(() => {
    getAvailableFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { availableFiles }
}

export default useAvailableFiles
