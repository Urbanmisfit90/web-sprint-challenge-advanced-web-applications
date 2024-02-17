// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Importing the matcher
import Spinner from './Spinner';

test('Spinner renders when "on" prop is true', () => {
  const { getByText } = render(<Spinner on={true} />);
  const spinnerElement = getByText('Please wait...');
  expect(spinnerElement).toBeInTheDocument();
});
