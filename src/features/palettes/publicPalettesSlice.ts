import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import { idToPalette } from '../../utils/idToPalette'

import { apiSlice } from '../../app/api/apiSlice'
import { RootState } from '../../app/store'

export interface Palette {
  id: string
  colors: string
  colorsArr: string[]
  users: string[]
  length: number
  savedCount: number
  saved: boolean
  upId: string
}

const publicPaletteAdapter = createEntityAdapter<Palette>()

const initialState = publicPaletteAdapter.getInitialState()

export const publicPaletteApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPublicPalettes: builder.query({
      query: () => `/public-palettes`,
      transformResponse: (response: Palette[]) => {
        const user = JSON.parse(localStorage.getItem('user') as string)

        const loadedPalettes = response.map(palette => {
          if (user && palette.users.includes(user.id)) palette.saved = true
          if (typeof palette.colors === 'string') palette.colorsArr = idToPalette(palette.colors)
          return palette
        })

        return publicPaletteAdapter.setAll(initialState, loadedPalettes)
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'PublicPalette', id: 'LIST' },
              ...result.ids.map(id => ({ type: 'PublicPalette' as const, id }))
            ]
          : [{ type: 'PublicPalette', id: 'LIST' }]
    }),
  })
})

export const {
  useGetPublicPalettesQuery
} = publicPaletteApiSlice

export const selectPalettesResult = publicPaletteApiSlice.endpoints.getPublicPalettes.select({ page: 1 })

const selectPaletteData = createSelector(
  selectPalettesResult,
  result => result.data
)

export const {
  selectAll: selectAllPalettes,
  selectById: selectPaletteById,
  selectIds: selectPalettesIds
} =  publicPaletteAdapter.getSelectors((state: RootState) =>
  selectPaletteData(state) ?? initialState
)