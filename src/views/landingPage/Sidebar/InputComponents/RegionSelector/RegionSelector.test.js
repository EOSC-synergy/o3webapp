import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux'
import RegionSelector from './RegionSelector';
import { createTestStore } from "../../../../../store/store"
import {setActivePlotId} from "../../../../../store/plotSlice/plotSlice";

let store;
beforeEach(() => {
    store = createTestStore();
    store.dispatch(setActivePlotId({plotId: "tco3_return"})); // this component is only for the 
});

describe("tests basic rendering", () => {
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
});
