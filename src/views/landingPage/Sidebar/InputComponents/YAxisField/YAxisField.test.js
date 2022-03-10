import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux'
import YAxisField from './YAxisField';
import { createTestStore } from "../../../../../store/store"

describe("tests basic rendering", () => {
    let store;
    beforeEach(() => {
        store = createTestStore();
    });
    
    it('renders without crashing', () => {
        render(<>
            <Provider store={store}>
                <YAxisField reportError={() => {}} />
            </Provider>
        </>)
    });
    
    it('renders correctly', () => {
    
        const { container } = render(<>
            <Provider store={store}>
                <YAxisField reportError={() => {}} />
            </Provider>
        </>);
    
        expect(container).toMatchSnapshot();
    });
});