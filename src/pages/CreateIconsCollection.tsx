import React, { useEffect, useRef, useState } from 'react'
import { createUUID } from '../utils/createUUID'
import { changeIconColor } from '../utils/changeIconColor'

import { svgs } from '../data/palette-svgs'

import { Header } from '../components/Header'
import { DescriptionTooltip } from '../components/tooltips/DescriptionTooltip'

import '../styles/CreateIconsCollection.css'

export interface Svg {
  name: string
  content: string
  unicode: string
  color: string
  id: string
  warning?: boolean
}

interface IconProps {
  svg: Svg
  setCollection: React.Dispatch<React.SetStateAction<Collection>>
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
}

interface Collection {
  name: string
  color: string
  icons: Svg[]
}
const Icon = ({ svg, setCollection, setErrorMessage }: IconProps) => {
  const [toggleSetup, setToggleSetup] = useState(false)

  const handleNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollection(prev => {
      const newIcons = [...prev.icons]
      const icon = newIcons.find(ico => ico.id === svg.id)

      const nameUsed = newIcons.find(ico => ico.name === e.target.value)

      if (nameUsed !== undefined) {
        setErrorMessage('Name already used!')
        nameUsed.warning = true
        if (icon) icon.warning = true
      } else {
        setErrorMessage('')
        newIcons.forEach(ico => {
          ico.warning = false
        })
      }

      if (icon) {
        icon.name = e.target.value
      }

      return { ...prev, icons: newIcons }
    })
  }

  const handleUnicodeChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollection(prev => {
      const newIcons = [...prev.icons]
      const icon = newIcons.find(ico => ico.id === svg.id)

      const unicodeUsed = newIcons.find(ico => ico.unicode === e.target.value)

      if (unicodeUsed !== undefined) {
        setErrorMessage('Unicode already used!')
        unicodeUsed.warning = true
        if (icon) icon.warning = true
      } else {
        setErrorMessage('')
        newIcons.forEach(ico => {
          ico.warning = false
        })
      }

      if (icon) {
        icon.unicode = e.target.value
      }

      return { ...prev, icons: newIcons }
    })
  }

  const handleColorChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollection(prev => {
      const newIcons = [...prev.icons]
      const icon = newIcons.find(ico => ico.id === svg.id)

      if (icon) {
        icon.color = e.target.value
        icon.content = changeIconColor(icon.content, e.target.value)
      }

      return { ...prev, icons: newIcons }
    })
  }

  const handleIconRemoved = () => {
    setCollection(prev => {
      const newIcons = [...prev.icons]
      const iconIndex = newIcons.findIndex(ico => ico.id === svg.id)

      newIcons.splice(iconIndex, 1)

      return { ...prev, icons: newIcons }
    })
  }

  return (
    <div
      className={`
        icon
        ${toggleSetup ? 'icon__active' : ''}
        ${svg.warning ? 'icon__warning' : ''}
      `}
    >
      <div
        className='icon__svg'
        dangerouslySetInnerHTML={{ __html: svg.content }}
      />

      <div className='input-mask'>
        <input
          className='icon__input'
          type="text"
          value={svg.name}
          onChange={handleNameChanged}
        />
      </div>

      <button
        className='icon__toggle'
        onClick={() => setToggleSetup(!toggleSetup)}
      >
        <span className='icon-arrow-down' />
      </button>

      { toggleSetup &&
        <div className='icon__setup'>
          <div className='icon__option'>
            <label htmlFor={`unicode-${svg.name}`}>Unicode:</label>
            <input
              className='icon__input'
              name={`unicode-${svg.name}`}
              id={`unicode-${svg.name}`}
              type="text"
              value={svg.unicode}
              onChange={handleUnicodeChanged}
            />
          </div>

          <div className='icon__option'>
            <label htmlFor={`color-${svg.name}`}>Color:</label>
            <input
              className='icon__input color-input'
              name={`color-${svg.name}`}
              id={`color-${svg.name}`}
              type="text"
              value={svg.color}
              onChange={handleColorChanged}
            />
          </div>

          <button className='primary-button remove-button' onClick={handleIconRemoved}>
            Remove
          </button>

          <button
            className='icon__toggle--up'
            onClick={() => setToggleSetup(!toggleSetup)}
          >
            <span className='icon-arrow-down' />
          </button>
        </div>
      }
    </div>
  )
}

