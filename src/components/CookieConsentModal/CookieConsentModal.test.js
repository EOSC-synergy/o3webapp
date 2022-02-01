import React from 'react';
import CookieConsentModal from './CookieConsentModal';
import { render } from '@testing-library/react';

describe('test CookieConsentModal component rendering', () => {

    it('renders without crashing', () => {
        render(<CookieConsentModal isOpen={true} onClose={jest.fn()} />);
    });

    it('renders as expected', () => {
        const { baseElement } = render(<CookieConsentModal isOpen={true} onClose={jest.fn()} />);
        expect(baseElement).toMatchSnapshot();
    });

});