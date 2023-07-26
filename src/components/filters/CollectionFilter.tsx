import { useEffect, useState } from 'react'
import { Options, Select } from '../Select'

const shapesSelect = {
  horizontal: 'icon-rectangle-h',
  vertical: 'icon-rectangle-v',
  circle: 'icon-circle'
}

interface CollectionFilterProps {
  options: {
    shape?: boolean
    quantity?: boolean
    quantityOptions?: Options
  }
}

export const useFilter = ({ options }: CollectionFilterProps): {
  shape: string, quantity: string, CollectionFilter: React.ElementType
} => {
  const [shape, setShape] = useState(localStorage.getItem('shape-filter') ||'horizontal')
  const [quantity, setQuantity] = useState('all')

  useEffect(() => {
    localStorage.setItem('shape-filter', shape)
  }, [shape])
  
  const component = () =>
    <ul className='config'>
      { options.shape && 
        <li className='config__item'>
          <Select
            options={shapesSelect}
            value={shape}
            setValue={setShape}
            configuration={{
              showCurrentValue: true,
              showIcon: true
            }}
          />
        </li>
      }

      { options.quantity && options.quantityOptions &&
        <li className='config__item'>
          <Select
            options={{ ...options.quantityOptions, all: null }}
            value={quantity}
            setValue={setQuantity}
            configuration={{
              showCurrentValue: true,
              showIcon: true
            }}
            additionalIcon='icon-hash'
          />
        </li>
      }

    </ul>

  return { shape, quantity, CollectionFilter: component }
}
