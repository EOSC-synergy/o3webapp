import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SeasonCheckBoxGroup from './SeasonCheckBoxGroup';


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