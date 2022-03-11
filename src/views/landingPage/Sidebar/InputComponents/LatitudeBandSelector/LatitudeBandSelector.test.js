import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux'
import LatitudeBandSelector from './LatitudeBandSelector';
import { createTestStore } from "../../../../../store/store"

let store;
beforeEach(() => {
    store = createTestStore();
});

describe("tests basic rendering", () => {
    it('renders without crashing', () => {
        render(<>
            <Provider store={store}>
                <LatitudeBandSelector reportError={() => {}} />
            </Provider>
        </>)
    });
    
    it('renders correctly', () => {
    
        const { container } = render(<>
            <Provider store={store}>
                <LatitudeBandSelector reportError={() => {}} />
            </Provider>
        </>);
    
        expect(container).toMatchSnapshot();
    });
});

describe("tests redux functionality", () => {
    
    it("updates the region accordingly", () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <LatitudeBandSelector reportError={() => {}} />
            </Provider>
        );

        const element = getByTestId("LatitudeBandSelector-select-region");
        

    });
    
});