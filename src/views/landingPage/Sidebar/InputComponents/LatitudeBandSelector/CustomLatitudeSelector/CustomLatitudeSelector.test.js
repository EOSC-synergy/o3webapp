import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux'
import CustomLatitudeSelector from "./CustomLatitudeSelector"
import { createTestStore } from "../../../../../../store/store"

let store;
beforeEach(() => {
    store = createTestStore();
});

it('renders without crashing', () => {
    render(<>
        <Provider store={store}>
            <CustomLatitudeSelector reportError={() => {}} />
        </Provider>
    </>)
});

it('renders correctly', () => {

    const { container } = render(<>
        <Provider store={store}>
            <CustomLatitudeSelector reportError={() => {}} /> 
        </Provider>
    </>);

    expect(container).toMatchSnapshot();
});

it('changes max. latitude correctly', () => {

    const { getByTestId } = render(<>
        <Provider store={store}>
            <CustomLatitudeSelector reportError={() => {}} /> 
        </Provider>
    </>);

    const maxLatSelector = getByTestId("maxLatSelector");
    fireEvent.change();


    // expect(container).toMatchSnapshot();
});


