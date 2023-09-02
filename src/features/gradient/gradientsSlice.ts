import { EntityState, createEntityAdapter, createSelector } from '@reduxjs/toolkit'

import { apiSlice } from '../../app/api/apiSlice'
import { RootState } from '../../app/store'
import { setSavedGradients } from '../auth/authSlice'
import { authApiSlice } from '../auth/authApiSlice'
import { idToGradient } from '../../utils/idToGradient'
import { gradientToCss } from '../../utils/gradientToCss'

interface Color {
  color: string
  id: number
}

export interface GradientColor {
  colors: Color[]
  stops: number[]
}

export interface GradientInfo {
  type: string
  angle: number
  firstRow: GradientColor
  secondRow?: GradientColor
}

export interface GradientStyles {
  base: string
  grid?: string
}

export interface Gradient {
  id: string
  name: string
  users: string[]
  savedCount: number
  saved?: boolean
  gradient: GradientInfo
  styles: GradientStyles
}

const gradientAdapter = createEntityAdapter<Gradient>()

const initialState = gradientAdapter.getInitialState()

export const gradientApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getGradients: builder.query<EntityState<Gradient>, { page: number }>({
      query: ({ page }) => `/gradients?page=${page}`,
      transformResponse: (response: Gradient[]) => {
        const user = JSON.parse(localStorage.getItem('user') as string)

        const loadedGradients = response.map(gradient => {
          const newGradient = idToGradient(gradient)
          if (user && gradient.users.includes(user.id)) newGradient.saved = true
          newGradient.styles = gradientToCss(newGradient.gradient)
          return newGradient
        })

        return gradientAdapter.setAll(initialState, loadedGradients)
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Gradient', id: 'LIST' },
              ...result.ids.map(id => ({ type: 'Gradient' as const, id }))
            ]
          : [{ type: 'Gradient', id: 'LIST' }]
    }),
    saveGradient: builder.mutation({
      query: ({ name }) => ({
        url: '/gradients/save',
        method: 'POST',
        body: { name }
      }),
      async onQueryStarted({ id, unsavedGradient, isNew, name }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          gradientApiSlice.util.updateQueryData('getGradients', { page : 1 }, draft => {
            const gradient = draft.entities[id]
            if (gradient) gradient.saved = true
          })
        )

        let patchUserResult
        if (unsavedGradient) {
          patchUserResult = dispatch(
            authApiSlice.util.updateQueryData('getSaved', undefined, draft => {
              const newGradients = [...draft.gradients as Partial<Gradient>[]]
              newGradients.splice(unsavedGradient.index, 0, unsavedGradient.gradient)
              draft.gradients = newGradients
              dispatch(setSavedGradients(newGradients))
            })
          )
        }

        if (isNew) {
          patchUserResult = dispatch(
            authApiSlice.util.updateQueryData('getSaved', undefined, draft => {
              const newGradients = [...draft.gradients as Partial<Gradient>[]]
              newGradients.push({ name })
              draft.gradients = newGradients
              dispatch(setSavedGradients(newGradients))
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
    unsaveGradient: builder.mutation({
      query: ({ name }) => ({
        url: '/gradients/unsave',
        method: 'POST',
        body: { name }
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          gradientApiSlice.util.updateQueryData('getGradients', { page : 1 }, draft => {
            const gradient = draft.entities[id]
            if (gradient) gradient.saved = false
          })
        )

        const patchUserResult = dispatch(
          authApiSlice.util.updateQueryData('getSaved', undefined, draft => {
            const newGradients = draft.gradients?.filter(gradient => gradient.id !== id)
            draft.gradients = newGradients
            dispatch(setSavedGradients(newGradients as Partial<Gradient>[]))
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
  useGetGradientsQuery,
  useSaveGradientMutation,
  useUnsaveGradientMutation
} = gradientApiSlice

export const selectGradientsResult = gradientApiSlice.endpoints.getGradients.select({ page: 1 })

const selectGradientsData = createSelector(
  selectGradientsResult,
  result => result.data
)

export const {
  selectAll: selectAllGradients
} = gradientAdapter.getSelectors((state: RootState) => selectGradientsData(state) ?? initialState)