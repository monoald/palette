import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'

import { idToGradient } from '../../utils/idToGradient'
import { gradientToCss } from '../../utils/gradientToCss'
import { gradientToAnimation } from '../../utils/gradientToAnimation'

import { apiSlice } from '../../app/api/apiSlice'
import { RootState } from '../../app/store'
import { setSavedGradientAnimations } from '../auth/authSlice'
import { authApiSlice } from '../auth/authApiSlice'

interface Color {
  color: string
  id: string
}

export interface GradientColor {
  colors: Color[]
  stops: number[]
}

export interface AnimationInfo {
  duration: number
  timing: string
  type: string
  size: string
}

export interface GradientInfo {
  type: string
  angle: number
  firstRow: GradientColor
  secondRow?: GradientColor
  animation?: AnimationInfo
}

export interface GradientStyles {
  base: string
  grid?: string
}

export interface GradientAnimation {
  id: string
  name: string
  users: string[]
  savedCount: number
  saved?: boolean
  gradient: GradientInfo
  styles: GradientStyles
  animation: string
}

const gradientAnimationAdapter = createEntityAdapter<GradientAnimation>()

const initialState = gradientAnimationAdapter.getInitialState()

export const gradientAnimationApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getGradientAnimations: builder.query({
      query: () => '/gradient-animations',
      transformResponse: (response: GradientAnimation[]) => {
        const user = JSON.parse(localStorage.getItem('user') as string)

        const loadedGradientAnimations = response.map(gradientAnimation => {
          const newGradientAnimation = idToGradient(gradientAnimation) as GradientAnimation
          if (user && gradientAnimation.users.includes(user.id)) newGradientAnimation.saved = true
          newGradientAnimation.styles = gradientToCss(newGradientAnimation.gradient)
          newGradientAnimation.animation = gradientToAnimation(newGradientAnimation.gradient.animation as AnimationInfo)
          return newGradientAnimation
        })

        return gradientAnimationAdapter.setAll(initialState, loadedGradientAnimations)
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'GradientAnimation', id: 'LIST' },
              ...result.ids.map(id => ({ type: 'GradientAnimation' as const, id }))
            ]
          : [{ type: 'GradientAnimation', id: 'LIST' }]
    }),
    saveGradientAnimation: builder.mutation({
      query: ({ name }) => ({
        url: '/gradient-animations/save',
        method: 'POST',
        body: { name }
      }),
      async onQueryStarted({ id, unsavedGradientAnimation, isNew, name }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          gradientAnimationApiSlice.util.updateQueryData('getGradientAnimations', { page : 1 }, draft => {
            const gradientAnimation = draft.entities[id]
            if (gradientAnimation) gradientAnimation.saved = true
          })
        )

        let patchUserResult
        if (unsavedGradientAnimation) {
          patchUserResult = dispatch(
            authApiSlice.util.updateQueryData('getSaved', undefined, draft => {
              const newGradientAnimations = [...draft['gradient-animations'] as Partial<GradientAnimation>[]]
              newGradientAnimations.splice(unsavedGradientAnimation.index, 0, unsavedGradientAnimation.gradientAnimation)
              draft['gradient-animations'] = newGradientAnimations
              dispatch(setSavedGradientAnimations(newGradientAnimations))
            })
          )
        }

        if (isNew) {
          patchUserResult = dispatch(
            authApiSlice.util.updateQueryData('getSaved', undefined, draft => {
              const newGradientAnimations = [...draft['gradient-animations'] as Partial<GradientAnimation>[]]
              newGradientAnimations.push({ name })
              draft['gradient-animations'] = newGradientAnimations
              dispatch(setSavedGradientAnimations(newGradientAnimations))
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
    unsaveGradientAnimation: builder.mutation({
      query: ({ name }) => ({
        url: '/gradient-animations/unsave',
        method: 'POST',
        body: { name }
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          gradientAnimationApiSlice.util.updateQueryData('getGradientAnimations', { page : 1 }, draft => {
            const gradientAnimation = draft.entities[id]
            if (gradientAnimation) gradientAnimation.saved = false
          })
        )

        const patchUserResult = dispatch(
          authApiSlice.util.updateQueryData('getSaved', undefined, draft => {
            const newGradientAnimations = draft['gradient-animations']?.filter(gradientAnimation => gradientAnimation.id !== id)
            draft['gradient-animations'] = newGradientAnimations
            dispatch(setSavedGradientAnimations(newGradientAnimations as Partial<GradientAnimation>[]))
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
  useGetGradientAnimationsQuery,
  useSaveGradientAnimationMutation,
  useUnsaveGradientAnimationMutation
} = gradientAnimationApiSlice

export const selectGradientAnimationsResult = gradientAnimationApiSlice.endpoints.getGradientAnimations.select(undefined)

const selectGradientAnimationsData = createSelector(
  selectGradientAnimationsResult,
  result => result.data
)

export const {
  selectAll: selectAllGradientAnimations
} = gradientAnimationAdapter.getSelectors((state: RootState) => selectGradientAnimationsData(state) ?? initialState)