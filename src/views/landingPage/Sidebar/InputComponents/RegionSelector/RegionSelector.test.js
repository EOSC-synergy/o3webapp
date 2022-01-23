import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux'
import RegionSelector from './RegionSelector';
import { createTestStore } from "../../../../../store/store"

let store
beforeEach(() => {
    store = createTestStore();
});

it('renders without crashing', () => {
    render(<>
        <Provider store={store}>
            <RegionSelector reportError={() => {}} />
        </Provider>
    </>)
});

it('renders correctly', () => {

    const { container } = render(<>
        <Provider store={store}>
            <RegionSelector reportError={() => {}} />
        </Provider>
    </>);

    expect(container).toMatchSnapshot();
});