import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux'
import TimeCheckBoxGroup from './TimeCheckboxGroup';
import store from "../../../../../store/store";
import { NUM_MONTHS, NUM_MONTHS_IN_SEASON } from '../../../../../utils/constants';

it('renders without crashing', () => {
    render(<>
        <Provider store={store}>
            <TimeCheckBoxGroup />
        </Provider>
        </>)
}) 

it('renders correctly', () => {
    
    const { container } = render(<>
        <Provider store={store}>
            <TimeCheckBoxGroup />
        </Provider>
        </>);
    
    expect(container).toMatchSnapshot();
})

it('renders all checkbox groups correctly', () => {
    
    const { getByTestId } = render(<>
        <Provider store={store}>
            <TimeCheckBoxGroup />
        </Provider>
        </>);
    
    for (let i = 0; i < (NUM_MONTHS_IN_SEASON); i++) {
        expect(getByTestId("CheckboxMonth" + i)).toBeInTheDocument()
    }

    expect(getByTestId("CheckboxAllYear")).toBeInTheDocument()
    
})

it('renders all checkbox groups correctly', () => {
    
    const { getByTestId } = render(<>
        <Provider store={store}>
            <TimeCheckBoxGroup />
        </Provider>
        </>);

    expect(getByTestId("CheckboxAllYear")).toBeInTheDocument()
    
})