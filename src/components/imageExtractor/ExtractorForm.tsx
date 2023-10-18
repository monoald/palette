import React, { useState } from 'react'
import axios from 'axios'

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

  const handleUrlSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const url = await axios({
      url: 'https://extinct-houndstooth-fly.cyclic.cloud/api/v1/images/base64',
      method: 'POST',
      data: { url: urlInput }
    })
      .then((res) => res.data)

    setUrl(`data:image/png;base64,${url}`)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    console.log(event.dataTransfer.files[0])
    event.preventDefault()
    event.stopPropagation();
    const file = event.dataTransfer.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      console.log(reader.result)
      setUrl(reader.result as string)
      setUrlInput(reader.result as string)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation();
    const target = event.target as HTMLElement
    target.classList.add('image-input--dragging-over')
  }

  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation();
    const target = event.target as HTMLElement
    target.classList.remove('image-input--dragging-over')
  }


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList
    const file = files[0];

    if (file) {
      // Check if the selected file has an allowed file type
      const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp', 'image/bmp'];
      if (allowedTypes.includes(file.type)) {
        const reader = new FileReader()
        reader.onload = (event: Event) => {
          const target = event.target as EventTarget & { result: string }
          setUrl(target.result)
        }

        reader.readAsDataURL(file)
      }
    }
  };

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
        onDrop={ !navigator.userAgent.includes("Firefox") ? handleDrop : () => ''}
        onDragOver={ !navigator.userAgent.includes("Firefox") ? handleDragOver: () => ''}
        onDragLeave={ !navigator.userAgent.includes("Firefox") ? handleDragEnd: () => ''}
      >
        <input
          className='file-input'
          type="file"
          accept=".svg, .png, .jpeg, .jpg, .webp, .bmp"
          onChange={handleFileChange}
        />
        <p className='image-input__placeholder'>
          <span className='image-input__icon icon-image' />
          { !navigator.userAgent.includes("Firefox")
            ? 'Drop or Browse image'
            : 'Browse image'
          }
          
        </p>
      </div>
    </div>
  )
}
