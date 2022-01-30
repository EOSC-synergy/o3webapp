import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux'
import XAxisField from './XAxisField';
import { createTestStore } from "../../../../../store/store"

let store;
beforeEach(() => {
    store = createTestStore();
});

it('renders without crashing', () => {
    render(<>
        <Provider store={store}>
            <XAxisField reportError={() => {}} />
        </Provider>
    </>)
});

it('renders correctly', () => {

    const { container } = render(<>
        <Provider store={store}>
            <XAxisField reportError={() => {}} />
        </Provider>
    </>);

    expect(container).toMatchSnapshot();
});