import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import ProfilePage from '../pages/profile'

test('ProfilePage displays profile data', async () => {
  const profile = { success: true, profile: { email: 'a@b.com', name: 'Alice', gender: 'female', birthdate: '1990-01-01', joined: '2020-01-01' } }
  ;(global as any).fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve(profile) })
  localStorage.setItem('email', 'a@b.com')
  localStorage.setItem('token', 'tok')

  render(<ProfilePage apiUrl="http://test.api" />)
  await waitFor(() => expect(screen.getByText('Profile')).toBeInTheDocument())
  await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument())
})
