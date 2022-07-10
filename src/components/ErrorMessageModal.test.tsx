import React from 'react';
import ErrorMessageModal from './ErrorMessageModal';
import { render } from '@testing-library/react';

describe('test ErrorMessageModal component rendering', () => {
    it('renders without crashing', () => {
        render(<ErrorMessageModal isOpen={true} onClose={jest.fn()} message="Hello test" />);
    });

    it('renders as expected', () => {
        const { baseElement } = render(
            <ErrorMessageModal isOpen={true} onClose={jest.fn()} message="Hello test" />
        );
        expect(baseElement).toMatchSnapshot();
    });
});
