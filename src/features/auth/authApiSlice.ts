import Cookies from "js-cookie";
import { apiSlice } from "../../app/api/apiSlice";
import { idToPalette } from "../../utils/idToPalette";
import { User, setSavedColors, setSavedPalettes } from "./authSlice";
import { Color } from "../colors/colorsSlice";
import { Palette } from "../palettes/palettesSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'users/signin',
        method: 'POST',
        body: { ...credentials }
      })
    }),
    getSaved: builder.query<Partial<User>, void>({
      query: () => {
        let user = null
        const userCookie = Cookies.get('user')?.substring(2)
        if (userCookie) user = JSON.parse(userCookie)
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
        return response
      },
      onQueryStarted: async (_undefined, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(setSavedColors(data.colors as Partial<Color>[]))
          dispatch(setSavedPalettes(data.palettes as Partial<Palette>[]))
        } catch (err) {
          return
        }
      }
    }),
  })
})

export const {
  useLoginMutation,
  useGetSavedQuery
} = authApiSlice

export const selectUserResult = authApiSlice.endpoints.getSaved.select()