import { render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddModelGroupModal from './AddModelGroupModal';
import { Provider } from "react-redux";
import * as redux from 'react-redux';
import { createTestStore } from '../../../../../../store/store';
import { REQUEST_STATE } from "../../../../../../services/API/apiSlice";

let store;
describe('test addModelGroupModal rendering', () => {
    beforeEach(() => {
        store = createTestStore();
    });

    it('renders without crashing', () => {
        const mockFunction = jest.fn();
        render(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={() => {}} />
        </Provider>);
    });

    
    it('renders correctly when open', () => {
        let { container } = render(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={() => {}} />
        </Provider>
        );
        expect(container).toMatchSnapshot();
        expect(container).toBeVisible();
    });

    it('renders correctly when closed', () => {
        let { container } = render(<Provider store={store}>
            <AddModelGroupModal isOpen={false} onClose={() => {}} reportError={() => {}} />
        </Provider>
        );
        expect(container).toMatchSnapshot();
        expect(container).not.toBeVisible;
    });

    it('fires props.onClose when clicking on the closing icon button', () => {
        const onClose = jest.fn();
        const { getByTestId, container } = render(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={onClose} reportError={() => {}} />
        </Provider>
        );
        const closeButton = getByTestId(/close-button/);
        fireEvent.click(closeButton);
        expect(onClose).toHaveBeenCalled();
        expect(container).not.toBeVisible;
    });

    it('raises a console.error function if a required prop is not provided', () => {
        console.error = jest.fn();
        render(<Provider store={store}>
            <AddModelGroupModal />
        </Provider>);
        expect(console.error).toHaveBeenCalled();
        render(<Provider store={store}>
            <AddModelGroupModal isOpen={false} reportError={() => {}} />
        </Provider>);
        expect(console.error).toHaveBeenCalled();
        render(<Provider store={store}>
            <AddModelGroupModal onClose={() => {}} />
        </Provider>
        );
        expect(console.error).toHaveBeenCalled();
    });
});

describe('test addModelGroupModal functionality', () => {

    it('disables move all checked buttons if nothing is checked at beginning', () => {
        const { getByTestId } = render(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={() => {}} />
        </Provider>
        );
        const moveAllRightButton = getByTestId(/move-allChecked-left/);
        expect(moveAllRightButton).toBeDisabled;
        const moveAllLeftButton = getByTestId(/move-allChecked-right/);
        expect(moveAllLeftButton).toBeDisabled;
    });

    it("displays spinner when models are being fetched", () => {
        const spy = jest.spyOn(redux, 'useSelector');
        
        spy.mockReturnValueOnce(
            { 
                status: REQUEST_STATE.loading,
                data: [],
                error: null,
            }
        );

        const { getAllByTestId } = render(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={() => {}} />
        </Provider>);
        const circularProgress = getAllByTestId(/AddModelGroupModal-spinner/);
        expect(circularProgress.length).toBe(2);
    });

    it("call props.reportError if fetching models failed", () => {
        const spy = jest.spyOn(redux, 'useSelector');
        const mockReportError = jest.fn();
        const errorMessage = "blob";
        
        spy.mockReturnValueOnce(
            { 
                status: REQUEST_STATE.error,
                data: [],
                error: errorMessage,
            }
        );

        render(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={mockReportError} />
        </Provider>);

        expect(mockReportError).toHaveBeenCalledWith("API not responding: " + errorMessage);
        
    });

});
