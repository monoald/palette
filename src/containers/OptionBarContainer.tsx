import React from 'react'
import { colorBlindOptions, paletteOptions } from '../data/options'
import { OptionsAction, OptionsReducer } from '../reducers/options'
import { OptionsBar } from '../components/OptionsBar'

interface OptionBarContainerProps {
  options: OptionsReducer
  optionsDispatch: React.Dispatch<OptionsAction>
}

const OptionBarContainer = ({ options, optionsDispatch }: OptionBarContainerProps) => {
  return (
    <>
      { options.option === 'colorBlind' &&
        <OptionsBar
          objectOptions={colorBlindOptions}
          type='colorBlind'
          options={options}
          optionsDispatch={optionsDispatch}
        />
      }

      { options.option === 'paletteType' &&
        <OptionsBar
          objectOptions={paletteOptions}
          type='paletteType'
          options={options}
          optionsDispatch={optionsDispatch}
        />
      }
    </>
  )
}

export default OptionBarContainer