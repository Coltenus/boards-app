import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import LoginPage from '../pages/login'

test('LoginPage submits credentials and sets localStorage', async () => {
  ;(global as any).fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve({ success: true, user: { token: 'tok', name: 'Bob' } }) })
  localStorage.clear()

  render(<LoginPage apiUrl="http://test.api" />)
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'b@example.com' } })
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass' } })
  fireEvent.submit(screen.getByRole('button', { name: /Login/i }))

  await new Promise(process.nextTick)
  expect((global as any).fetch).toHaveBeenCalledWith('http://test.api/user/login', expect.any(Object))
  expect(localStorage.getItem('token')).toBe('tok')
})
