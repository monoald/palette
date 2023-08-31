import React, { useState } from 'react'

import { ImageCanvas } from './ImageCanvas'
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
    <DraggableModal nameClass='Image-Color-Extractor'>
      <button
        className='close-button'
        onClick={() => modalsDispatch({ type: 'img-extractor' })}
      >
        <span className='close-button__icon icon-x'/>
      </button>
      
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
    </DraggableModal>
  )
}
