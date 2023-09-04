import { idToPalette } from '../../utils/idToPalette'
import { idToGradient } from '../../utils/idToGradient'
import { gradientToCss } from '../../utils/gradientToCss'
import { gradientToAnimation } from '../../utils/gradientToAnimation'

import { apiSlice } from '../../app/api/apiSlice'
import { User, setSavedColors, setSavedGradientAnimations, setSavedGradients, setSavedPalettes } from './authSlice'
import { Color } from '../colors/colorsSlice'
import { Palette } from '../palettes/palettesSlice'
import { Gradient } from '../gradient/gradientsSlice'
import { AnimationInfo, GradientAnimation } from '../gradientAnimations/gradientAnimationsSlice'

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    signIn: builder.mutation({
      query: (credentials) => ({
        url: 'users/signin',
        method: 'POST',
        body: { ...credentials }
      })
    }),
    signUp: builder.mutation({
      query: (credentials) => ({
        url: 'users/signup',
        method: 'POST',
        body: { ...credentials }
      })
    }),
    smSignIn: builder.mutation({
      query: (key) => ({
        url: 'auth/signin',
        method: 'POST',
        body: { key: key }
      })
    }),
    getSaved: builder.query<Partial<User>, void>({
      query: () => {
        const user = JSON.parse(localStorage.getItem('user') as string)
        return `users/${user.id}`
      },
      transformResponse: (response: Partial<User>) => {
        if (response.colors) {
          response.colors.map(color => {
            color.name = `#${color.name}`
            color.saved = true
            return color
          })
        }

        if (response.palettes) {
          response.palettes.map(palette => {
            palette.colorsArr = idToPalette(palette.colors as string)
            palette.saved = true
            return palette
          })
        }

        if (response.gradients) {
          response.gradients.map(gradient => {
            const newGradient = idToGradient(gradient)
            newGradient.saved = true
            return newGradient
          })
        }

        if (response['gradient-animations']) {
          response['gradient-animations'].map(gradient => {
            const newGradientAnimation = idToGradient(gradient) as GradientAnimation
            newGradientAnimation.styles = gradientToCss(newGradientAnimation.gradient)
            newGradientAnimation.animation = gradientToAnimation(newGradientAnimation.gradient.animation as AnimationInfo)
            newGradientAnimation.saved = true
            
            return newGradientAnimation
          })
        }

        return response
      },
      onQueryStarted: async (_undefined, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(setSavedColors(data.colors as Partial<Color>[]))
          dispatch(setSavedPalettes(data.palettes as Partial<Palette>[]))
          dispatch(setSavedGradients(data.gradients as Partial<Gradient>[]))
          dispatch(setSavedGradientAnimations(data['gradient-animations'] as Partial<GradientAnimation>[]))
        } catch (err) {
          return
        }
      },
      providesTags: () => [{ type: 'Collection', id: 'LIST' }]
    }),
  })
})

export const {
  useSignInMutation,
  useSignUpMutation,
  useSmSignInMutation,
  useGetSavedQuery
} = authApiSlice

export const selectUserResult = authApiSlice.endpoints.getSaved.select()