import { normalizeUserData } from '../../utils/normalizeUserData'

import { apiSlice } from '../../app/api/apiSlice'
import { User, setSavedColors, setSavedGradientAnimations, setSavedGradients, setSavedIcons, setSavedPalettes } from './authSlice'
import { Color } from '../colors/colorsSlice'
import { Palette } from '../palettes/palettesSlice'
import { Gradient } from '../gradient/gradientsSlice'
import { GradientAnimation } from '../gradientAnimations/gradientAnimationsSlice'
import { IconCollection } from '../icons/iconsSlice'

interface SmSignIn {
  token: string
  user: Partial<User>
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    signIn: builder.mutation({
      query: (credentials) => ({
        url: 'users/signin',
        method: 'POST',
        body: { ...credentials }
      }),
      transformResponse: (response: SmSignIn) => {
        response.user = normalizeUserData(response.user)

        return response
      },
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
      }),
      transformResponse: (response: SmSignIn) => {
        response.user = normalizeUserData(response.user)

        return response
      },
    }),
    getSaved: builder.query<Partial<User>, void>({
      query: () => {
        const user = JSON.parse(localStorage.getItem('user') as string)
        return `users/${user.id}`
      },
      transformResponse: (response: Partial<User>) => {
        const normalizedData = normalizeUserData(response)

        return normalizedData
      },
      onQueryStarted: async (_undefined, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(setSavedColors(data.colors as Partial<Color>[]))
          dispatch(setSavedPalettes(data.palettes as Partial<Palette>[]))
          dispatch(setSavedGradients(data.gradients as Partial<Gradient>[]))
          dispatch(setSavedGradientAnimations(data['gradient-animations'] as Partial<GradientAnimation>[]))
          dispatch(setSavedIcons(data.icons as Partial<IconCollection>[]))
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