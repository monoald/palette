import { IconCollection, useDeleteIconMutation, useUpdateIconMutation } from '../features/icons/iconsSlice'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { getIconById, removeSavedIcon, updateSavedIcon } from '../features/auth/authSlice'
import { IconContainer } from '../containers/IconContainer'
import { useEffect, useState } from 'react'
import { normalizeIcon } from '../utils/normalizeIcon'
import Tooltip from '../components/tooltips/Tooltip'
import { isFetchBaseQueryError } from '../utils/isFetchBaseQueryError'
import { checkIconModified } from '../utils/checkIconModified'
import { useTooltip } from '../hooks/useTooltip'

const EditIconCollection = () => {
  const [errorMessage, setErrorMessage] = useState('')
  
  const [tooltipMessage, setTooltipMessage] = useTooltip()
  const { id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  const icon = useAppSelector(getIconById(id as string)) as IconCollection
  const dispatch = useAppDispatch()
  const [updateIcon, { isLoading: updateLoading }] = useUpdateIconMutation()
  const [deleteIcon, { isLoading: deleteLoading }] = useDeleteIconMutation()

  useEffect(() => {
    if (state && state.isNew) {
      setTooltipMessage('Icons saved and fonts created.')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const saveHandler = async (iconCollection: IconCollection) => {
    
    const modified = checkIconModified(icon, {
      ...iconCollection,
      color: iconCollection.color === '#' ? undefined : iconCollection.color
    })

    if (modified) {
      const newIcons = normalizeIcon(iconCollection)
      try {
        const newIcon = await updateIcon({ iconCollection: newIcons, id: icon.id }).unwrap()
        if (newIcon) {
          setTooltipMessage('Succesfully Updated.')
          dispatch(updateSavedIcon({ id: icon.id as string, newIcon}))
        }
        setErrorMessage('')
      } catch (error) {
        if (isFetchBaseQueryError(error)) {
          setErrorMessage((error.data as { message: string })?.message)
        }
      }
    } else {
      setErrorMessage('Make some change to update.')
    }
  }

  const unsaveHandler = async () => {
    try {
      const deleteSuccess = await deleteIcon(icon.id)
      if (deleteSuccess) {
        const deleteSuccess = dispatch(removeSavedIcon(icon.id as string))
        if (deleteSuccess) {
          navigate(
            '/create-icons-collection',
            { 
              state: {
                icon: icon
              }
            }
          )
        }
      }
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        setErrorMessage((error.data as { message: string })?.message)
      }
    }
  }


  return (
    <>
      { icon &&
        <>
          { (updateLoading || deleteLoading) &&
            <div className='loader-modal'>
              <span className='loader loader--icon' />
            </div>
          }
          <IconContainer
            isEdit={true}
            icon={icon}
            saveHandler={saveHandler}
            unsaveHandler={unsaveHandler}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />

          <Tooltip message={tooltipMessage} />
        </>
      }
    </>
    
  )
}

export default EditIconCollection