import React, { useState } from 'react'

import { ImageCanvas } from './ImageCanvas'
import { CloseModalButton } from './CloseModalButton'

import { ColorsAction } from '../reducers/colors'
import { ModalsAction } from '../reducers/modals'

import '../styles/ImageColorExtractor.css'

interface ImageColorExtractorProps {
  colorsDispatch: React.Dispatch<ColorsAction>
  modalsDispatch: React.Dispatch<ModalsAction>
}

export const ImageColorExtractor = ({ colorsDispatch, modalsDispatch }: ImageColorExtractorProps) => {
  const [urlInput, setUrlInput] = useState("");
  const [url, setUrl] = useState<string>('');

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(event.target.value);
    
  };

  const handleUrlSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUrl(urlInput);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setUrl(reader.result as string)
      setUrlInput(reader.result as string)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }

  return (
    <dialog
      className='Image-Color-Extractor'
      open
    >
      {url === ''
        ?
          <div className='input-container'>
            <form
              className='url-input'
              onSubmit={handleUrlSubmit}
            >
              <label htmlFor="url" className='url-label'>URL:</label>
              <input
                id="url"
                type="text"
                placeholder='https://'
                value={urlInput}
                onChange={handleUrlChange}
              />
              <button className='load-button' type="submit">LOAD</button>
            </form>

            <div
              className='image-container'
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <p className='image-drop-placeholder'>
                <span className='icon icon-image' />
                Drop an image
              </p>
            </div>
          </div>
        : 
          <ImageCanvas url={url} colorsDispatch={colorsDispatch} />
      }
      <CloseModalButton modalsDispatch={modalsDispatch} type='img-extractor' />
    </dialog>
  )
}
