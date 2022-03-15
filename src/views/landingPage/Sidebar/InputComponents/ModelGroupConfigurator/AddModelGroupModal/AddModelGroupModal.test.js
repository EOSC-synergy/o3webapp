import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import AddModelGroupModal from './AddModelGroupModal';
import { Provider } from "react-redux";
import { createTestStore } from '../../../../../../store/store';
import modelsResponse from "../../../../../../services/API/testing/models-response.json";
import tco3zmResponse from "../../../../../../services/API/testing/tco3zm-response.json";
import axios from 'axios';
import { fetchModels } from '../../../../../../services/API/apiSlice/apiSlice';
jest.mock('axios');

let store;
describe('test addModelGroupModal rendering', () => {
    beforeEach(() => {
        store = createTestStore();
    });

    it('renders without crashing', () => {
        render(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={() => {}} setOpen={() => {}} refresh={true}/>
        </Provider>);
    });

    
    it('renders correctly when open', () => {
        let { baseElement, container } = render(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={() => {}} setOpen={() => {}} refresh={true}/>
        </Provider>
        );
        expect(baseElement).toMatchSnapshot();
        expect(container).toBeVisible();
    });

    it('renders correctly when closed', () => {
        let { container, baseElement } = render(<Provider store={store}>
            <AddModelGroupModal isOpen={false} onClose={() => {}} reportError={() => {}} setOpen={() => {}} refresh={true}/>
        </Provider>
        );
        expect(baseElement).toMatchSnapshot();
        expect(container).not.toBeVisible;
    });

    it('fires props.onClose when clicking on the closing icon button', () => {
        const onClose = jest.fn();
        const { getByTestId, container } = render(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={onClose} reportError={() => {}} setOpen={() => {}} refresh={true}/>
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
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={() => {}} setOpen={() => {}} refresh={true}/>
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
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={() => {}} setOpen={() => {}} refresh={true}/>
        </Provider>
        );
        const moveAllRightButton = getByTestId(/move-allChecked-left/);
        expect(moveAllRightButton).toBeDisabled;
        const moveAllLeftButton = getByTestId(/move-allChecked-right/);
        expect(moveAllLeftButton).toBeDisabled;
    });

    it("displays spinner when models are being fetched", () => {
        const { getAllByTestId } = render(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={() => {}} setOpen={() => {}} refresh={true}/>
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
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={mock} setOpen={() => {}} refresh={true}/>
        </Provider>);

        await store.dispatch(fetchModels());
        rerender(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={mock} setOpen={() => {}} refresh={true}/>
        </Provider>)
        expect(mock).toHaveBeenCalledWith(`API not responding: ${errorMessage}`);
    });


});

