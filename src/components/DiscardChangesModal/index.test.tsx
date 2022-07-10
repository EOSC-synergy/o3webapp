import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DiscardChangesModal from '.';

describe('test DiscardChangesModal rendering', () => {
    it('renders without crashing', () => {
        const mockFunction = jest.fn();
        render(
            <DiscardChangesModal
                isOpen={true}
                onClose={mockFunction}
                saveChanges={mockFunction}
                discardChanges={mockFunction}
                closeDialog={() => undefined}
            />
        );
    });

    it('renders correctly when opened', () => {
        const mockFunction = jest.fn();
        const { baseElement, getByTestId } = render(
            <DiscardChangesModal
                isOpen={true}
                onClose={mockFunction}
                saveChanges={mockFunction}
                discardChanges={mockFunction}
                closeDialog={() => undefined}
            />
        );
        expect(baseElement).toMatchSnapshot();
        expect(getByTestId('discardChanges-dialog')).toBeVisible();
    });

    it('renders correctly when closed', () => {
        const mockFunction = jest.fn();
        const { baseElement } = render(
            <DiscardChangesModal
                isOpen={false}
                onClose={mockFunction}
                saveChanges={mockFunction}
                discardChanges={mockFunction}
                closeDialog={() => undefined}
            />
        );
        expect(baseElement).toMatchSnapshot();
        expect(screen.queryByTestId('discardChanges-dialog')).toBeNull();
    });
});

describe('test DiscardChangesModal functionality', () => {
    it('call props.onClose after save or discard changes has been clicked', () => {
        const mockFunction = jest.fn();
        const mockOnClose = jest.fn();
        const { getByTestId } = render(
            <DiscardChangesModal
                isOpen={true}
                closeDialog={mockOnClose}
                onClose={() => undefined}
                saveChanges={mockFunction}
                discardChanges={mockFunction}
            />
        );
        const saveButton = getByTestId(/saveButton/);
        fireEvent.click(saveButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
        const discardButton = getByTestId(/discardButton/);
        fireEvent.click(discardButton);
        expect(mockOnClose).toHaveBeenCalledTimes(2);
    });

    it('call props.discardChanges after discard changes has been clicked', () => {
        const mockFunction = jest.fn();
        const mockDiscardChanges = jest.fn();
        const { getByTestId } = render(
            <DiscardChangesModal
                isOpen={true}
                closeDialog={() => undefined}
                onClose={mockFunction}
                saveChanges={mockFunction}
                discardChanges={mockDiscardChanges}
            />
        );
        const saveButton = getByTestId(/saveButton/);
        fireEvent.click(saveButton);
        expect(mockDiscardChanges).toHaveBeenCalledTimes(0);
        const discardButton = getByTestId(/discardButton/);
        fireEvent.click(discardButton);
        expect(mockDiscardChanges).toHaveBeenCalledTimes(1);
    });

    it('call props.saveChanges after discard changes has been clicked', () => {
        const mockFunction = jest.fn();
        const mockSaveChanges = jest.fn();
        const { getByTestId } = render(
            <DiscardChangesModal
                isOpen={true}
                closeDialog={() => undefined}
                onClose={mockFunction}
                saveChanges={mockSaveChanges}
                discardChanges={mockFunction}
            />
        );
        const saveButton = getByTestId(/saveButton/);
        fireEvent.click(saveButton);
        expect(mockSaveChanges).toHaveBeenCalledTimes(1);
        const discardButton = getByTestId(/discardButton/);
        fireEvent.click(discardButton);
        expect(mockSaveChanges).toHaveBeenCalledTimes(1);
    });
});
