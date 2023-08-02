import { Middleware } from "@reduxjs/toolkit"
import { setCollectionModified } from "../features/auth/authSlice";
import { authApiSlice } from "../features/auth/authApiSlice";

const validMutations = [
  'saveColor',
  'unsaveColor',
  'savePalette',
  'unsavePalette'
]

export const middleware: Middleware =
  ({ dispatch, getState }) =>
  next =>
  action => {

    const collectionModified = getState().auth.collectionModified

    if (action.type === 'auth/resetCollectionModified') {
      dispatch(
        authApiSlice.util.invalidateTags([{ type: 'Collection', id: 'LIST' }])
      )
      return next(action)
    }

    if (
      action.type === 'api/executeMutation/fulfilled' &&
      validMutations.includes(action.meta.arg.endpointName) &&
      !action.meta.arg.originalArgs.fromProfile &&
      !collectionModified
    ) {
      dispatch(setCollectionModified())
      return next(action)
    }

    return next(action)
  }