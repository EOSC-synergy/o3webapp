import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
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
        const { getByTestId, getByRole, getAllByRole } = render(
            <Provider store={store}>
                <LatitudeBandSelector reportError={() => {}} />
            </Provider>
        );

        userEvent.click(getByRole("button"));
        const element = getByTestId("LatitudeBandSelector-select-region");
        //userEvent.click(element);
        const options = getAllByRole("option");
        userEvent.click(options[2]);
        console.log(store.getState().plot.generalSettings.location);
        
        userEvent.click(options[options.length - 1]);
        

    });
    
});