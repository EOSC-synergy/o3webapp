import { render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModelGroupCard, { getGroupName } from './ModelGroupCard';


describe('test ModelGroupCard rendering', () => {
    
    it('renders without crashing', () => {
        render(<ModelGroupCard modelGroupId={1} />);
    });

    
    it('renders correctly', () => {
        const { container } = render(<ModelGroupCard modelGroupId={1} />);
        expect(container).toMatchSnapshot();
    });

    it('renders modelGroup Name', () => {
        const groupId = 1;
        const { container } = render(<ModelGroupCard modelGroupId={groupId} />);
        const groupName = getGroupName(groupId);
        expect(container).toHaveTextContent(groupName);
    });

    it('raises a console.error function if a required prop is not provided', () => {
        console.error = jest.fn();
        render(<ModelGroupCard />);
        expect(console.error).toHaveBeenCalledTimes(1);
    });
});

describe('test addModelGroupModal functionality', () => {

    test.todo('test toggle {median, mean, derivative, percentile}');
    test.todo('test toggle group visibility');
    test.todo('test that edit modal opens');

});
