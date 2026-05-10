import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import RegisterPage from '../pages/register'

test('RegisterPage submits to API', async () => {
  ;(global as any).fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve({ success: true }) })

  render(<RegisterPage apiUrl="http://test.api" />)

  fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Alice' } })
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'a@example.com' } })
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret' } })
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'female' } })
  fireEvent.change(screen.getByPlaceholderText('Birthdate'), { target: { value: '1990-01-01' } })
  fireEvent.submit(screen.getByRole('button', { name: /Register/i }))

  await new Promise(process.nextTick)
  expect((global as any).fetch).toHaveBeenCalledWith('http://test.api/user/register', expect.any(Object))
})
