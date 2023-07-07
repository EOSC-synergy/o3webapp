import { render, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import EditModelGroupModal from '../../../../../../../src/views/landingPage/Sidebar/InputComponents/ModelGroupConfigurator/EditModelGroupModal';
import { createTestStore } from '../../../../../../../src/store';

let store;
beforeEach(() => {
    store = createTestStore();
});

describe('test EditModelGroupModal rendering', () => {
    it('renders correctly when open', () => {
        const { queryByTestId } = render(
            <Provider store={store}>
                <EditModelGroupModal
                    isOpen={true}
                    onClose={() => {}}
                    modelGroupId={0}
                    refresh={true}
                    setOpen={() => {}}
                />
            </Provider>
        );
        expect(queryByTestId(/modal-wrapper/)).toBeInTheDocument();
    });

    it('renders correctly when close', () => {
        const { queryByTestId } = render(
            <Provider store={store}>
                <EditModelGroupModal
                    isOpen={false}
                    onClose={() => {}}
                    modelGroupId={0}
                    refresh={true}
                    setOpen={() => {}}
                />
            </Provider>
        );
        expect(queryByTestId(/modal-wrapper/)).toBeNull();
    });

    it('closes the modal correctly when changes are discarded', () => {
        const onClose = jest.fn();
        const { getByTestId } = render(
            <Provider store={store}>
                <EditModelGroupModal
                    isOpen={true}
                    onClose={onClose}
                    modelGroupId={0}
                    refresh={true}
                    setOpen={() => {}}
                />
            </Provider>
        );
        const closeButton = getByTestId(/DiscardButton/);
        act(() => {
            fireEvent.click(closeButton);
        });
        expect(onClose).toHaveBeenCalled();
    });

    it('closes the modal correctly when changes are applied', () => {
        const onClose = jest.fn();
        const { getByTestId } = render(
            <Provider store={store}>
                <EditModelGroupModal
                    isOpen={true}
                    onClose={onClose}
                    modelGroupId={0}
                    refresh={true}
                    setOpen={() => {}}
                />
            </Provider>
        );
        const closeButton = getByTestId(/ApplyButton/);
        act(() => {
            fireEvent.click(closeButton);
        });
        expect(onClose).toHaveBeenCalled();
    });
});

describe('test the functionality of EditModelGroupModal', () => {
    it("doesn't show the models filtered out by the search", () => {
        const onClose = jest.fn();
        const { queryByText, getByTestId } = render(
            <Provider store={store}>
                <EditModelGroupModal
                    isOpen={true}
                    onClose={onClose}
                    modelGroupId={0}
                    refresh={true}
                    setOpen={() => {}}
                />
            </Provider>
        );
        const input = getByTestId('SearchbarInput');
        expect(queryByText('ACCESS-CCM-refC2')).toBeInTheDocument(); // If this fails, the default store might have been modified.
        act(() => {
            userEvent.type(input, 'NotAnElementInTheModelList{enter}');
        });
        expect(queryByText('ACCESS-CCM-refC2')).toBeNull();
    });

    it('shows the models filtered by the search', () => {
        const onClose = jest.fn();
        const { queryByText, getByTestId } = render(
            <Provider store={store}>
                <EditModelGroupModal
                    isOpen={true}
                    onClose={onClose}
                    modelGroupId={0}
                    refresh={true}
                    setOpen={() => {}}
                />
            </Provider>
        );
        const input = getByTestId('SearchbarInput');
        expect(queryByText('ACCESS-CCM-refC2')).toBeInTheDocument(); // If this fails, the default store might have been modified.
        act(() => {
            userEvent.type(input, 'ACCESS-CCM-refC2{enter}');
        });
        expect(queryByText('ACCESS-CCM-refC2')).toBeInTheDocument();
    });

    it('correctly shows the intermediate and checked column header icon', () => {
        const { queryByTestId, getByTestId } = render(
            <Provider store={store}>
                <EditModelGroupModal
                    isOpen={true}
                    onClose={() => {}}
                    modelGroupId={0}
                    refresh={true}
                    setOpen={() => {}}
                />
            </Provider>
        );
        const input = getByTestId(/Row0TypeMedian/);

        expect(queryByTestId('ColumnCheckboxCheckedTypeMedian')).toBeInTheDocument();
        expect(input.querySelector('input[type="checkbox"]')).toBeChecked();

        act(() => {
            fireEvent.click(input.querySelector('input[type="checkbox"]'));
        });

        expect(input.querySelector('input[type="checkbox"]')).not.toBeChecked();
        expect(queryByTestId('ColumnCheckboxIntermediateTypeMedian')).toBeInTheDocument();
        expect(queryByTestId('ColumnCheckboxCheckedTypeMedian')).toBeNull();

        act(() => {
            fireEvent.click(input.querySelector('input[type="checkbox"]'));
        });

        expect(queryByTestId('ColumnCheckboxCheckedTypeMedian')).toBeInTheDocument();
        expect(queryByTestId('ColumnCheckboxIntermediateTypeMedian')).toBeNull();
    });

    it('correctly shows the unchecked column header icon', () => {
        const { queryByTestId, getByTestId } = render(
            <Provider store={store}>
                <EditModelGroupModal
                    isOpen={true}
                    onClose={() => {}}
                    modelGroupId={0}
                    refresh={true}
                    setOpen={() => {}}
                />
            </Provider>
        );
        const NUM_ENTRIES_IN_DATAGRID = 3;

        expect(queryByTestId('ColumnCheckboxCheckedTypeMedian')).toBeInTheDocument();
        for (let i = 0; i < NUM_ENTRIES_IN_DATAGRID; i++) {
            const input = getByTestId(`CellCheckboxRow${i}TypeMedian`);
            expect(input.querySelector('input[type="checkbox"]')).toBeChecked();

            act(() => {
                fireEvent.click(input.querySelector('input[type="checkbox"]'));
            });

            expect(input.querySelector('input[type="checkbox"]')).not.toBeChecked();
        }
        expect(queryByTestId('ColumnCheckboxUncheckedTypeMedian')).toBeInTheDocument();
        expect(queryByTestId('ColumnCheckboxCheckedTypeMedian')).toBeNull();
        expect(queryByTestId('ColumnCheckboxIntermediateTypeMedian')).toBeNull();
    });

    it('correctly unchecks column checkbox', () => {
        const { queryByTestId } = render(
            <Provider store={store}>
                <EditModelGroupModal
                    isOpen={true}
                    onClose={() => {}}
                    modelGroupId={0}
                    refresh={true}
                    setOpen={() => {}}
                />
            </Provider>
        );
        const columnCheckbox = queryByTestId('ColumnCheckboxCheckedTypeMedian');
        expect(queryByTestId('ColumnCheckboxCheckedTypeMedian')).toBeInTheDocument();

        act(() => {
            fireEvent.click(columnCheckbox);
        });

        expect(queryByTestId('ColumnCheckboxUncheckedTypeMedian')).toBeInTheDocument();
        expect(queryByTestId('ColumnCheckboxCheckedTypeMedian')).toBeNull();
        expect(queryByTestId('ColumnCheckboxIntermediateTypeMedian')).toBeNull();
    });
});
