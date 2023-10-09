import { EntityState, createEntityAdapter, createSelector } from '@reduxjs/toolkit'

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
    getPublicGradients: builder.query<EntityState<PublicGradient>, number>({
      query: (page) => `/public-gradients?page=${page}`,
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
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName
      },
      merge: (currentCache, newItems) => {
        if (newItems.ids.length !== 0) {
          currentCache.ids.push(...newItems.ids)
          currentCache.entities = { ...currentCache.entities, ...newItems.entities }
        } else {
          currentCache.ids.push('no-more-items')
          currentCache.entities = {
            ...currentCache.entities,
            'no-more-items': {
              name: '',
              users: [''],
              id: '',
              upId: '',
              saved: false,
              styles: {
                base: ''
              }
            }
          }
        }

        return currentCache
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
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

export const selectPublicGradientsResult = publicGradientApiSlice.endpoints.getPublicGradients.select(1)

const selectPublicGradientsData = createSelector(
  selectPublicGradientsResult,
  result => result.data
)

export const {
  selectAll: selectAllPublicGradients
} = publicGradientAdapter.getSelectors((state: RootState) => selectPublicGradientsData(state) ?? initialState)