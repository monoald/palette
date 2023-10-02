import { useEffect, useRef, useState } from 'react'

import { createUUID } from '../utils/createUUID'
import { changeIconColor } from '../utils/changeIconColor'
import { checkIconModified } from '../utils/checkIconModified'

import { SvgSet, svgs } from '../data/svgs'

import { DescriptionTooltip } from '../components/tooltips/DescriptionTooltip'

import { Icon, IconCollection } from '../features/icons/iconsSlice'

import '../styles/CreateIconsCollection.css'

interface IconContainerProps {
  isEdit: boolean
  icon: IconCollection | undefined
  saveHandler: (icon: IconCollection) => void
  unsaveHandler?: () => void
  errorMessage: string
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
}

interface IconProps {
  svg: Icon
  setCollection: React.Dispatch<React.SetStateAction<IconCollection | undefined>>
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
}

export const IconContainer = ({ isEdit, icon, saveHandler, unsaveHandler, errorMessage, setErrorMessage }: IconContainerProps) => {
  const [collection, setCollection] = useState<IconCollection | undefined>(undefined)

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (icon) {
      let color = icon.color
      if (!icon.color) color = '#'

      const icons = [...icon.icons].map(ico => ({ ...ico, id: createUUID() }))

      setCollection({
        name: icon.name,
        color,
        icons: icons,
        thumbnail: ''
      })
    } else {
      setCollection({
        name: 'Untitled',
        color: '#',
        icons: [],
        thumbnail: ''
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollection(prev => ( prev ? { ...prev, name: e.target.value } : undefined))
  }

  const handleColorChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollection(prev => {
      if (prev) {
        const newIcons = [...prev.icons as Icon[]]
  
        newIcons.forEach((ico, index) => {
          const content = changeIconColor(ico.content, e.target.value as string)
  
          newIcons[index] = {
            ...ico,
            content,
            color: e.target.value
          }
        })
  
        return {
          ...prev,
          color: e.target.value,
          icons: newIcons
        }
      }
    })
  }

  const handleResetColor = () => {
    setCollection(prev => {
      if (prev) {
        const newIcons = [...prev.icons as Icon[]]
  
        newIcons.forEach((ico, index) => {
          const content = changeIconColor(ico.content, '#' as string)
  
          newIcons[index] = {
            ...ico,
            content,
            color: '#'
          }
        })
  
        return {
          ...prev,
          color: '#',
          icons: newIcons
        }
      }
    })
  }

  const handleAddIcon = (svg: Icon) => {
    setCollection(prev => {
      if (prev) {
        const newIcons = [...prev.icons]
        const newIcon: Icon = { ...svg }
  
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
      }
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        if (file.type === 'image/svg+xml') {
          const reader = new FileReader();

          reader.onload = (event: Event) => {
            if (collection) {
              const target = event.target as EventTarget & { result: string }
              const name = file.name.split('.')[0]
              const color = collection.color as string

              const content = changeIconColor(target.result, color);
  
              let warning = false
  
              let alreadyAdded = -1
              let nameUsed = -1
  
              collection.icons?.forEach((ico, index) => {
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
              setCollection(prev => ( prev ? { ...prev, icons: [...prev.icons, newIcon]} : undefined ))
            }
          }

          reader.readAsText(file);
        }
      }
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDownloadFonts = () => {
    if (collection) {
      if (icon) {
        const modified = checkIconModified(icon, collection)
  
        if (modified) saveHandler(collection)
      }
      window.location.replace(`http://localhost:3000/api/v1/icons/download-fonts/${collection.name}`)
    }
  }

  const handleDownloadIcons = () => {
    if (collection) {
      if (icon) {
        const modified = checkIconModified(icon, collection)
  
        if (modified) saveHandler(collection)
      }
      window.location.replace(`http://localhost:3000/api/v1/icons/download-icons/${collection.name}`)
    }
  }

  return (
    <div className='create-icons-collection'>
      { collection &&
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
                <button
                  className='secondary-button'
                  data-tooltip
                  onClick={() => isEdit && unsaveHandler ? unsaveHandler() : saveHandler(collection)}
                >
                  { isEdit 
                    ?
                      <>
                        <span className='icon-heart-filled' />
                        <DescriptionTooltip text='Unsave' tipPosition='bottom' />
                      </>
                    : 
                      <>
                        <span className='icon-heart' />
                        <DescriptionTooltip text='Save' tipPosition='bottom' />
                      </>
                  }
                </button>
                
                { isEdit &&
                  <button
                    className='secondary-button'
                    disabled={icon ? false : true}
                    data-tooltip
                    onClick={() => saveHandler(collection)}
                  >
                    <span className='icon-update' />
                    <DescriptionTooltip text='Save changes' tipPosition='bottom' />
                  </button>
                }

                <button className='secondary-button' data-tooltip>
                  <span className='icon-upload' />
                  <DescriptionTooltip text='Import icons' tipPosition='bottom' />
                  <input
                    type="file"
                    accept=".svg"
                    ref={inputRef}
                    multiple
                    onChange={handleFileChange}
                    data-tooltip
                  />
                </button>

                <button
                  className='secondary-button'
                  disabled={isEdit ? false : true}
                  data-tooltip
                  onClick={handleDownloadFonts}
                >
                  <span className='icon-fonts' />
                  <DescriptionTooltip text={isEdit ? 'Download fonts' : 'Save to download fonts'} tipPosition='bottom' />
                </button>

                { isEdit &&
                  <button
                    className='secondary-button'
                    data-tooltip
                    onClick={handleDownloadIcons}
                  >
                    <span className='icon-download' />
                    <DescriptionTooltip text='Download icons' tipPosition='bottom' />
                  </button>
                }
              </div>
            </div>

            <div className='icons-container'>
              { collection.icons?.map(svg => (
                <IconCard
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
              { svgs.map(svg => (
                <IconSet svg={svg} handleAddIcon={handleAddIcon} key={svg.name}/>
                ))
              }
          </section>
        </main>
      }

    </div>
  )
}

interface IconSetProps {
  svg: SvgSet
  handleAddIcon: (svg: Icon) => void
}

const IconSet = ({ svg, handleAddIcon }: IconSetProps) => {
  const [toggle, setToggle] = useState(true)
  const [itemsToShow, setItemsToShow] = useState(12)

  const handleToggle = () => {
    setToggle(!toggle)
  }

  const handleShowMoreIcons = () => {
    setItemsToShow(itemsToShow + 12)
  }

  return (
    <div className='collection-container'>
      <div className='collection-container__subtitle'>
        <h3>{svg.name}</h3>
        <button className='toggle-button' onClick={handleToggle}>
          <span className={!toggle ? 'icon-arrow-up' : 'icon-arrow-down'} />
        </button>
      </div>
      <div className={`icons-container ${!toggle ? 'icons-container--close' : ''}`}>
        { svg.icons.slice(0,itemsToShow).map(icn => (
          <div className='icon' key={`palette-${icn.name}`}>
            <img
              className='icon__svg'
              width={40}
              height={40}
              src={`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(icn.content)))}`}
            />

            <button className='icon__button' onClick={() => handleAddIcon(icn)}>
              Add
              <span className='icon-plus'/>
            </button>
          </div>
        ))}

        { itemsToShow < svg.icons.length &&
          <button
            className='showmore'
            onClick={handleShowMoreIcons}
          >
            Show more
          </button>
        }
      </div>
    </div>
  )
}

const IconCard = ({ svg, setCollection, setErrorMessage }: IconProps) => {
  const [toggleSetup, setToggleSetup] = useState(false)

  const handleNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollection(prev => {
      if (prev) {
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
      }
    })
  }

  const handleUnicodeChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollection(prev => {
      if (prev) {
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
      }
    })
  }

  const handleColorChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollection(prev => {
      if (prev) {
        const newIcons = [...prev.icons]
        const icon = newIcons.find(ico => ico.id === svg.id)
  
        if (icon) {
          icon.color = e.target.value
          const color = e.target.value
          icon.content = changeIconColor(icon.content, color)
        }
  
        return { ...prev, icons: newIcons }
      }
    })
  }

  const handleIconRemoved = () => {
    setCollection(prev => {
      if (prev) {
        const newIcons = [...prev.icons]
        const iconIndex = newIcons.findIndex(ico => ico.id === svg.id)
  
        newIcons.splice(iconIndex, 1)
  
        return { ...prev, icons: newIcons }
      }
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
      <img
        className='icon__svg'
        width={40}
        height={40}
        src={`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg.content)))}`}
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