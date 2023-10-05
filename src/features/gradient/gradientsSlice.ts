import { apiSlice } from '../../app/api/apiSlice'

interface Color {
  color: string
  id: number
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
      })
    }),
    unsaveGradient: builder.mutation({
      query: ({ name }) => ({
        url: '/gradients/unsave',
        method: 'POST',
        body: { name }
      })
    })
  })
})

export const {
  useSaveGradientMutation,
  useUnsaveGradientMutation
} = gradientApiSlice