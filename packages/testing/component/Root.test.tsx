import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Root from '@supaviteexpress/client/src/routes/Root';

describe('App', () => {
  it('renders the App component', () => {
    render(<Root />);
    expect(screen.getByText('Hi')).toBeDefined();
    screen.debug(); // prints out the jsx in the App component unto the command line
  })
})