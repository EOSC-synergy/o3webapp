import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SeasonCheckBoxGroup from '../../../../../../../src/views/landingPage/Sidebar/InputComponents/TimeCheckboxGroup/SeasonCheckboxGroup';
import { NUM_MONTHS_IN_SEASON } from '../../../../../../../src/utils/constants';

it('renders without crashing', () => {
    const dummyFunc = () => {};
    const dummyObj = [
        { monthId: 1, checked: false },
        { monthId: 2, checked: false },
        { monthId: 3, checked: false },
    ];

    render(
        <SeasonCheckBoxGroup
            label=""
            seasonId={0}
            handleSeasonClicked={dummyFunc}
            handleMonthClicked={dummyFunc}
            months={dummyObj}
            reportError={dummyFunc}
        />
    );
});

it('renders correctly', () => {
    const dummyFunc = () => {};
    const dummyObj = [
        { monthId: 1, checked: false },
        { monthId: 2, checked: false },
        { monthId: 3, checked: false },
    ];
    const { container } = render(
        <SeasonCheckBoxGroup
            label=""
            seasonId={0}
            handleSeasonClicked={dummyFunc}
            handleMonthClicked={dummyFunc}
            months={dummyObj}
            reportError={dummyFunc}
        />
    );
    expect(container).toMatchSnapshot();
});

it('renders month checkboxes correctly', () => {
    const dummyFunc = () => {};
    const dummyObj = [
        { monthId: 1, checked: false },
        { monthId: 2, checked: false },
        { monthId: 3, checked: false },
    ];
    const { getByTestId } = render(
        <SeasonCheckBoxGroup
            label=""
            seasonId={0}
            handleSeasonClicked={dummyFunc}
            handleMonthClicked={dummyFunc}
            months={dummyObj}
            reportError={dummyFunc}
        />
    );
    for (let i = 0; i < NUM_MONTHS_IN_SEASON; i++) {
        expect(getByTestId('CheckboxMonth' + (i + 1))).toBeInTheDocument();
    }
});

it('selects a month correctly', () => {
    const jestFunc = jest.fn();
    const dummyFunc = () => {};
    const dummyObj = [
        { monthId: 1, checked: false },
        { monthId: 2, checked: false },
        { monthId: 3, checked: false },
    ];
    const { getByTestId } = render(
        <SeasonCheckBoxGroup
            label=""
            seasonId={0}
            handleSeasonClicked={dummyFunc}
            handleMonthClicked={jestFunc}
            months={dummyObj}
            reportError={dummyFunc}
        />
    );
    const checkbox = getByTestId('CheckboxMonth1');
    fireEvent.click(checkbox);

    expect(jestFunc).toHaveBeenCalledTimes(1);
});

it('selects a season correctly', () => {
    const jestFunc = jest.fn();
    const dummyFunc = () => {};
    const dummyObj = [
        { monthId: 1, checked: false },
        { monthId: 2, checked: false },
        { monthId: 3, checked: false },
    ];
    const { getByTestId } = render(
        <SeasonCheckBoxGroup
            label=""
            seasonId={0}
            handleSeasonClicked={jestFunc}
            handleMonthClicked={dummyFunc}
            months={dummyObj}
            reportError={dummyFunc}
        />
    );
    const checkbox = getByTestId('CheckboxSeasonNum0');
    fireEvent.click(checkbox);

    expect(jestFunc).toHaveBeenCalledTimes(1);
});
