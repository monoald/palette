import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://localhost:3000/api/v1',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) {
      headers.set('authorization', `bearer ${token}`)
    }
    return headers
  }
})

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Palette', 'Color'],
  endpoints: builder => ({}),
})