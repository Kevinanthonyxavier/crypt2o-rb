import React from 'react'

interface CheckboxProps {
  id: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

const Checkbox: React.FC<CheckboxProps> = ({ id, checked, onCheckedChange }) => {
  return (
    <label htmlFor={id} className="flex items-center space-x-2 cursor-pointer">
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring focus:ring-purple-500"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      <span className="text-white text-sm">Remember Me</span>
    </label>
  )
}

export default Checkbox
