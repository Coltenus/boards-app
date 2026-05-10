import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import InputField from '../pages/components/input_field'

test('InputField submits and clears buffer', async () => {
  const handleSubmit = jest.fn().mockResolvedValue(true)
  render(
    <InputField
      handleSubmit={handleSubmit}
      buttonBaseClass="btn"
      buttonPrimaryClass="p"
      iconButtonClass="i"
      shadow_class="s"
      border_color_class="b"
      bg_color_class="bg"
      text_color_class="t"
      send_icon={<span>send</span>}
      clear_icon={<span>clear</span>}
      box_class="box"
    />
  )

  fireEvent.change(screen.getByPlaceholderText('Enter text here'), { target: { value: 'hello' } })
  fireEvent.click(screen.getByRole('button', { name: /Submit/i }))

  await waitFor(() => expect(handleSubmit).toHaveBeenCalledWith('hello'))
  await waitFor(() => expect(screen.getByPlaceholderText('Enter text here')).toHaveValue(''))
})
