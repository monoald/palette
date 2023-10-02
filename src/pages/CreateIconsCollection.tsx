import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { IconCollection, useCreateIconMutation } from '../features/icons/iconsSlice'

import { IconContainer } from '../containers/IconContainer'
import { isFetchBaseQueryError } from '../utils/isFetchBaseQueryError'
import { normalizeIcon } from '../utils/normalizeIcon'
import { useAppDispatch } from '../app/hooks'
import { addSavedIcon } from '../features/auth/authSlice'
import { generateThumbnail } from '../utils/generateThumbnail'

export const CreateIconsCollection = () => {
  const [errorMessage, setErrorMessage] = useState('')
  const [firstRender, setFirstRender] = useState(true)
  const [icon, setIcon] = useState()

  const [createIcon, { isLoading }] = useCreateIconMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { state } = useLocation()

  useEffect(() => {
    if (state && state.icon) {
      setIcon(state.icon)
    }
    setFirstRender(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const saveHandler = async (icon: IconCollection) => {
    const newIcons = normalizeIcon(icon)
    newIcons.thumbnail = await generateThumbnail(newIcons.icons.slice(0,6))

    try {
      console.log(newIcons)
      const newIcon = await createIcon(newIcons).unwrap()
      if (newIcon) {
        dispatch(addSavedIcon(newIcon))
        navigate(
          `/icons/edit/${newIcon.id}`,
          { 
            state: { isNew: true }
          }
        )
      }
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        setErrorMessage((error.data as { message: string })?.message)
      }
    }
  }
  return (
    <>
      { !firstRender &&
        <>
          { isLoading &&
            <div className='loader-modal'>
              <span className='loader loader--icon' />
            </div>
          }
          <IconContainer
            isEdit={false}
            icon={icon}
            saveHandler={saveHandler}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        </>
      }
    </>
  )
}
