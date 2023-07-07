import React from 'react';
import ReactDOM from 'react-dom';
import Footer, { links } from 'components/Footer';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

it('renders all menu buttons in the expanded menu', () => {
    render(<Footer />);
    const footer = screen.getByTestId('footer-grid-container');
    const footerLinks = within(footer).getAllByTestId(/footer-grid-item/);
    expect(footerLinks).toHaveLength(links.length);

    for (let i = 0; i < links.length; i++) {
        const textContent = new RegExp(links[i].label);
        expect(footerLinks[i]).toHaveTextContent(textContent);
    }
});
