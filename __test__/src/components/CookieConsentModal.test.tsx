import React from 'react';
import CookieConsentModal from 'components/CookieConsentModal';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('test CookieConsentModal component rendering', () => {
    it('executes the close function when agreed to cockies', () => {
        const spy = jest.fn();
        const { getByTestId } = render(<CookieConsentModal isOpen={true} onClose={spy} />);
        act(() => {
            userEvent.click(getByTestId('CookieConsentModal-agree-btn'));
        });
        expect(spy).toHaveBeenCalled();
    });

    it('executes the close function when disagreed to cockies', () => {
        const spy = jest.fn();
        const { getByTestId } = render(<CookieConsentModal isOpen={true} onClose={spy} />);
        act(() => {
            userEvent.click(getByTestId('CookieConsentModal-disagree-btn'));
        });
        expect(spy).toHaveBeenCalled();
    });
});
