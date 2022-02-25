import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux'
import TimeCheckBoxGroup from './TimeCheckboxGroup';
import { NUM_MONTHS } from '../../../../../utils/constants';
import { createTestStore } from "../../../../../store/store"

let store
beforeEach(() => {
    store = createTestStore();
})

it('renders without crashing', () => {
    render(<>
        <Provider store={store}>
            <TimeCheckBoxGroup reportError={() => {}} />
        </Provider>
        </>)
}) 

it('renders correctly', () => {
    
    const { container } = render(<>
        <Provider store={store}>
            <TimeCheckBoxGroup reportError={() => {}} />
        </Provider>
        </>);
    
    expect(container).toMatchSnapshot();
})

it('renders all checkbox groups correctly', () => {
    
    const { getByTestId } = render(<>
        <Provider store={store}>
            <TimeCheckBoxGroup reportError={() => {}} />
        </Provider>
        </>);
    
    for (let i = 0; i < (NUM_MONTHS); i++) {
        expect(getByTestId("CheckboxMonth" + (i + 1))).toBeInTheDocument();
    }

    expect(getByTestId("CheckboxAllYear")).toBeInTheDocument();
    
})

it('selects a month correctly', () => {
    
    
    const { getByTestId } = render(<>
        <Provider store={store}>
            <TimeCheckBoxGroup reportError={() => {}} />
        </Provider>
        </>);
    
    expect(store.getState().plot.generalSettings.months).toEqual([1, 2, 12]); // assert: if it fails the initial state may have changed
    fireEvent.click(getByTestId("CheckboxMonth2"));
    expect(store.getState().plot.generalSettings.months).toEqual([1, 12]);
    fireEvent.click(getByTestId("CheckboxMonth2"));
    expect(store.getState().plot.generalSettings.months).toEqual([1, 2, 12]);
    
})


it('selects a season correctly', () => {
    
    const { getByTestId } = render(<>
        <Provider store={store}>
            <TimeCheckBoxGroup reportError={() => {}} />
        </Provider>
        </>);
    
    expect(store.getState().plot.generalSettings.months).toEqual([1, 2, 12]); // assert: if it fails the initial state may have changed
})

it('selects the "All Year" checkbox correctly', () => {
    
    const { getByTestId } = render(<>
        <Provider store={store}>
            <TimeCheckBoxGroup reportError={() => {}}/>
        </Provider>
        </>);
    
    expect(store.getState().plot.generalSettings.months).toEqual([1, 2, 12]); // assert: if it fails the initial state may have changed
    fireEvent.click(getByTestId("CheckboxAllYear"));
    expect(store.getState().plot.generalSettings.months).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

    
})