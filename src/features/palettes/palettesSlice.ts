import { apiSlice } from '../../app/api/apiSlice'
import { setSavedPalettes } from '../auth/authSlice'
import { authApiSlice } from '../auth/authApiSlice'
import { publicPaletteApiSlice } from './publicPalettesSlice'
import { idToPalette } from '../../utils/idToPalette'
import { generatePaletteId } from '../../utils/generatePaletteId'

export interface Palette {
  id: string
  colors: string
  colorsArr: string[]
  users: string[]
  length: number
  savedCount: number
  saved: boolean
  upId?: string
}

export const paletteApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    savePalette: builder.mutation({
      query: ({ colors }) => ({
        url: '/palettes/save',
        method: 'POST',
        body: { colors }
      }),
      async onQueryStarted({ id, unsavedPalette, undoAction, colors }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          publicPaletteApiSlice.util.updateQueryData('getPublicPalettes', 1, draft => {
            const palette = draft.entities[id]
            if (palette) palette.saved = true
          })
        )

        let patchUserResult
        if (unsavedPalette && undoAction) {
          patchUserResult = dispatch(
            authApiSlice.util.updateQueryData('getSaved', undefined, draft => {
              const newPalettes = [...draft.palettes as Partial<Palette>[]]
              newPalettes.splice(unsavedPalette.index, 0, unsavedPalette.palette)
              draft.palettes = newPalettes
              dispatch(setSavedPalettes(newPalettes))
            })
          )
        } else {
          patchUserResult = dispatch(
            authApiSlice.util.updateQueryData('getSaved', undefined, draft => {
              const newPalettes = [...draft.palettes as Partial<Palette>[]]
              newPalettes.push({
                id,
                colors,
                saved: true,
                colorsArr: idToPalette(colors),
                upId: generatePaletteId(colors)
              })
              draft.palettes = newPalettes
              dispatch(setSavedPalettes(newPalettes))
            })
          )
        }

        try {
          await queryFulfilled
        } catch (error) {
          patchResult.undo()
          patchUserResult?.undo()
        }
      }
    }),
    unsavePalette: builder.mutation({
      query: ({ colors }) => ({
        url: '/palettes/unsave',
        method: 'POST',
        body: { colors }
      }),
      async onQueryStarted({ colors, id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          publicPaletteApiSlice.util.updateQueryData('getPublicPalettes', 1, draft => {
            const palette = draft.entities[id]
            if (palette) palette.saved = false
          })
        )

        const patchUserResult = dispatch(
          authApiSlice.util.updateQueryData('getSaved', undefined, draft => {
            const newPalettes = draft.palettes?.filter(palette => palette.colors !== colors)
            draft.palettes = newPalettes
            dispatch(setSavedPalettes(newPalettes as Partial<Palette>[]))
          })
        )

        try {
          await queryFulfilled
        } catch (error) {
          patchResult.undo()
          patchUserResult.undo()
        }
      },
    })
  })
})

export const {
  useSavePaletteMutation,
  useUnsavePaletteMutation
} = paletteApiSlice