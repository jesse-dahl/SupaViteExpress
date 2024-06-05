import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Root from '@supaviteexpress/client/src/routes/Root';

describe('Root', () => {
  it('renders the Root component', () => {
    render(<Root />);
    expect(screen.getByText('Hi')).toBeDefined();
    screen.debug(); // prints out the jsx in the Root component unto the command line
  })
})