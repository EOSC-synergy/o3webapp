import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux'
import '@testing-library/jest-dom';
import EditModelGroupModal from './EditModelGroupModal';
import { createTestStore } from "../../../../../../store/store"

let store
beforeEach(() => {
    store = createTestStore();
})

describe("test EditModelGroupModal rendering", () => {

    it("renders without crashing", () => {
        render(<Provider store={store}><EditModelGroupModal isOpen={true} onClose={() => {}} modelGroupId={0}/></Provider>);
    });

    it("renders correctly when open", () => {
        const { container } = render(<Provider store={store}><EditModelGroupModal isOpen={true} onClose={() => {}} modelGroupId={0}/></Provider>);
        expect(container).toMatchSnapshot();
        expect(container).toBeVisible();
    });

    it("closes the modal correctly when changes are discarded", () => {
        const onClose = jest.fn()
        const { container, getByTestId } = render(<Provider store={store}><EditModelGroupModal isOpen={true} onClose={onClose} modelGroupId={0}/></Provider>);
        const closeButton = getByTestId(/DiscardButton/);
        fireEvent.click(closeButton);
        expect(onClose).toHaveBeenCalled();
    });

    it("closes the modal correctly when changes are applied", () => {
        const onClose = jest.fn()
        const { container, getByTestId } = render(<Provider store={store}><EditModelGroupModal isOpen={true} onClose={onClose} modelGroupId={0}/></Provider>);
        const closeButton = getByTestId(/ApplyButton/);
        fireEvent.click(closeButton);
        expect(onClose).toHaveBeenCalled();
    });

    it("searches for a specific string", () => {
        const onClose = jest.fn()
        const { container, getByTestId, getByDisplayValue } = render(<Provider store={store}><EditModelGroupModal isOpen={true} onClose={onClose} modelGroupId={0}/></Provider>);
        const input = getByTestId("SearchbarInput");
        fireEvent.change(input, {target: {value: "AAA"}})
    });

    it("closes the modal correctly when changes are applied", () => {
        const onClose = jest.fn()
        const { container, getByTestId } = render(<Provider store={store}><EditModelGroupModal isOpen={true} onClose={onClose} modelGroupId={0}/></Provider>);
        //const closeButton = getByTestId(/Row0TypeMean/);
        //fireEvent.click(closeButton);
        //expect(onClose).toHaveBeenCalled();
    });


});