let rendered;
describe('test addModelGroupModal functionality without model group id', () => {

    beforeEach(async () => {
        store = createTestStore();
        axios.get.mockImplementation(() => {
            return Promise.resolve({data: modelsResponse})
        });
        await store.dispatch(fetchModels());
        
        rendered = render(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={() => {}} setOpen={() => {}} refresh={true}/>
        </Provider>);

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
        const {getByTestId} = rendered;

        const listItems = within(getByTestId("AddModelGroupModal-card-header-left")).queryAllByRole("listitem");
        const moveModel = listItems[0].textContent;
        userEvent.click(listItems[0]);
        
        userEvent.click(getByTestId("AddModelGroupModal-button-move-allChecked-right"));
        const rightListItems = within(getByTestId("AddModelGroupModal-card-header-right")).queryAllByRole("listitem")
        expect(within(getByTestId("AddModelGroupModal-card-header-right")).queryAllByRole("listitem").length).toEqual(1); // expect one model was moved to the right
        expect(rightListItems[0].textContent).toEqual(moveModel);
    });

    it("moves all model from the left to the right and back correctly", () => {
        const { getByTestId, getAllByTestId } = rendered;
        const [selectAllLeft, selectAllRight] = getAllByTestId("AddModelGroupModal-select-all");
        
        const moveAllRight = getByTestId("AddModelGroupModal-button-move-allChecked-right");
        const moveAllLeft = getByTestId("AddModelGroupModal-button-move-allChecked-left");
        
        userEvent.click(selectAllLeft);
        userEvent.click(moveAllRight); // move everything to the right

        expect(within(getByTestId("AddModelGroupModal-card-header-right")).queryAllByRole("listitem").length).toEqual(105);
        expect(within(getByTestId("AddModelGroupModal-card-header-left")).queryAllByRole("listitem").length).toEqual(0);

        userEvent.click(selectAllRight);
        userEvent.click(moveAllLeft); // move everything to the left

        expect(within(getByTestId("AddModelGroupModal-card-header-right")).queryAllByRole("listitem").length).toEqual(0);
        expect(within(getByTestId("AddModelGroupModal-card-header-left")).queryAllByRole("listitem").length).toEqual(105);
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

});

describe('test addModelGroupModal functionality without model group id', () => {

    beforeEach(async () => {
        store = createTestStore();
        axios.get.mockImplementation(() => {
            return Promise.resolve({data: modelsResponse})
        });
        await store.dispatch(fetchModels());
        
        rendered = render(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={() => {}} modelGroupId={0} setOpen={() => {}} refresh={true}/>
        </Provider>);

        
        await waitFor(() => {
            expect(rendered.baseElement).toHaveTextContent("102");
        });
    });

    it("renders default model group name when props.modelGroupId is provided", () => {
        expect(rendered.baseElement).toHaveTextContent(store.getState().models.modelGroups["0"].name);
    });

    it("renders default models on the right when props.modelGroupId is provided", () => {
        const { getByTestId } = rendered;
        const filteredModels = within(getByTestId("AddModelGroupModal-card-header-right")).queryAllByRole("listitem");
        const modelGroupInStore = store.getState().models.modelGroups["0"].models;
        expect(filteredModels.length).toEqual(Object.keys(modelGroupInStore).length);
    });

    it("changes the model name and updates the store on edit", () => {
        axios.post.mockImplementation(() => Promise.resolve({data: tco3zmResponse}));
        const { getByTestId } = rendered;
        const nameField = getByTestId("AddModelGroupModal-card-group-name");
        const title = "New Title";
        const amountBackspace = store.getState().models.modelGroups["0"].name.length;
        userEvent.type(nameField, "{backspace}".repeat(amountBackspace)); // deletes old name
        userEvent.type(nameField, title);
        userEvent.click(getByTestId("AddModelGroupModal-save-button")); // save changes
        expect(store.getState().models.modelGroups["0"].name).toEqual(title);
    });
    
    it("exits without changing", () => {
        const { getByTestId } = rendered;

        userEvent.type(getByTestId("AddModelGroupModal-card-group-name"), "blubblob");
        
        const oldName = store.getState().models.modelGroups["0"].name;
        userEvent.click(getByTestId("addModelGroupModal-close-button")); // exit without closing
        expect(store.getState().models.modelGroups["0"].name).toEqual(oldName);
    });
    
    it("displays a warning if checked models are invisible", () => {
        
        const { getByTestId, getAllByTestId, baseElement } = rendered;

        const selectAllLeft = getAllByTestId("AddModelGroupModal-select-all")[0];
        userEvent.click(selectAllLeft);
        
        const partOfDynamicErrorMsg = "hidden model";
        expect(baseElement).not.toHaveTextContent(partOfDynamicErrorMsg);
        userEvent.type(getByTestId("SearchbarInput"), "ACCESS{enter}");
        expect(baseElement).toHaveTextContent(partOfDynamicErrorMsg);
    });

    
});

describe('test error handling', () => {

    beforeEach(async () => {
        store = createTestStore();
        axios.get.mockImplementation(() => {
            return Promise.resolve({data: modelsResponse})
        });
        await store.dispatch(fetchModels());
        
        rendered = render(<Provider store={store}>
            <AddModelGroupModal isOpen={true} onClose={() => {}} reportError={() => {}} setOpen={() => {}} refresh={true}/>
        </Provider>);

        
        await waitFor(() => {
            expect(rendered.baseElement).toHaveTextContent("105");
        });
    });

    it("it displays an error message if no name is provided before saving", () => {
        const { baseElement, getByTestId, getAllByTestId } = rendered;
        const expectedErrorMessage = "Please provide a model group name";

        
        // make sure that there are models on the right (=> error message can only regard the missing name)
        const selectAllLeft = getAllByTestId("AddModelGroupModal-select-all")[0];
        const moveAllRight = getByTestId("AddModelGroupModal-button-move-allChecked-right");
        
        userEvent.click(selectAllLeft);
        userEvent.click(moveAllRight); // move everything to the right
        
        expect(baseElement).not.toHaveTextContent(expectedErrorMessage); // no error message
        userEvent.click(getByTestId("AddModelGroupModal-save-button")); // save changes
        expect(baseElement).toHaveTextContent(expectedErrorMessage); // error message
    });

    it("it displays an error message if no model on the right is provided before saving", () => {
        const { baseElement, getByTestId } = rendered;
        const expectedErrorMessage = "Please provide a list of models for this group";
        
        // make sure that a title is provided (=> error message can only regard the missing models)
        const nameField = getByTestId("AddModelGroupModal-card-group-name");
        const title = "blub";
        userEvent.type(nameField, title);
        
        expect(baseElement).not.toHaveTextContent(expectedErrorMessage); // no error message
        userEvent.click(getByTestId("AddModelGroupModal-save-button")); // save changes
        expect(baseElement).toHaveTextContent(expectedErrorMessage); // error message
    });

});
