import { ReactNode, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, Over, UniqueIdentifier, closestCorners, useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { vs2015, darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import { useCheckSavedGradient } from '../hooks/useCheckSavedGradient'
import { useTooltip } from '../hooks/useTooltip'
import { useSave } from '../hooks/useSave'
import { useCheckSavedGradientAnimation } from '../hooks/useCheckSavedGradientAnimation'

import { getStops } from '../utils/getStops'
import { makeGradientCalculus } from '../utils/makeGradientCalculus'

import { ColorPicker, PickerColor } from '../components/picker/ColorPicker'
import { Select } from '../components/Select'
import { AngleInput } from '../components/gradient/AngleInput'
import { CustomRange } from '../components/gradient/CustomRange'
import Tooltip from '../components/tooltips/Tooltip'

import '../styles/Gradient.css'

export interface Color {
  color: string
  id: number
}
export interface GradientColor {
  colors: Color[]
  stops: number[],
}

interface GradientColors {
  firstRow?: GradientColor[]
  secondRow?: GradientColor[]
}

function findIdInColors(id: string, colors: Color[]): number {
  let colorIndex = -1
  colors.forEach((color, index) => {
    if (color.id === +id) colorIndex = index
  })

  return colorIndex
}

export interface GradientType {
  type: string
  angle: number
  firstRow?: GradientColor
  secondRow?: GradientColor
  activeId?: Color
}

export interface GradientStyles {
  firstRow: string[]
  secondRow: string[]
  animationType: string
  animationTiming: string
  animationDuration: number
}

const timingSelect = {
  linear: null,
  ease: null,
  'ease-in': null,
  'ease-out': null,
  'ease-in-out': null
}

export const Gradient = () => {
  const [gradient, setGradient] = useState<GradientType>({
    type: 'horizontal',
    angle: 90,
    firstRow: {
      colors: [
        { id: 2, color: '#00ad96' },
        { id: 0, color: '#0051ad' },
        { id: 1, color: '#2300ad' }
      ],
      stops: [0, 50, 100]
    }
  })
  const [gradientStyle, setGradientStyle] = useState<GradientStyles>({
    firstRow: [],
    secondRow: ['linear-gradient(90deg',''],
    animationType: 'horizontal',
    animationTiming: 'linear',
    animationDuration: 5
  })

  const [openPicker, setOpenPicker] = useState<boolean>(false)
  const [mode, setMode] = useState<string>('gradient')
  const [codeTech, setCodeTech] = useState('css')
  
  const { id } = useParams()
  const [name, setName] = useState(id)
  const [isSavedGradient, savedIdGradient] = useCheckSavedGradient(name as string)
  const [isSavedGradientAnimation, savedIdGradientAnimation] = useCheckSavedGradientAnimation(name as string)

  const [tooltipMessage, setTooltipMessage] = useTooltip()
  const likeHandler = useSave(setTooltipMessage, { new: true })

  // Update gradient when type changed
  useEffect(() => {
    const type = gradient.type
    let newFirstRow = gradient.firstRow
    let newSecondRow = gradient.secondRow
    
    if (
      (type === 'vertical' || type === 'horizontal' || type === 'circle')
      && newFirstRow && newSecondRow
    ) {
      const newColors = [ ...newFirstRow.colors, ...newSecondRow.colors as Color[] ]
      const newStops = getStops(100 / (newColors.length - 1))

      newFirstRow = { colors: newColors, stops: newStops }
      newSecondRow = undefined
    } else
    if (type === 'grid' && newFirstRow && !newSecondRow){
      const middleIndex = Math.ceil(newFirstRow.colors.length / 2)

      const newFirstColors = [...newFirstRow.colors]
      const newSecondColors = newFirstColors.splice(middleIndex)

      const newStopsFirstRow = getStops(100 / (newFirstColors.length - 1))
      const newStopsSecondRow = getStops(100 / (newSecondColors.length - 1))

      newFirstRow = { colors: newFirstColors, stops: newStopsFirstRow }
      newSecondRow = { colors: newSecondColors, stops: newStopsSecondRow }
    }

    const newAngle = type === 'vertical' ? 180 : 90
    const newGradient = type === 'circle' ? 'radial-gradient(circle' : `linear-gradient(${newAngle}deg`

    setGradient({
      type: type,
      angle: newAngle,
      firstRow: newFirstRow,
      secondRow: newSecondRow
    })

    setGradientStyle(prev => {
      const newFirstRowStyle = [...prev.firstRow]
      newFirstRowStyle[0] = newGradient
      newFirstRowStyle[1] = newFirstRow ? makeGradientCalculus(newFirstRow): ''

      const newSecondRowStyle = [...prev.secondRow]
      if (type === 'grid') {
        newSecondRowStyle[1] = newSecondRow ? makeGradientCalculus(newSecondRow): ''
      }

      return {
        ...prev,
        firstRow: newFirstRowStyle,
        secondRow: newSecondRowStyle
      }
    })

    gradientToUrl({
      type: type,
      angle: newAngle,
      firstRow: newFirstRow,
      secondRow: newSecondRow
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradient.type])

  useEffect(() => {
    if (gradient.firstRow) {
      setGradientStyle(prev => {
        const newGradient = [...prev.firstRow]
        newGradient[1] = makeGradientCalculus(gradient.firstRow as GradientColor)

        return {
          ...prev, firstRow: newGradient
        }
      })

      if (gradient.type === 'grid') {
        setGradientStyle(prev => {
          const newGradient = [...prev.secondRow]
          newGradient[1] = makeGradientCalculus(gradient.secondRow as GradientColor)
  
          return {
            ...prev, secondRow: newGradient
          }
        })
      }
  
      if (openPicker && gradient.activeId) {
        const isOnFirstRow = findIdInColors(`${gradient.activeId.id}`, gradient.firstRow.colors)
        const isOnSecondRow = gradient.secondRow ? findIdInColors(`${gradient.activeId.id}`, gradient.secondRow?.colors as Color[]) : -1
  
        const activeColor = gradient.firstRow.colors[isOnFirstRow] || gradient.secondRow?.colors[isOnSecondRow]
  
        if (activeColor.color !== gradient.activeId.color) {
          setGradient(prev => ({
            ...prev,
            activeId: {
              id: gradient.activeId?.id as number,
              color: activeColor.color
            }
          }))
        }
      }
  
      gradientToUrl(gradient)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradient.firstRow, gradient.secondRow])

  useEffect(() => {
    if (gradient.type === 'horizontal' || gradient.type === 'vertical') {
      setGradientStyle(prev => {
        const newGradient = [...prev.firstRow]
        newGradient[0] = `linear-gradient(${gradient.angle}deg`

        return {
          ...prev,
          firstRow: newGradient
        }
      })
    }

    gradientToUrl(gradient)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradient.angle])

  // Set gradient by url
  useEffect(() => {
    const urlParams = new URLSearchParams(id)

    if (!urlParams.get('t') && !urlParams.get('a') && !urlParams.get('r1')) {
      gradientToUrl({
        type: gradient.type,
        angle: gradient.angle,
        firstRow: gradient.firstRow
      })
    } else {

      const newType = urlParams.get('t')
      const newAngle = urlParams.get('a')
      const newFirstRow: GradientColor = {
        colors: [],
        stops: []
      }

      urlParams.get('r1')?.split('_').forEach(color => {
        const obj = color.split('-')

        newFirstRow.colors.push({
          id: Math.floor(Math.random() * (1000 - 1 + 1)) + 1,
          color: `#${obj[0]}`
        })
        newFirstRow.stops.push(+obj[1])
      })

      const newDGradient: GradientType = {
        type: gradient.type,
        angle: gradient.angle
      }

      newDGradient.firstRow = newFirstRow

      if (newType !== null) {
        newDGradient.type = newType
      }
      if (newAngle !== null) {
        newDGradient.angle = +newAngle
      }

      if (urlParams.get('r2') && newType === 'grid') {
        const newSecondRow: GradientColor = {
          colors: [],
          stops: []
        }

        urlParams.get('r2')?.split('_').forEach(color => {
          const obj = color.split('-')

          newSecondRow.colors.push({
            id: Math.floor(Math.random() * (1000 - 1 + 1)) + 1,
            color: `#${obj[0]}`
          })
          newSecondRow.stops.push(+obj[1])
        })

        newDGradient.secondRow = newSecondRow
      }

      setGradient(newDGradient)

      const newAnimationDuration = urlParams.get('ad')
      const newAnimationTiming = urlParams.get('ati')
      const newAnimationType = urlParams.get('aty')

      if (newAnimationDuration && newAnimationTiming && newAnimationType) {
        
        setGradientStyle(prev => ({
          ...prev,
          animationDuration: +newAnimationDuration,
          animationTiming: newAnimationTiming,
          animationType: newAnimationType
        }))
        setMode('animation')
      }
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (mode === 'animation') {
      gradientToUrl(gradient, gradientStyle)
    } else {
      gradientToUrl(gradient)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, gradientStyle.animationDuration, gradientStyle.animationTiming, gradientStyle.animationType])

  const gradientToUrl = (
    {type, angle, firstRow, secondRow }: GradientType,
    animationStyles?: GradientStyles
  ) => {
    let newType = ''
    let newAngle = ''
    let newRow1 = 'r1='
    let newRow2 = ''

    let newAnimationDuration = ''
    let newAnimationTiming = ''
    let newAnimationType = ''

    if (
      (type === 'horizontal' && angle === 90) ||
      (type === 'vertical' && angle === 180) ||
      type === 'grid' || type === 'circle'
    ) {
      newType = `t=${type}&`
    }

    if (
      (type === 'horizontal' && angle !== 90) ||
      (type === 'vertical' && angle !== 180)
    ) {
      newAngle = `a=${angle}&`
    }

    firstRow?.colors.forEach((color, index) => {
      newRow1 += `${color.color.substring(1)}-${firstRow?.stops[index]}_`
    })
    newRow1 = newRow1.slice(0, -1)

    if (secondRow) {
      newRow2 = '&r2='
      secondRow.colors.forEach((color, index) => {
        newRow2 += `${color.color.substring(1)}-${secondRow?.stops[index]}_`
      })
      newRow2 = newRow2.slice(0, -1)
    }

    if (animationStyles) {
      newAnimationDuration = `&ad=${animationStyles.animationDuration}`
      newAnimationTiming = `&ati=${animationStyles.animationTiming}`
      newAnimationType = `&aty=${animationStyles.animationType}`
    }

    const newUrl = '/gradient/' + newType + newAngle + newRow1 + newRow2 + newAnimationDuration + newAnimationTiming + newAnimationType

    setName(newType + newAngle + newRow1 + newRow2 + newAnimationDuration + newAnimationTiming + newAnimationType)

    window.history.replaceState({}, '', newUrl)

    return newUrl
  }

  const handleDragStart = (e: DragStartEvent) => {
    const { active } = e
    const { id } = active

    if (gradient.firstRow) {
      const isOnFirstRow = findIdInColors(id as string, gradient.firstRow.colors)
      const isOnSecondRow = gradient.secondRow ? findIdInColors(id as string, gradient.secondRow?.colors as Color[]) : -1
  
      const activeColor = gradient.firstRow.colors[isOnFirstRow] || gradient.secondRow?.colors[isOnSecondRow]
  
      setGradient(prev => ({ ...prev, activeId: activeColor }))
    }
  }

  const findContainer = (id: UniqueIdentifier) => {
    if (id === 'firsRow' || id === 'secondRow') return id

    if (gradient.firstRow && findIdInColors(id as string, gradient.firstRow.colors) !== -1) return 'firstRow'

    if (gradient.secondRow && findIdInColors(id as string, gradient.secondRow.colors) !== -1) return 'secondRow'
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    const { id } = active
    const { id: overId } = over as Over

    // Find the containers
    const activeContainer = findContainer(id) as keyof GradientColors
    const overContainer = findContainer(overId) as keyof GradientColors

    if (
      !activeContainer ||
      !overContainer
    ) {
      return
    }

    setGradient(prev => {
      const activeIndex = findIdInColors(id as string, prev[activeContainer]?.colors as Color[])
      const overIndex = findIdInColors(overId as string, prev[overContainer]?.colors as Color[])

      const activeColor = prev[activeContainer]?.colors.splice(activeIndex as number, 1)[0] as Color

      prev[overContainer]?.colors.splice(overIndex, 0, activeColor)

      return {
        ...prev,
        [overContainer]: {
          ...prev[overContainer],
          stops: getStops(100 / (prev[overContainer]?.colors.length as number - 1))
        }
      }
    })
  }

  const updateColor = (color: PickerColor) => {
    if (gradient.firstRow) {
      const isOnFirstRow = findIdInColors(color.id as string, gradient.firstRow.colors)
      const isOnSecondRow = gradient.secondRow ? findIdInColors(color.id as string, gradient.secondRow?.colors as Color[]) : -1
  
      if (isOnFirstRow !== -1) {
        setGradient(prev => {
          const newColors = [...prev.firstRow?.colors as Color[]]
          newColors[isOnFirstRow] = {
            id: +color.id,
            color: color.formats.hex as string
          }
          return {
            ...prev,
            firstRow: {
              colors: newColors,
              stops: prev.firstRow?.stops as number[]
            }
          }
        })
      } else if (isOnSecondRow !== -1) {
        setGradient(prev => {
          const newColors = [...prev.secondRow?.colors as Color[]]
          newColors[isOnSecondRow] = {
            id: +color.id,
            color: color.formats.hex as string
          }
          return {
            ...prev,
            secondRow: {
              colors: newColors,
              stops: prev.secondRow?.stops as number[]
            }
          }
        })
      }
    }
  }

  const handleRemoveColor = () => {
    if (gradient.activeId && gradient.firstRow) {
      const isOnFirstRow = findIdInColors(`${gradient.activeId.id}`, gradient.firstRow.colors)
      const isOnSecondRow = gradient.secondRow ? findIdInColors(`${gradient.activeId.id}`, gradient.secondRow?.colors as Color[]) : -1

      if (isOnFirstRow !== -1) {
        setGradient(prev => {
          const newRow = { ...prev.firstRow } as GradientColor
          newRow.colors.splice(isOnFirstRow, 1)
          newRow.stops.splice(isOnFirstRow, 1)

          return { ...prev, firstRow: newRow }
        })
      } else if (isOnSecondRow !== -1) {
        setGradient(prev => {
          const newRow = { ...prev.secondRow } as GradientColor
          newRow.colors.splice(isOnSecondRow, 1)
          newRow.stops.splice(isOnSecondRow, 1)

          return { ...prev, secondRow: newRow }
        })
      }
    }

    setGradient(prev => ({ ...prev, activeId: undefined }))
  }

  const handleAddColor = (row: string) => {
    if (row === 'first') {
      setGradient(prev => ({
        ...prev,
        firstRow: {
          colors: [
            ...prev.firstRow?.colors as Color[],
            {
              id: Math.floor(Math.random() * (1000 - 1 + 1)) + 1,
              color: '#ffffff'
            }
          ],
          stops: getStops(100 / (prev.firstRow?.colors.length as number))
        }
      }))
    } else if (row === 'second') {
      setGradient(prev => ({
        ...prev,
        secondRow: {
          colors: [
            ...prev.secondRow?.colors as Color[],
            {
              id: Math.floor(Math.random() * (1000 - 1 + 1)) + 1,
              color: '#ffffff'
            }
          ],
          stops: getStops(100 / (prev.secondRow?.colors.length as number))
        }
      }))
    }
  }

  const handleClosePicker = () => {
    setOpenPicker(false)
  }

  const setTiming = (timing: string) => {
    setGradientStyle(prev => ({ ...prev, animationTiming: timing }))
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGradientStyle(prev => ({ ...prev, animationDuration: +e.target.value }))
  }

  const animation = mode === 'animation'
    ? `${gradientStyle.animationType} ${gradientStyle.animationDuration}s ${gradientStyle.animationTiming} infinite`
    : ''

  let backgroundSize = '100% 100%'
  if (mode === 'animation') {
    if (gradient.firstRow) {
      let number = gradient.firstRow.colors.length
      if (gradient.secondRow) {
        number = gradient.firstRow.colors.length > gradient.secondRow.colors.length
          ? gradient.firstRow.colors.length : gradient.secondRow.colors.length
      }
      if (gradientStyle.animationType === 'horizontal' || gradientStyle.animationType === 'vertical') {
        backgroundSize = `${number * 100 * 2}% ${number * 100 * 2}%`
      } else if (gradientStyle.animationType === 'spin') {
        backgroundSize = '100% 100%'
      }
    }
  }

  const cssCode = `
  ${mode === 'animation' && gradient.type === 'grid' && gradientStyle.animationType === 'spin' ?
  `.my-object {
    width: 300px;
    height: 300px;
    display: grid;
    align-items: center;
    justify-items: center;
    overflow: hidden;
  }`
  : ''
  }
  .${ mode === 'animation' && gradient.type === 'grid' && gradientStyle.animationType === 'spin' ? 'gradient' : 'my-object'} {
    width: ${mode === 'animation' && gradientStyle.animationType === 'spin' ? '155%' : '300px'};
    height: ${mode === 'animation' && gradientStyle.animationType === 'spin' ? '155%' : '300px'};
    background: ${gradientStyle.firstRow[0]}${gradientStyle.firstRow[1]});
    background: -o-${gradientStyle.firstRow[0]}${gradientStyle.firstRow[1]});
    background: -ms-${gradientStyle.firstRow[0]}${gradientStyle.firstRow[1]});
    background: -moz-${gradientStyle.firstRow[0]}${gradientStyle.firstRow[1]});
    background-size: ${backgroundSize};
    ${ gradient.type === 'grid' ? 'position: relative;' : ''}
    ${mode === 'animation' ? `animation: ${animation};` : ''}
  }
  ${ gradient.type === 'grid' ?
    `.${ mode === 'animation' && gradient.type === 'grid' && gradientStyle.animationType === 'spin' ? 'gradient' : 'my-object'}::after {
    content: "";
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;

    mask-image: linear-gradient(to bottom, transparent 50%, black);
    -webkit-mask-image: linear-gradient(to bottom, transparent 30%, black);

    background: ${gradientStyle.secondRow[0]}${gradientStyle.secondRow[1]});
    background: -o-${gradientStyle.secondRow[0]}${gradientStyle.secondRow[1]});
    background: -ms-${gradientStyle.secondRow[0]}${gradientStyle.secondRow[1]});
    background: -moz-${gradientStyle.secondRow[0]}${gradientStyle.secondRow[1]});
    background-size: ${backgroundSize};
    ${mode === 'animation' ? `animation: ${animation};` : ''}
  }`
    : ''
  }
  ${ mode === 'animation' && gradientStyle.animationType === 'horizontal' ?
    `@keyframes horizontal {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }
  @-o-keyframes horizontal {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }
  @-moz-keyframes horizontal {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }
  @-webkit-keyframes horizontal {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }`
    : ''
  }
  ${ mode === 'animation' && gradientStyle.animationType === 'vertical' ?
    `@keyframes vertical {
    0% { background-position: 50% 0% }
    50% { background-position: 50% 100% }
    100% { background-position: 50% 0% }
  }
  @-o-keyframes vertical {
    0% { background-position: 50% 0% }
    50% { background-position: 50% 100% }
    100% { background-position: 50% 0% }
  }
  @-moz-keyframes vertical {
    0% { background-position: 50% 0% }
    50% { background-position: 50% 100% }
    100% { background-position: 50% 0% }
  }
  @-webkit-keyframes vertical {
    0% { background-position: 50% 0% }
    50% { background-position: 50% 100% }
    100% { background-position: 50% 0% }
  }`
    : ''
  }
  ${ mode === 'animation' && gradientStyle.animationType === 'spin' ?
    `@keyframes spin {
    0% { transform: rotate(0deg) }
    50% { transform: rotate(180deg) }
    100% { transform: rotate(360deg) }
  }
  @-o-keyframes spin {
    0% { transform: rotate(0deg) }
    50% { transform: rotate(180deg) }
    100% { transform: rotate(360deg) }
  }
  @-moz-keyframes spin {
    0% { transform: rotate(0deg) }
    50% { transform: rotate(180deg) }
    100% { transform: rotate(360deg) }
  }
  @-webkit-keyframes spin {
    0% { transform: rotate(0deg) }
    50% { transform: rotate(180deg) }
    100% { transform: rotate(360deg) }
  }`
    : ''
  }
  `

  const htmlCode = `
  <div class="my-object">
    ${ mode === 'animation' && gradient.type === 'grid' && gradientStyle.animationType === 'spin'
      ?
    `<div class="gradient">
    </div>`
      : ''
    }
  </div>
  `
  return (
    <>
      <div className='gradient'>
        <div className='generator'>
          { openPicker && gradient.activeId &&
            <ColorPicker
              id={`${gradient.activeId.id}`}
              color={gradient.activeId.color}
              updateColor={updateColor}
              handleClosePicker={handleClosePicker}
            />
          }
          <section className='setup'>
            { mode === 'gradient' &&
              <>
                <div className='setup__head'>
                  <ul className='types'>
                    <li>
                      <button
                        className={`
                          type
                          ${gradient.type === 'horizontal'
                            ? 'type--active'
                            : ''
                          }
                        `}
                        onClick={() => setGradient(prev => ({ ...prev, type: 'horizontal' }))}
                      >
                        <span className='type__icon icon-gradient-horizontal'/>

                        <span className='type__name'>
                          Horizontal
                        </span>
                      </button>
                    </li>

                    <li>
                      <button
                        className={`
                          type
                          ${gradient.type === 'vertical'
                            ? 'type--active'
                            : ''
                          }
                        `}
                        onClick={() => setGradient(prev => ({ ...prev, type: 'vertical' }))}
                      >
                        <span className='type__icon icon-gradient-vertical'/>

                        <span className='type__name'>
                          Vertical
                        </span>
                      </button>
                    </li>

                    <li>
                      <button
                        className={`
                          type
                          ${gradient.type === 'grid'
                            ? 'type--active'
                            : ''
                          }
                        `}
                        onClick={() => setGradient(prev => ({ ...prev, type: 'grid' }))}
                      >
                        <span className='type__icon icon-gradient-grid'/>

                        <span className='type__name'>
                          Grid
                        </span>
                      </button>
                    </li>

                    <li>
                      <button
                        className={`
                          type
                          ${gradient.type === 'circle'
                            ? 'type--active'
                            : ''
                          }
                        `}
                        onClick={() => setGradient(prev => ({ ...prev, type: 'circle' }))}
                      >
                        <span className='type__icon icon-gradient-circle'/>

                        <span className='type__name'>
                          Circle
                        </span>
                      </button>
                    </li>
                  </ul>

                  <AngleInput angle={gradient.angle} setGradient={setGradient} />
                </div>

                <div className='edit'>
                  <div
                    className='row-color edit__current'
                    style={{
                      background: gradient.activeId?.color
                    }}
                  ></div>

                  <button
                    className='secondary-button'
                    onClick={() => setOpenPicker(true)}
                  >Edit</button>

                  <button
                    className='secondary-button'
                    onClick={handleRemoveColor}
                  >Remove</button>
                </div>

                <DndContext
                  collisionDetection={closestCorners}
                  onDragEnd={handleDragEnd}
                  onDragStart={handleDragStart}
                >
                  <div className='re-order'>
                    { gradient.firstRow &&
                      <Container
                        items={gradient.firstRow.colors as Color[]}
                        id='firstRow'
                      >
                        <>
                          { gradient.firstRow.colors.map(color => (
                            <>
                              <Color
                                color={color}
                              />
                            </>
                          ))}

                          { !gradient.secondRow &&
                            <button
                              className='row__color row__color--add'
                              onClick={() => handleAddColor('first')}
                            >
                              <span className='icon-plus'/>
                            </button>
                          }
                        </>
                      </Container>
                    }

                    { gradient.secondRow &&
                      <Container
                        items={gradient.secondRow.colors}
                        id='secondRow'
                      >
                        <>
                          { gradient.secondRow.colors.map(color => (
                            <Color
                              color={color}
                            />
                          ))}

                          <button
                            className='row__color row__color--add'
                            onClick={() => handleAddColor('second')}
                          >
                            <span className='icon-plus'/>
                          </button>
                        </>
                      </Container>
                    }
                    <DragOverlay>{gradient.activeId ? <Color color={gradient.activeId} /> : null}</DragOverlay>
                  </div>
                </DndContext>
              </>
            }

            { mode === 'animation' &&
              <>
                <div className='setup__head'>
                  <ul className='types'>
                    <li>
                      <button
                        className={`
                          type
                          ${gradientStyle.animationType === 'horizontal'
                            ? 'type--active'
                            : ''
                          }
                        `}
                        onClick={() => setGradientStyle(prev => ({ ...prev, animationType: 'horizontal' }))}
                      >
                        <span className='type__icon icon-move'/>

                        <span className='type__name'>
                          Horizontal
                        </span>
                      </button>
                    </li>

                    <li>
                      <button
                        className={`
                          type
                          ${gradientStyle.animationType === 'vertical'
                            ? 'type--active'
                            : ''
                          }
                        `}
                        onClick={() => setGradientStyle(prev => ({ ...prev, animationType: 'vertical' }))}
                        disabled={gradient.type === 'grid'}
                      >
                        <span className='type__icon icon-vertical'/>

                        <span className='type__name'>
                          Vertical
                        </span>
                      </button>
                    </li>

                    <li>
                      <button
                        className={`
                          type
                          ${gradientStyle.animationType === 'spin'
                            ? 'type--active'
                            : ''
                          }
                        `}
                        onClick={() => setGradientStyle(prev => ({ ...prev, animationType: 'spin' }))}
                        disabled={gradient.type === 'circle'}
                      >
                        <span className='type__icon icon-spin'/>

                        <span className='type__name'>
                          Spin
                        </span>
                      </button>
                    </li>
                  </ul>

                  <div className='timing'>
                    <p className='timing__label'>Timing Function</p>
                    <Select
                      options={timingSelect}
                      value={gradientStyle.animationTiming}
                      setValue={setTiming as React.Dispatch<React.SetStateAction<string>>}
                      configuration={{
                        showIcon: false,
                        showCurrentValue: true
                      }}
                    />
                  </div>
                </div>

                <div className='speed'>
                  <p className='speed__value'>1s</p>
                    <input
                      className='speed__input'
                      type='range'
                      min={1}
                      max={100}
                      value={gradientStyle.animationDuration}
                      onChange={handleDurationChange}
                    />
                  <p className='speed__value'>100s</p>
                </div>
              </>
            }

            <div className='mode'>
              <button
                onClick={() => setMode('gradient')}
                className={`primary-button ${mode === 'gradient' ? 'primary-button--active' : ''}`}
              >Gradient</button>

              <button
                onClick={() => setMode('animation')}
                className={`primary-button ${mode === 'animation' ? 'primary-button--active' : ''}`}
              >Animation</button>

              { mode === 'gradient' &&
                <button
                  onClick={likeHandler}
                  className={`
                    secondary-button
                    gradient-like
                    ${ isSavedGradient ? 'secondary-button--active' : ''}
                  `}
                  data-name={name}
                  data-saved={isSavedGradient}
                  data-id={savedIdGradient}
                >
                  { isSavedGradient ? 'Unsave' : 'Save'}
                </button>
              }

              { mode === 'animation' &&
                <button
                  onClick={likeHandler}
                  className={`
                    secondary-button
                    gradient-animation-like
                    ${ isSavedGradientAnimation ? 'secondary-button--active' : ''}
                  `}
                  data-name={name}
                  data-saved={isSavedGradientAnimation}
                  data-id={savedIdGradientAnimation}
                >
                  { isSavedGradientAnimation ? 'Unsave' : 'Save'}
                </button>
              }
            </div>
          </section>

          <section className='gradient__view'>

            <div
              className={`view`}
            >
              <div
                className={`view__canvas ${gradient.type === 'grid' ? 'view__canvas--grid' : ''}`}
                style={{
                  width: mode === 'animation' && gradientStyle.animationType === 'spin'
                  ? '155%' : '100%',
                  height: mode === 'animation' && gradientStyle.animationType === 'spin'
                  ? '155%' : '100%',
                  '--d-background': gradientStyle.firstRow.length !== 0 ? gradientStyle.firstRow[0] + gradientStyle.firstRow[1] : '',
                  '--grid-background': gradientStyle.secondRow[0] + gradientStyle.secondRow[1] + ')',
                  animation: animation,
                  '--my-animation': animation,
                  '--my-backsize': backgroundSize,
                } as React.CSSProperties}
              ></div>
            </div>

            <div className='slider'>
              { gradient.firstRow &&
                <CustomRange
                  row={gradient.firstRow}
                  rowName='firstRow'
                  setGradient={setGradient}
                  background={gradientStyle.firstRow}
                />
              }

              { gradient.secondRow && 
                <CustomRange
                  row={gradient.secondRow}
                  rowName='secondRow'
                  setGradient={setGradient}
                  background={gradientStyle.secondRow}
                />
              }
            </div>
          </section>
        </div>

        <section className='css'>
          <div className='css__code'>
            <button
              className={`
                primary-button
                ${codeTech === 'css' ? 'primary-button--active' : ''}
              `}
              onClick={() => setCodeTech('css')}
            >
              <span>
                CSS
              </span>
            </button>
            <button
              className={`
                primary-button
                ${codeTech === 'html' ? 'primary-button--active' : ''}
              `}
              onClick={() => setCodeTech('html')}
            >
              <span>
                HTML
              </span>
            </button>
          </div>

          { codeTech === 'css' &&
            <SyntaxHighlighter
              language='css'
              style={vs2015}
              customStyle={{
                width: '100%',
                height: '250px',
                minHeight: '250px',
                padding: '10px 14px 0px',
                borderRadius: '14px',
                background: '#1E2029',
                fontSize: '1.4rem',
                overflowX: 'auto',
                overflowY: 'auto'
              }}
            >
              {cssCode}
            </SyntaxHighlighter>
          }

          { codeTech === 'html' &&
            <SyntaxHighlighter
              language='html'
              style={darcula}
              customStyle={{
                width: '100%',
                height: '250px',
                minHeight: '250px',
                padding: '10px 14px 0px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                background: '#1E2029',
                fontSize: '1.4rem',
                overflowX: 'auto',
                overflowY: 'auto'
              }}
            >
              {htmlCode}
            </SyntaxHighlighter>
          }
        </section>
      </div>
      <Tooltip message={tooltipMessage} />
    </>
  )
}

interface ColorProps {
  color: Color
}

export const Color = ({ color }: ColorProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
  } = useSortable({ id: color.id })

  return (
    <div
      className='row__color'
      id={`${color.id}`}
      key={color.id}
      style={{  background: color.color }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
    </div>
  )
}

interface ContainerProps {
  items: Color[]
  id: string,
  children: ReactNode
}

const Container = ({ items, id, children }: ContainerProps) => {
  const { setNodeRef } = useDroppable({ id })

  return (
    <SortableContext
      id={id}
      items={items}
      strategy={rectSortingStrategy}
    >
      <div
        className='row'
        ref={setNodeRef}
      >
        { children }
      </div>
    </SortableContext>
  )
}