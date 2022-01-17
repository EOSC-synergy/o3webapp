import { fetchPlotTypes, REQUEST_STATE } from "../../../../../services/API/apiSlice";
import React from 'react';
import ReactDOM from 'react-dom';
import PlotTypeSelector from './PlotTypeSelector';
import { render, fireEvent, within } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { createTestStore } from '../../../../../store/store'
import { Provider } from "react-redux";
import * as redux from 'react-redux';

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
        console.error = jest.fn();
        render(<Provider store={store}>
            <PlotTypeSelector />
        </Provider>);
        expect(console.error).toHaveBeenCalledTimes(1);
    });

    it('PlotTypeSelector reports error if an error occurred in the fetching of plotTypes', () => {
        const spy = jest.spyOn(redux, 'useSelector')
        
        const errorMessage = "Error Message";
        spy.mockReturnValue(
            { 
                status: REQUEST_STATE.error,
                data: [],
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

    it('should render all the returned data from the api', () => {
        const spy = jest.spyOn(redux, 'useSelector')
        
        spy.mockReturnValue( // mock api request
            { 
                status: REQUEST_STATE.success,
                data: ["tco3_zm", "tco3_return"],
                error: null,
            }
        );
    
        
        expect(store.getState().plot.plotId).toEqual("tco3_zm");
        
        const { getByRole, getAllByRole } = render(<Provider store={store}>
            <PlotTypeSelector reportError={() => {}} />
        </Provider>);
        
        const trigger = getByRole('button');
        fireEvent.mouseDown(trigger);

        const options = getAllByRole('option');
        expect(options[0]).toEqual("tco3_zm");
        expect(options[1]).toEqual("tco3_return");
    });

    it('should update the clicked value in the store', () => {
        const spy = jest.spyOn(redux, 'useSelector')
        
        spy.mockReturnValue( // mock api request
            { 
                status: REQUEST_STATE.success,
                data: ["tco3_zm", "tco3_return"],
                error: null,
            }
        );
    
        
        expect(store.getState().plot.plotId).toEqual("tco3_zm");
        
        const { getByRole, getAllByRole } = render(<Provider store={store}>
            <PlotTypeSelector reportError={() => {}} />
        </Provider>);
        
        const trigger = getByRole('button');
        fireEvent.mouseDown(trigger);

        const options = getAllByRole('option');

        act(() => {
            options[1].click(); // click on second option (tco3_return)
        });
        expect(store.getState().plot.plotId).toEqual("tco3_return");
    });

});


test.todo("check that all options from O3As API are rendered");
test.todo("check circular waiting is rendered");
test.todo("check select expands");
