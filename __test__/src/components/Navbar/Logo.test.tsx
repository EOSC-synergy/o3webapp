import React from 'react';
import Logo, { LOGO_SOURCE, LOGO_NAVIGATION } from 'components/Navbar/Logo';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

it('displays the name of O3AS Webapp', () => {
    render(<Logo />);
    expect(screen.getByTestId('logo-text')).toHaveTextContent('O3as: Webapp');
});

it('displays the correct image', () => {
    render(<Logo />);
    const image = screen.getByAltText('logo') as HTMLImageElement;
    expect(image.src).toContain(LOGO_SOURCE);
});

it('renders correct link onto logo', () => {
    render(<Logo />);
    expect(screen.getByText('O3as: Webapp').closest('a')).toHaveAttribute('href', LOGO_NAVIGATION);
});

it('renders nothing if props.display={"none"}', () => {
    render(<Logo display={'none'} />);
    expect(screen.getByTestId('logo-container')).not.toBeVisible();
});
