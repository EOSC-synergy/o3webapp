import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SeasonCheckBoxGroup from './SeasonCheckboxGroup/SeasonCheckBoxGroup';
import TimeCheckBoxGroup from './TimeCheckboxGroup';

it('renders without crashing', () => {
    render(<TimeCheckBoxGroup />)
}) 

it('renders correctly', () => {
    const { container } = render(<TimeCheckBoxGroup />);
    expect(container).toMatchSnapshot();
})