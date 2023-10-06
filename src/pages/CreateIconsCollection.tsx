import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTooltip } from '../hooks/useTooltip'

import { isFetchBaseQueryError } from '../utils/isFetchBaseQueryError'
import { generateThumbnail } from '../utils/generateThumbnail'
import { normalizeIcon } from '../utils/normalizeIcon'

import { IconContainer } from '../containers/IconContainer'
import Tooltip from '../components/tooltips/Tooltip'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { IconCollection, useCreateIconMutation } from '../features/icons/iconsSlice'
import { addSavedIcon, selectUser } from '../features/auth/authSlice'

export const CreateIconsCollection = () => {
  const [errorMessage, setErrorMessage] = useState('')
  const [firstRender, setFirstRender] = useState(true)
  const [icon, setIcon] = useState()

  const [createIcon, { isLoading }] = useCreateIconMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [tooltipMessage, setTooltipMessage] = useTooltip()
  const user = useAppSelector(selectUser)

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

    if (user) {
      try {
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
    } else {
      setTooltipMessage('Sign in to save your favorite icons')
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

      <Tooltip message={tooltipMessage} />
    </>
  )
}
