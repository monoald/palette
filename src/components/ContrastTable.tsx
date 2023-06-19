import React from 'react'
import { WCAGRequierements } from 'colors-kit'
import '../styles/Table.css'

interface ContrastTableProps {
  contrast: WCAGRequierements
}

export const ContrastTable = ({ contrast }: ContrastTableProps) => {
  return (
    <table className='Table'>
      <thead>
        <tr>
          <th>TYPE</th>
          <th>LEVEL AA</th>
          <th>LEVEL AAA</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Small Text</td>
          {contrast.AA.smallText ? <Passed /> : <Failed /> }
          {contrast.AAA.smallText ? <Passed />: <Failed />}
        </tr>
        <tr>
          <td>Large Text</td>
          {contrast.AA.largeText ? <Passed />: <Failed />}
          {contrast.AAA.largeText ? <Passed />: <Failed />}
        </tr>
        <tr>
          <td>UI Component</td>
          {contrast.AA.uiComponent ? <Passed />: <Failed />}
          {contrast.AAA.uiComponent ? <Passed />: <Failed />}
        </tr>
      </tbody>
    </table>
  )
}

const Passed = () => {
  return (
    <td>
      <span className='icon icon-rounded-check'></span>
      Pass
    </td>
  )
}

const Failed = () => {
  return (
    <td>
      <span className='icon icon-rounded-x'></span>
      Fail
    </td>
  )
}