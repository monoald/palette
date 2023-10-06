import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'

import { apiSlice } from '../../app/api/apiSlice'
import { RootState } from '../../app/store'
import { idToGradient } from '../../utils/idToGradient'
import { gradientToCss } from '../../utils/gradientToCss'
import { getStops } from '../../utils/getStops'

interface GradientStyles {
  base: string
  grid?: string
}

interface PublicGradient {
  id: string
  name: string
  users: string[]
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

          if (user && gradient.users.includes(user.id)) newGradient.saved = true

          newGradient.styles = gradientToCss(newGradient.gradient)
          return newGradient
        })

        return publicGradientAdapter.setAll(initialState, loadedGradients)
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'PublicGradient', id: 'LIST' },
              ...result.ids.map(id => ({ type: 'PublicGradient' as const, id }))
            ]
          : [{ type: 'PublicGradient', id: 'LIST' }]
    }),
  })
})

export const {
  useGetPublicGradientsQuery
} = publicGradientApiSlice

export const selectPublicGradientsResult = publicGradientApiSlice.endpoints.getPublicGradients.select(undefined)

const selectPublicGradientsData = createSelector(
  selectPublicGradientsResult,
  result => result.data
)

export const {
  selectAll: selectAllPublicGradients
} = publicGradientAdapter.getSelectors((state: RootState) => selectPublicGradientsData(state) ?? initialState)