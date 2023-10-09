import { apiSlice } from '../../app/api/apiSlice'
import { authApiSlice } from '../auth/authApiSlice'
import { setSavedGradients } from '../auth/authSlice'
import { publicGradientApiSlice } from './publicGradientsSlice'

interface Color {
  color: string
  id: string
}

export interface AnimationInfo {
  duration: number
  timing: string
  type: string
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
  animation?: AnimationInfo
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
  upId?: string
}

export const gradientApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    saveGradient: builder.mutation({
      query: ({ name }) => ({
        url: '/gradients/save',
        method: 'POST',
        body: { name }
      }),
      async onQueryStarted({ id, unsavedGradient, name }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          publicGradientApiSlice.util.updateQueryData('getPublicGradients', 1, draft => {
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
        } else {
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
      async onQueryStarted({ id, name }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          publicGradientApiSlice.util.updateQueryData('getPublicGradients', 1, draft => {
            const gradient = draft.entities[id]
            if (gradient) gradient.saved = false
          })
        )

        const patchUserResult = dispatch(
          authApiSlice.util.updateQueryData('getSaved', undefined, draft => {
            const newGradients = draft.gradients?.filter(gradient => gradient.name !== name)
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
  useSaveGradientMutation,
  useUnsaveGradientMutation
} = gradientApiSlice