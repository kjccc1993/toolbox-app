import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import env from 'react-dotenv'

export const getFilesRequest = createAsyncThunk('files/data', async () => {
  const url = `${env.API_URL}/data`
  const resp = await fetch(url)

  if (!resp.ok) {
    return Promise.reject()
  }

  return resp.json()
})

const initialState = {
  data: [],
  error: null,
  isLoading: false,
}

export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getFilesRequest.pending, (state) => ({
        ...state,
        isLoading: true,
      }))
      .addCase(getFilesRequest.fulfilled, (state, { payload }) => ({
        ...state,
        data: payload,
        isLoading: false,
      }))
      .addCase(getFilesRequest.rejected, (state, action) => ({
        ...state,
        error: action.error.message,
        isLoading: false,
      }))
  },
})

export default filesSlice.reducer
