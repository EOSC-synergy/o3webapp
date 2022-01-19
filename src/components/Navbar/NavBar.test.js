import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './Navbar';
import { render, screen } from '@testing-library/react';
import { within } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import { pages } from './Navbar';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Navbar />, div);
});

// Snapshot test
it('renders correctly', () => {
    const { asFragment } = render(<Navbar />);
    expect(asFragment()).toMatchSnapshot();
});

it('renders all menu buttons in the expanded menu', () => {
    render(<Navbar />);
    const menuExpanded = screen.getByTestId('navbar-menu-expanded');
    const menuOptionsExpanded = within(menuExpanded).getAllByTestId(/menu-option/);
    expect(menuOptionsExpanded).toHaveLength(pages.length);

    for (let i = 0; i < pages.length; i++) {
        let textContent = new RegExp(pages[i].label);
        expect(menuOptionsExpanded[i]).toHaveTextContent(textContent);
        let testId = new RegExp(`menu-option-${pages[i].label}`)
        expect(within(menuExpanded).getByTestId(testId)).not.toBeDisabled();
    }
});

it('renders all menu buttons in the collpased menu', () => {
    render(<Navbar />);
    const menuCollapsed = screen.getAllByTestId('navbar-menu-collapsed');       // Mui renders multiple menus
    const menuOptionsCollapsed = within(menuCollapsed[0]).getAllByTestId(/menu-option/);
    expect(menuOptionsCollapsed).toHaveLength(pages.length);

    for (let i = 0; i < pages.length; i++) {
        let textContent = new RegExp(pages[i].label);
        expect(menuOptionsCollapsed[i]).toHaveTextContent(textContent);
        let testId = new RegExp(`menu-option-${pages[i].label}`)
        expect(within(menuCollapsed[0]).getByTestId(testId)).not.toBeDisabled();
    }
});
