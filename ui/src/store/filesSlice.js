import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import env from '../environment'

export const getFilesRequest = createAsyncThunk(
  'files/data',
  async (fileName, ThunkAPI) => {
    let url = `${env.apiUrl}/data`

    if (fileName && fileName !== 'All') {
      url += `?fileName=${fileName}`
    }

    ThunkAPI.dispatch(setSelectedFile(fileName))
    const resp = await fetch(url)

    if (!resp.ok) {
      return Promise.reject()
    }

    return resp.json()
  }
)

const initialState = {
  selectedFile: null,
  data: [],
  error: null,
  isLoading: false,
}

export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setSelectedFile: (state, { payload }) => {
      state.selectedFile = payload
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getFilesRequest.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        }
      })
      .addCase(getFilesRequest.fulfilled, (state, { payload }) => {
        return {
          ...state,
          data: payload,
          isLoading: false,
        }
      })
      .addCase(getFilesRequest.rejected, (state, action) => ({
        ...state,
        error: action.error.message,
        isLoading: false,
      }))
  },
})

export const { setSelectedFile } = filesSlice.actions

export default filesSlice.reducer
