import { render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddModelGroupModal from './AddModelGroupModal';


describe('test addModelGroupModal rendering', () => {
    
    it('renders without crashing', () => {
        render(<AddModelGroupModal isOpen={true} onClose={() => {}} />);
    });

    
    it('renders correctly when open', () => {
        let { container } = render(<AddModelGroupModal isOpen={true} onClose={() => {}} />);
        expect(container).toMatchSnapshot();
        expect(container).toBeVisible();
    });

    it('renders correctly when closed', () => {
        let { container } = render(<AddModelGroupModal isOpen={false} onClose={() => {}} />);
        expect(container).toMatchSnapshot();
        expect(container).not.toBeVisible;
    });

    it('fires props.onClose when clicking on the closing icon button', () => {
        const onClose = jest.fn();
        const { getByTestId, container } = render(<AddModelGroupModal isOpen={true} onClose={onClose} />);
        const closeButton = getByTestId(/close-button/);
        fireEvent.click(closeButton);
        expect(onClose).toHaveBeenCalled();
        expect(container).not.toBeVisible;
    });

    it('raises a console.error function if a required prop is not provided', () => {
        console.error = jest.fn();
        render(<AddModelGroupModal />);
        expect(console.error).toHaveBeenCalled();
        render(<AddModelGroupModal isOpen={false} />);
        expect(console.error).toHaveBeenCalled();
        render(<AddModelGroupModal onClose={() => {}} />);
        expect(console.error).toHaveBeenCalled();
    });
});

describe('test addModelGroupModal functionality', () => {

    it('disables move all checked buttons if nothing is checked at beginning', () => {
        const { getByTestId } = render(<AddModelGroupModal isOpen={true} onClose={() => {}} />);
        const moveAllRightButton = getByTestId(/move-allChecked-left/);
        expect(moveAllRightButton).toBeDisabled;
        const moveAllLeftButton = getByTestId(/move-allChecked-right/);
        expect(moveAllLeftButton).toBeDisabled;
    });

});
