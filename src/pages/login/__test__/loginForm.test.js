import { render } from '@testing-library/react'
import LoginPage from '../LoginPage'

describe('test suite', () => {
  it('renders the login form', () => {
    const { getByRole } = render(<LoginPage />)
    const button = getByRole('button')
    expect(button).toBeVisible()
  })
})
