import { fetchPlotTypes, REQUEST_STATE } from "../../../../../services/API/apiSlice";
import React from 'react';
import ReactDOM from 'react-dom';
import PlotTypeSelector from './PlotTypeSelector';
import { render, fireEvent, screen, findByText, findByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTestStore } from '../../../../../store/store'
import { Provider } from "react-redux";
import * as redux from 'react-redux'

console.error = jest.fn(); 


let store
describe('plot type selector test', () => {
    beforeEach(() => {
        store = createTestStore();
    });

    it('PlotTypeSelector renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Provider store={store}>
            <PlotTypeSelector reportError={() => {}} />
        </Provider>, div);
    });

    // Snapshot test
    it('PlotTypeSelector renders correctly', () => {
        const { asFragment } = render(<Provider store={store}>
            <PlotTypeSelector reportError={() => {}} />
        </Provider>
        );
        expect(asFragment()).toMatchSnapshot();
        userEvent.tab();  // focuses select
        expect(asFragment()).toMatchSnapshot();
    });

    // Prop types
    it('PlotTypeSelector expects a report error function', () => {
        render(<Provider store={store}>
            <PlotTypeSelector />
        </Provider>);
        expect(console.error).toHaveBeenCalledTimes(1);
    });

    it('PlotTypeSelector reports error if an error occurred in the fetching of plotTypes', async () => {
        const spy = jest.spyOn(redux, 'useSelector')
        
        const errorMessage = "Error Message";
        spy.mockReturnValue(
            { 
                status: REQUEST_STATE.error,
                data: ["tco3_zm"],
                error: errorMessage,
            }
        );
        
        const reportError = jest.fn();
        const div = document.createElement('div');
        
        ReactDOM.render(<Provider store={store}>
            <PlotTypeSelector reportError={reportError} />
        </Provider>, div);
        expect(reportError.mock.calls[0][0]).toEqual(errorMessage);
    });

});


test.todo("check that all options from O3As API are rendered");
test.todo("check circular waiting is rendered");
test.todo("check select expands");
