import { apiSlice } from '../../app/api/apiSlice'
import { idToPalette } from '../../utils/idToPalette'
import { User, setSavedColors, setSavedGradients, setSavedPalettes } from './authSlice'
import { Color } from '../colors/colorsSlice'
import { Palette } from '../palettes/palettesSlice'
import { Gradient } from '../gradient/gradientsSlice'
import { idToGradient } from '../../utils/idToGradient'

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
        return response
      },
      onQueryStarted: async (_undefined, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(setSavedColors(data.colors as Partial<Color>[]))
          dispatch(setSavedPalettes(data.palettes as Partial<Palette>[]))
          dispatch(setSavedGradients(data.gradients as Partial<Gradient>[]))
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