export const CreateIconsCollection = () => {
  const [errorMessage, setErrorMessage] = useState('')
  const [collection, setCollection] = useState<Collection>({
    name: 'Untitled',
    color: '#',
    icons: []
  })

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCollection(prev => {
      const newIcons = [...prev.icons]

      newIcons.forEach(icon => {
        const color = collection.color === '#'
          ? '#fff'
          : collection.color
        icon.content = changeIconColor(icon.content, color)
      })

      return { ...prev, icons: newIcons }
    })
  }, [collection.color])
  

  const handleNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollection(prev => ({ ...prev, name: e.target.value }))
  }

  const handleColorChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollection(prev => {
      const newIcons = prev.icons.map(icon => ({ ...icon, color: e.target.value}))

      return {
        ...prev,
        color: e.target.value,
        icons: newIcons
      }
    })
  }

  const handleResetColor = () => {
    setCollection(prev => {
      const newIcons = prev.icons.map(icon => ({ ...icon, color: '#'}))

      return {
        ...prev,
        color: '#',
        icons: newIcons
      }
    })
  }

  const handleAddIcon = (svg: Svg) => {
    setCollection(prev => {
      const newIcons = [...prev.icons]
      const newIcon: Svg = { ...svg }

      const alreadyAdded = newIcons.findIndex(ico => ico.content === svg.content)

      if (alreadyAdded !== -1) {
        setErrorMessage('Icon already added!')
        return prev
      } else {
        setErrorMessage('')
      }

      newIcon.unicode = newIcons.length === 0
        ? 'a101'
        : (parseInt(newIcons[newIcons.length - 1].unicode as string, 16) + 1).toString(16)
      newIcon.id = createUUID()

      newIcons.push(newIcon)

      return { ...prev, icons: newIcons }
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        if (file.type === 'image/svg+xml') {
          const reader = new FileReader();

          reader.onload = (event: Event & { target: { result: string } }) => {
            const name = file.name.split('.')[0]
            const color = collection.color === '#'
              ? '#ffffff'
              : collection.color

            const content = changeIconColor(event.target.result, color);
            let warning = false

            let alreadyAdded = -1
            let nameUsed = -1

            collection.icons.forEach((ico, index) => {
              if (ico.content === content) alreadyAdded = index
              if (ico.name === name) nameUsed = index
            })

            if (alreadyAdded !== -1) {
              setErrorMessage('Icon already added!')
              return
            } else {
              setErrorMessage('')
            }

            if (nameUsed !== -1) {
              setErrorMessage('Name already used!')
              warning = true
              collection.icons[nameUsed].warning = true
            } else {
              setErrorMessage('')
              collection.icons.forEach(ico => {
                ico.warning = false
              })
            }

            const unicode = collection.icons.length === 0
              ? 'a101'
              : (parseInt(collection.icons[collection.icons.length - 1].unicode as string, 16) + 1).toString(16)
            
            const newIcon = {
              name,
              content,
              unicode,
              id: createUUID(),
              color: collection.color,
              warning
            }
            setCollection(prev => ({ ...prev, icons: [...prev.icons, newIcon]}))
          }

          reader.readAsText(file);
        }
      }
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className='create-icons-collection'>
      <Header />

      <main className='main'>
        <section className='selected-icons'>
          <div className='name-container'>
            <input
              className='collection-name'
              type='text'
              value={collection.name}
              onChange={handleNameChanged}
            />
          </div>

          <div className='setup'>
            <div className='color-collection'>
              <label htmlFor="color-collection">Add color:</label>
              <input
                type="text"
                name='color-collection'
                id='color-collection'
                value={collection.color}
                onChange={handleColorChanged}
              />

              <button
                className='secondary-button'
                onClick={handleResetColor}
                data-tooltip
              >
                <span className='icon-reset' />
                <DescriptionTooltip text='Reset color' tipPosition='bottom' />
              </button>
            </div>

            <div className='error-message'>{errorMessage}</div>

            <div className='buttons'>
              <button className='secondary-button' data-tooltip>
                <span className='icon-heart' />
                <DescriptionTooltip text='Save' tipPosition='bottom' />
              </button>

              <button className='secondary-button' data-tooltip>
                <span className='icon-upload' />
                <DescriptionTooltip text='Upload Icons' tipPosition='bottom' />
                <input
                  type="file"
                  accept=".svg"
                  ref={inputRef}
                  multiple
                  onChange={handleFileChange}
                  data-tooltip
                />
              </button>

              <button className='secondary-button' data-tooltip>
                <span className='icon-download' />
                <DescriptionTooltip text='Download fonts' tipPosition='bottom' />
              </button>
            </div>
          </div>

          <div className='icons-container'>
            { collection.icons.map(svg => (
              <Icon
                key={svg.id}
                svg={svg}
                setCollection={setCollection}
                setErrorMessage={setErrorMessage}
              />
            ))}
          </div>
        </section>

        <section className='palette-icons'>
          <h2 className='subtitle'>Palette Icons</h2>
          <div className='icons-container'>
            { svgs.map(svg => (
                <div className='icon' key={`palette-${svg.name}`}>
                  <div
                    className='icon__svg'
                    dangerouslySetInnerHTML={{ __html: svg.content }}
                  />
                  <button className='icon__button' onClick={() => handleAddIcon(svg)}>
                    Add
                    <span className='icon-plus'/>
                  </button>
                </div>
              ))
            }
          </div>
        </section>
      </main>

    </div>
  )
}
