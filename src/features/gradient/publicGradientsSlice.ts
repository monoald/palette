import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'

import { apiSlice } from '../../app/api/apiSlice'
import { RootState, store } from '../../app/store'
import { idToGradient } from '../../utils/idToGradient'
import { gradientToCss } from '../../utils/gradientToCss'
import { getStops } from '../../utils/getStops'
import { Gradient } from './gradientsSlice'

interface GradientStyles {
  base: string
  grid?: string
}

interface PublicGradient {
  id: string
  name: string
  styles: GradientStyles
  saved?: boolean
  upId?: string
}

const publicGradientAdapter = createEntityAdapter<PublicGradient>()

const initialState = publicGradientAdapter.getInitialState()

export const publicGradientApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPublicGradients: builder.query({
      query: () => '/public-gradients',
      transformResponse: (response: PublicGradient[]) => {
        const user = JSON.parse(localStorage.getItem('user') as string)

        const loadedGradients = response.map(gradient => {
          const colors = gradient.name.split('-')
          const newStops = getStops(100 / (colors.length - 1))

          let newName = ''
          colors.forEach((item, index) => {
            newName += `${item}-${newStops[index]}`

            if (index !== colors.length - 1) newName += '_'
          })
          newName = `t=horizontal&r1=${newName}`
          const normalizedGradient = { ...gradient, name: newName}
          const newGradient = idToGradient(normalizedGradient)
          if (user) {
            let isSaved = false
            const savedGradients = store.getState().auth.user?.gradients as Gradient[]
            savedGradients.forEach(grad => {
              if (grad.upId === gradient.upId)  isSaved = true
            })
            newGradient.saved = isSaved
          }
          newGradient.styles = gradientToCss(newGradient.gradient)
          return newGradient
        })

        return publicGradientAdapter.setAll(initialState, loadedGradients)
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Gradient', id: 'LIST' },
              ...result.ids.map(id => ({ type: 'Gradient' as const, id }))
            ]
          : [{ type: 'Gradient', id: 'LIST' }]
    }),
  })
})

export const {
  useGetPublicGradientsQuery
} = publicGradientApiSlice

export const selectPublicGradientsResult = publicGradientApiSlice.endpoints.getPublicGradients.select('')

const selectPublicGradientsData = createSelector(
  selectPublicGradientsResult,
  result => result.data
)

export const {
  selectAll: selectAllPublicGradients
} = publicGradientAdapter.getSelectors((state: RootState) => selectPublicGradientsData(state) ?? initialState)