import { useState } from 'react'
import Form from 'react-bootstrap/Form'

function Select({ options = [], onChange }) {
  const [optionSelected, setOptionSelected] = useState(options[0])

  const handleChangeOption = (e) => {
    setOptionSelected(e.target.value)
    onChange(e.target.value)
  }

  return (
    <div className="my-3">
      <Form.Select
        aria-label="select"
        value={optionSelected}
        onChange={handleChangeOption}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Form.Select>
    </div>
  )
}

export default Select
