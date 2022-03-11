import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux'
import TimeCheckBoxGroup from './TimeCheckboxGroup';
import { NUM_MONTHS } from '../../../../../utils/constants';
import { createTestStore } from "../../../../../store/store"

let store
beforeEach(() => {
    store = createTestStore();
});

describe("tests basic rendering", () => {

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

});

describe("tests redux functionality", () => {
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
});

describe("tests error handling", () => {
    it('making an incorrect selection makes an error message appear', () => {
        const { getByTestId, container } = render(<>
            <Provider store={store}>
                <TimeCheckBoxGroup reportError={() => {}}/>
            </Provider>
            </>);
        const errorMessage = "No month was selected. Data can only be fetched if at least one month is selected.";
    
        expect(store.getState().plot.generalSettings.months).toEqual([1, 2, 12]); // assert: if it fails the initial state may have changed
        fireEvent.click(getByTestId("CheckboxSeasonNum0"));
        expect(container).toHaveTextContent(errorMessage);
    
        fireEvent.click(getByTestId("CheckboxMonth4")); // select
        expect(container).not.toHaveTextContent(errorMessage);
        fireEvent.click(getByTestId("CheckboxMonth4")); // deselect
        expect(container).toHaveTextContent(errorMessage);
    
        fireEvent.click(getByTestId("CheckboxSeasonNum3"));
        expect(store.getState().plot.generalSettings.months).toEqual([9, 10, 11]);
    });
});