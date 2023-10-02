import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://extinct-houndstooth-fly.cyclic.cloud/api/v1/',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `bearer ${token}`)
    }
    return headers
  }
})

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Palette', 'Color', 'Gradient', 'GradientAnimation', 'Collection', 'Icon'],
  endpoints: () => ({}),
})