import { EntityState, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { idToPalette } from "../../utils/idToPalette";
import { RootState } from "../../app/store";

export interface Palette {
  colors: string
  colorsArr: string[]
  length: number
  savedCount: number
  id: string
}

const paletteAdapter = createEntityAdapter<Palette>()

const initialState = paletteAdapter.getInitialState()

export const paletteApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPalettes: builder.query<EntityState<Palette>, number>({
      query: (page) => `/palettes?page=${page}`,
      transformResponse: (response: Palette[]) => {
        const loadedPalettes = response.map(palette => {
          if (typeof palette.colors === 'string') palette.colorsArr = idToPalette(palette.colors)
          return palette
        })
        console.log(loadedPalettes);
        

        return paletteAdapter.setAll(initialState, loadedPalettes)
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Palette', id: 'LIST' },
              ...result.ids.map(id => ({ type: 'Palette' as const, id }))
            ]
          : [{ type: 'Palette', id: 'LIST' }]
    })
  })
})

export const { useGetPalettesQuery } = paletteApiSlice

// export const selectPalettesResult = paletteApiSlice.endpoints.getPalettes.select()

// const selectPaletteData = createSelector(
//   selectPalettesResult,
//   result => result.data
// )

// export const {
//   selectAll: selectAllPalettes,
//   selectById: selectPaletteById,
//   selectIds: selectPalettesIds
// } =  paletteAdapter.getSelectors((state: RootState) =>
//   selectPaletteData(state) ?? initialState
// )