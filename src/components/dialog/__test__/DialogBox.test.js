import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import DialogBox from '../DialogBox'

/* 
Test Block
1. render a component that we want to test - render()
2. find elements we want to interact with. - screen.getByText()
3. Interact with those elements. 
4. Assert the results are as expected - expect()
*/

it('should render the same text passed as prop.', () => {
	render(<DialogBox formLabel="Update Team" open={true} />)

	const headingText = screen.getByText(/update team/i)
	expect(headingText).toBeInTheDocument()
})

it('should render the same text passed as prop as a heading.', () => {
	render(<DialogBox formLabel="Update Team" open={true} />)

	const headingRole = screen.getByRole('heading', { name: 'Update Team' })
	expect(headingRole).toBeInTheDocument()
})
