import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SeasonCheckBoxGroup from './SeasonCheckBoxGroup';
import { NUM_MONTHS_IN_SEASON } from '../../../../../../utils/constants';


it('renders without crashing', () => {
    const dummyFunc = () => {};
    const dummyObj = [
        {monthId: 1, checked: false},
        {monthId: 2, checked: false},
        {monthId: 3, checked: false}
    ];

    render(<SeasonCheckBoxGroup 
        label="" 
        handleSeasonClicked={dummyFunc}
        handleMonthClicked={dummyFunc}
        months={dummyObj}

    />);
}) 

it('renders correctly', () => {
    const dummyFunc = () => {};
    const dummyObj = [
        {monthId: 1, checked: false},
        {monthId: 2, checked: false},
        {monthId: 3, checked: false}
    ]
    const { container } = render(<SeasonCheckBoxGroup 
        label="" 
        handleSeasonClicked={dummyFunc}
        handleMonthClicked={dummyFunc}
        months={dummyObj}

    />);
    expect(container).toMatchSnapshot();
})

it('renders month checkboxes correctly', () => {
    const dummyFunc = () => {};
    const dummyObj = [
        {monthId: 1, checked: false},
        {monthId: 2, checked: false},
        {monthId: 3, checked: false}
    ]
    const { getByTestId } = render(<SeasonCheckBoxGroup 
        label="" 
        handleSeasonClicked={dummyFunc}
        handleMonthClicked={dummyFunc}
        months={dummyObj}

    />);
    for(let i = 0; i < NUM_MONTHS_IN_SEASON; i++) {
        expect(getByTestId("Checkbox" + i)).toBeInTheDocument();
    }
})

it('selects a month correctly', () => {
    const jestFunc = jest.fn();
    const dummyFunc = () => {};
    const dummyObj = [
        {monthId: 1, checked: false},
        {monthId: 2, checked: false},
        {monthId: 3, checked: false}
    ]
    const { getByTestId } = render(<SeasonCheckBoxGroup 
        label="" 
        handleSeasonClicked={dummyFunc}
        handleMonthClicked={jestFunc}
        months={dummyObj}

    />);
    const checkbox = getByTestId("Checkbox0");
    fireEvent.change(checkbox, {target: {value: true}});

    //TODO
    //expect(jestFunc).toHaveBeenCalledTimes(1);

})