import React, { useState } from 'react'

import { ImageCanvas } from './ImageCanvas'
import { SecondaryButton } from '../buttons/SecondaryButton'
import { DraggableModal } from '../../containers/DraggableModal'
import { ExtractorForm } from './ExtractorForm'

import { ColorsAction } from '../../reducers/colors'
import { ModalsAction } from '../../reducers/modals'

import '../../styles/ImageColorExtractor.css'

interface ImageColorExtractorProps {
  colorsDispatch: React.Dispatch<ColorsAction>
  modalsDispatch: React.Dispatch<ModalsAction>
}

export const ImageColorExtractor = ({ colorsDispatch, modalsDispatch }: ImageColorExtractorProps) => {
  const [url, setUrl] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState('')
  

  return (
    <DraggableModal nameClass="Image-Color-Extractor">
      { url === ''
        ?
          <ExtractorForm
            setUrl={setUrl}
            errorMessage={errorMessage}
          />
        : 
          <ImageCanvas
            url={url}
            setUrl={setUrl}
            setErrorMessage={setErrorMessage}
            colorsDispatch={colorsDispatch}
          />
      }
      <SecondaryButton
        event={() => modalsDispatch({ type: 'img-extractor' })}
        content='Close'
      />
    </DraggableModal>
  )
}
