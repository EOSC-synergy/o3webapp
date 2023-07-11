import React from 'react';
import Footer, { FOOTER_LINKS } from 'components/Footer';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// rewrite with better selection practises
it.skip('renders all menu buttons in the expanded menu', () => {
    render(<Footer />);
    const footer = screen.getByTestId('footer-grid-container');
    const footerLinks = within(footer).getAllByTestId(/footer-grid-item/);
    expect(footerLinks).toHaveLength(FOOTER_LINKS.length);

    for (let i = 0; i < FOOTER_LINKS.length; i++) {
        const textContent = new RegExp(FOOTER_LINKS[i].label);
        expect(footerLinks[i]).toHaveTextContent(textContent);
    }
});
