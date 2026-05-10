import React from 'react'
import { render, screen } from '@testing-library/react'
import AboutPage from '../pages/about'

test('AboutPage renders emblem and description', () => {
  render(<AboutPage />)
  expect(screen.getByAltText('App Emblem')).toBeInTheDocument()
  expect(screen.getByText(/discussion board application/)).toBeInTheDocument()
})
