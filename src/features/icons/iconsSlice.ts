import { apiSlice } from "../../app/api/apiSlice";

export interface Icon {
  id?: string | undefined
  name: string
  content: string
  unicode: string
  color: string | undefined
  warning?: boolean
}

export interface IconCollection {
  id?: string
  name: string
  color: string | undefined
  icons: Icon[]
  thumbnail: string
}

export const iconApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createIcon: builder.mutation({
      query: (iconCollection) => ({
        url: '/icons',
        method: 'POST',
        body: iconCollection
      }),
    }),
    updateIcon: builder.mutation({
      query: ({ iconCollection, id }) => ({
        url: `/icons/${id}`,
        method: 'PATCH',
        body: { ...iconCollection }
      })
    }),
    deleteIcon: builder.mutation({
      query: (id) => ({
        url: `/icons/${id}`,
        method: 'DELETE'
      }),
    })
  })
})

export const {
  useCreateIconMutation,
  useUpdateIconMutation,
  useDeleteIconMutation
} = iconApiSlice