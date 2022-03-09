import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddModelGroupModal from './AddModelGroupModal';
import { Provider } from "react-redux";
import * as redux from 'react-redux';
import { createTestStore } from '../../../../../../store/store';
import { REQUEST_STATE } from "../../../../../../services/API/apiSlice";
import { TestScheduler } from 'jest';

const TEST_MODEL_NAME = "CCMI-1_ACCESS_ACCESS-CCM-refC2";

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
        let { baseElement, container } = render(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={() => {}} />
        </Provider>
        );
        expect(baseElement).toMatchSnapshot();
        expect(container).toBeVisible();
    });

    it('renders correctly when closed', () => {
        let { container, baseElement } = render(<Provider store={store}>
            <AddModelGroupModal isOpen={false} onClose={() => {}} reportError={() => {}} />
        </Provider>
        );
        expect(baseElement).toMatchSnapshot();
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

    it("renders correctly if model list provided", () => {

        const { baseElement } = render(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={() => {}}/>
        </Provider>);

        expect(baseElement).toMatchSnapshot();
    });
});

describe('test addModelGroupModal functionality', () => {

    beforeEach(() => {
        store = createTestStore();
    });


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
        const { getAllByTestId } = render(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={() => {}} />
        </Provider>);
        const circularProgress = getAllByTestId(/AddModelGroupModal-spinner/);
        expect(circularProgress.length).toBe(2);
    });

    test.todo("call props.reportError if fetching models failed");
    test.todo("check if models are rendered on the left");
    test.todo("check if models can be moved from left to right");
    test.todo("check if models not being selected by search are being hidden");
    test.todo("check default model group name is rendered when props.modelGroupId is provided");
    test.todo("check default models on the right are rendered when props.modelGroupId is provided");
    test.todo("check if onClosing the modal resets all model groups on the right and checked");
});
