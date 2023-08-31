import React, { useState } from 'react'

import '../../styles/ExtractorForm.css'

interface ExtractorFormProps {
  setUrl: React.Dispatch<React.SetStateAction<string>>
  errorMessage: string
}

export const ExtractorForm = ({ setUrl, errorMessage }: ExtractorFormProps) => {
  const [urlInput, setUrlInput] = useState('')

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(event.target.value)
  }

  const handleUrlSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setUrl(urlInput)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setUrl(reader.result as string)
      setUrlInput(reader.result as string)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const target = event.target as HTMLElement
    target.classList.add('image-input--dragging-over')
  }

  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const target = event.target as HTMLElement
    target.classList.remove('image-input--dragging-over')
  }

  return (
    <div className='Extractor-Form'>
      <form
        className='text-input'
        onSubmit={handleUrlSubmit}
      >
        <label htmlFor='url' className='text-input__label'>
          URL
        </label>
        <input
          id='url'
          className='text-input__area'
          type='text'
          placeholder='https://'
          value={urlInput}
          onChange={handleUrlChange}
        />

        <input type='submit' value={'Load'} className='primary-button' />
      </form>

      <p className='Extractor-Form__error-message'>
        {errorMessage}
      </p>

      <div
        className='image-input'
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragEnd}
      >
        <p className='image-input__placeholder'>
          <span className='image-input__icon icon-image' />
          Drop an image
        </p>
      </div>
    </div>
  )
}
