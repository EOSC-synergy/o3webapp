import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import AddModelGroupModal from './AddModelGroupModal';
import { Provider } from "react-redux";
import { createTestStore } from '../../../../../../store/store';
import modelsResponse from "../../../../../../services/API/testing/models-response.json";
import axios from 'axios';
import { fetchModels } from '../../../../../../services/API/apiSlice';
jest.mock('axios');

const TEST_MODEL_NAME = "CCMI-1_ACCESS_ACCESS-CCM-refC2";

let store;
describe('test addModelGroupModal rendering', () => {
    beforeEach(() => {
        store = createTestStore();
    });

    it('renders without crashing', () => {
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

    it("calls props.reportError if fetching models failed", async () => {
        const errorMessage = "blob";
        const mock = jest.fn();
        axios.get.mockImplementation(() => {
            return Promise.reject({message: errorMessage}); //Promise.resolve({data: modelsResponse})
        });
        
        const { rerender } = render(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={mock} />
        </Provider>);

        await store.dispatch(fetchModels());
        rerender(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={mock} />
        </Provider>)
        expect(mock).toHaveBeenCalledWith(`API not responding: ${errorMessage}`);
    });


});

let rendered;
describe('test addModelGroupModal functionality', () => {

    beforeEach(async () => {
        store = createTestStore();
        axios.get.mockImplementation(() => {
            return Promise.resolve({data: modelsResponse})
        });
        
        rendered = render(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={() => {}} />
        </Provider>);

        await store.dispatch(fetchModels());
        await waitFor(() => {
            expect(rendered.baseElement).toHaveTextContent("105");
        });
    });

    it("loads all 105 models correctly", async () => {
        
        const { getAllByRole } = rendered;
        expect(getAllByRole("listitem").length).toEqual(105);
    });
        
    it("check if all models are rendered on the left at beginning and none on the right", async () => {
        const { getByTestId } = rendered;
        expect(within(getByTestId("AddModelGroupModal-card-header-left")).queryAllByRole("listitem").length).toEqual(105);
        expect(within(getByTestId("AddModelGroupModal-card-header-right")).queryAllByRole("listitem").length).toEqual(0);
    });

    it("check if models can be moved from left to right", async () => {
        const firstListElementText = "ACCESS-CCM-refC2Institute: ACCESS\nProject: CCMI-1";
        const {getByTestId} = rendered;

        const listItems = within(getByTestId("AddModelGroupModal-card-header-left")).queryAllByRole("listitem");
        const moveModel = listItems[0].textContent;
        userEvent.click(listItems[0]);
        
        userEvent.click(getByTestId("AddModelGroupModal-button-move-allChecked-right"));
        const rightListItems = within(getByTestId("AddModelGroupModal-card-header-right")).queryAllByRole("listitem")
        expect(within(getByTestId("AddModelGroupModal-card-header-right")).queryAllByRole("listitem").length).toEqual(1); // expect one model was moved to the right
        expect(rightListItems[0].textContent).toEqual(moveModel);
    });

    it("hides models that doesn't match the selection", () => {
        const { getByTestId } = rendered;

        const searchString = "ACCESS";
        const listItems = within(getByTestId("AddModelGroupModal-card-header-left")).queryAllByRole("listitem");
        const accessModels = listItems.map(item => item.textContent).filter(item => item.includes(searchString));
        userEvent.type(getByTestId("SearchbarInput"), "ACCESS{enter}");
        const filteredModels = within(getByTestId("AddModelGroupModal-card-header-left")).queryAllByRole("listitem");
        expect(filteredModels.length).toEqual(accessModels.length); // compare length
        expect(filteredModels.map(item => item.textContent)).toEqual(accessModels); // compare length
    });


    test.todo("check default model group name is rendered when props.modelGroupId is provided");
    test.todo("check default models on the right are rendered when props.modelGroupId is provided");
    test.todo("check if onClosing the modal resets all model groups on the right and checked");
});
