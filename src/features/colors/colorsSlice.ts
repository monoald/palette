import { EntityState, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

export interface Color {
  id: string
  name: string
  users: string[]
  savedCount: number
  userLike?: boolean
}

const colorAdapter = createEntityAdapter<Color>()

const initialState = colorAdapter.getInitialState()

export const colorApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getColors: builder.query<EntityState<Color>, { page: number; userId?: string}>({
      query: ({ page }) => `/colors?page=${page}`,
      transformResponse: (response: Color[], meta, arg) => {
        const userId = arg.userId

        if (!userId) return colorAdapter.setAll(initialState, response)

        const loadedColors = response.map(color => {
          if (color.users.includes(userId)) color.userLike = true
          color.name = `#${color.name}`
          return color
        })

        console.log(loadedColors);

        return colorAdapter.setAll(initialState, loadedColors)
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Color', id: 'LIST' },
              ...result.ids.map(id => ({ type: 'Color' as const, id }))
            ]
          : [{ type: 'Color', id: 'LIST' }]
    })
  })
})

export const { useGetColorsQuery } = colorApiSlice