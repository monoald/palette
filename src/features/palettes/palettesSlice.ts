import { EntityState, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { idToPalette } from "../../utils/idToPalette";

import { apiSlice } from "../../app/api/apiSlice";
import { RootState } from "../../app/store";
import { setSavedPalettes } from "../auth/authSlice";
import { authApiSlice } from "../auth/authApiSlice";

export interface Palette {
  id: string
  colors: string
  colorsArr: string[]
  users: string[]
  length: number
  savedCount: number
  saved: boolean
}

const paletteAdapter = createEntityAdapter<Palette>()

const initialState = paletteAdapter.getInitialState()

export const paletteApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPalettes: builder.query<EntityState<Palette>, { page: number }>({
      query: ({ page }) => `/palettes?page=${page}`,
      transformResponse: (response: Palette[]) => {
        const user = JSON.parse(localStorage.getItem('user') as string)

        const loadedPalettes = response.map(palette => {
          if (user && palette.users.includes(user.id)) palette.saved = true
          if (typeof palette.colors === 'string') palette.colorsArr = idToPalette(palette.colors)
          return palette
        })

        return paletteAdapter.setAll(initialState, loadedPalettes)
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Palette', id: 'LIST' },
              ...result.ids.map(id => ({ type: 'Palette' as const, id }))
            ]
          : [{ type: 'Palette', id: 'LIST' }]
    }),
    savePalette: builder.mutation({
      query: ({ colors }) => ({
        url: '/palettes/save',
        method: 'POST',
        body: { colors }
      }),
      async onQueryStarted({ id, unsavedPalette, undoAction, isNew, colors }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          paletteApiSlice.util.updateQueryData('getPalettes', { page : 1 }, draft => {
            const palette = draft.entities[id]
            if (palette) palette.saved = true
          })
        )

        let patchUserResult
        if (unsavedPalette && undoAction) {
          patchUserResult = dispatch(
            authApiSlice.util.updateQueryData('getSaved', undefined, draft => {
              const newPalettes = [...draft.palettes as Partial<Palette>[]]
              newPalettes.splice(unsavedPalette.index, 0, unsavedPalette.palette)
              draft.palettes = newPalettes
              dispatch(setSavedPalettes(newPalettes))
            })
          )
        }

        if (isNew) {
          patchUserResult = dispatch(
            authApiSlice.util.updateQueryData('getSaved', undefined, draft => {
              const newPalettes = [...draft.palettes as Partial<Palette>[]]
              newPalettes.push({ colors })
              draft.palettes = newPalettes
              dispatch(setSavedPalettes(newPalettes))
            })
          )
        }

        try {
          await queryFulfilled
        } catch (error) {
          patchResult.undo()
          patchUserResult?.undo()
        }
      },
    }),
    unsavePalette: builder.mutation({
      query: ({ colors }) => ({
        url: '/palettes/unsave',
        method: 'POST',
        body: { colors }
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          paletteApiSlice.util.updateQueryData('getPalettes', { page : 1 }, draft => {
            const palette = draft.entities[id]
            if (palette) palette.saved = false
          })
        )

        const patchUserResult = dispatch(
          authApiSlice.util.updateQueryData('getSaved', undefined, draft => {
            const newPalettes = draft.palettes?.filter(palette => palette.id !== id)
            draft.palettes = newPalettes
            dispatch(setSavedPalettes(newPalettes as Partial<Palette>[]))
          })
        )

        try {
          await queryFulfilled
        } catch (error) {
          patchResult.undo()
          patchUserResult.undo()
        }
      },
    })
  })
})

export const {
  useGetPalettesQuery,
  useSavePaletteMutation,
  useUnsavePaletteMutation
} = paletteApiSlice

export const selectPalettesResult = paletteApiSlice.endpoints.getPalettes.select({ page: 1 })

const selectPaletteData = createSelector(
  selectPalettesResult,
  result => result.data
)

export const {
  selectAll: selectAllPalettes,
  selectById: selectPaletteById,
  selectIds: selectPalettesIds
} =  paletteAdapter.getSelectors((state: RootState) =>
  selectPaletteData(state) ?? initialState
)