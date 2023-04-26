import React from 'react';
import Logo, { logoSrc, O3ASLink } from 'components/Navbar/Logo';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

it('renders without crashing', () => {
    render(<Logo />);
});

// Snapshot test
it('renders correctly', () => {
    const { asFragment } = render(<Logo />);
    expect(asFragment()).toMatchSnapshot();
});

it('displays the name of O3AS Webapp', () => {
    render(<Logo />);
    expect(screen.getByTestId('logo-text')).toHaveTextContent('O3as: Webapp');
});

it('displays the correct image', () => {
    render(<Logo />);
    const image = screen.getByAltText('logo') as HTMLImageElement;
    expect(image.src).toContain(logoSrc);
});

it('renders correct link onto logo', () => {
    render(<Logo />);
    expect(screen.getByText('O3as: Webapp').closest('a')).toHaveAttribute('href', O3ASLink);
});

it('renders nothing if props.display={"none"}', () => {
    render(<Logo display={'none'} />);
    expect(screen.getByTestId('logo-container')).not.toBeVisible();
});
