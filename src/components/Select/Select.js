import React from 'react'
import { Select } from 'react-materialize'

export default function SelectOption({onChange, limit}) {
  
	return(
    <Select onChange={onChange} value={limit.toString()}>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
		</Select>
	)
}