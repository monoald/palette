import { EntityState, createEntityAdapter, createSelector } from '@reduxjs/toolkit'

import { apiSlice } from '../../app/api/apiSlice'
import { RootState } from '../../app/store'
import { setSavedColors } from '../auth/authSlice'
import { authApiSlice } from '../auth/authApiSlice'

export interface Color {
  id: string
  name: string
  users: string[]
  savedCount: number
  saved?: boolean
}

const colorAdapter = createEntityAdapter<Color>()

const initialState = colorAdapter.getInitialState()

export const colorApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getColors: builder.query<EntityState<Color>, { page: number }>({
      query: ({ page }) => `/colors?page=${page}`,
      transformResponse: (response: Color[]) => {
        const user = JSON.parse(localStorage.getItem('user') as string)

        const loadedColors = response.map(color => {
          if (user && color.users.includes(user.id)) color.saved = true
          color.name = `#${color.name}`
          return color
        })

        return colorAdapter.setAll(initialState, loadedColors)
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Color', id: 'LIST' },
              ...result.ids.map(id => ({ type: 'Color' as const, id }))
            ]
          : [{ type: 'Color', id: 'LIST' }]
    }),
    saveColor: builder.mutation({
      query: ({ name }) => ({
        url: '/colors/save',
        method: 'POST',
        body: { name }
      }),
      async onQueryStarted({ id, unsavedColor, isNew, name }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          colorApiSlice.util.updateQueryData('getColors', { page : 1 }, draft => {
            const color = draft.entities[id]
            if (color) color.saved = true
          })
        )

        let patchUserResult
        if (unsavedColor) {
          patchUserResult = dispatch(
            authApiSlice.util.updateQueryData('getSaved', undefined, draft => {
              const newColors = [...draft.colors as Partial<Color>[]]
              newColors.splice(unsavedColor.index, 0, unsavedColor.color)
              draft.colors = newColors
              dispatch(setSavedColors(newColors))
            })
          )
        }

        if (isNew) {
          patchUserResult = dispatch(
            authApiSlice.util.updateQueryData('getSaved', undefined, draft => {
              const newColors = [...draft.colors as Partial<Color>[]]
              newColors.push({ name: `#${name}` })
              draft.colors = newColors
              dispatch(setSavedColors(newColors))
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
    unsaveColor: builder.mutation({
      query: ({ name }) => ({
        url: '/colors/unsave',
        method: 'POST',
        body: { name }
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          colorApiSlice.util.updateQueryData('getColors', { page : 1 }, draft => {
            const color = draft.entities[id]
            if (color) color.saved = false
          })
        )

        const patchUserResult = dispatch(
          authApiSlice.util.updateQueryData('getSaved', undefined, draft => {
            const newColors = draft.colors?.filter(color => color.id !== id)
            draft.colors = newColors
            dispatch(setSavedColors(newColors as Partial<Color>[]))
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
  useGetColorsQuery,
  useSaveColorMutation,
  useUnsaveColorMutation
} = colorApiSlice

export const selectColorsResult = colorApiSlice.endpoints.getColors.select({ page: 1 })

const selectColorsData = createSelector(
  selectColorsResult,
  result => result.data
)

export const {
  selectAll: selectAllColors
} = colorAdapter.getSelectors((state: RootState) => selectColorsData(state) ?? initialState)