import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BoardField from '../pages/components/board'

const board = {
  id: 1,
  content: 'Test post',
  name: 'Alice',
  create_time: new Date().toISOString(),
  upvote_count: 0,
  downvote_count: 0,
  is_user_upvoted: false,
  is_user_downvoted: false,
  email: 'a@example.com'
}

test('BoardField renders and toggles comments', async () => {
  ;(global as any).fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve({ success: true, comments: [] }) })
  render(<BoardField board={board} apiUrl="http://test.api" fetchBoards={() => {}} token="" email="" />)

  expect(screen.getByText('Test post')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /Comments/i }))
  await waitFor(() => expect((global as any).fetch).toHaveBeenCalled())
})
