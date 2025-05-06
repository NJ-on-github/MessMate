import React from 'react'
import { useParams } from 'react-router-dom'

const test = () => {
const { studentId } = useParams()
  return (
    <div>
        <h1>Test component</h1>
      {studentId}
    </div>
  )
}

export default test
