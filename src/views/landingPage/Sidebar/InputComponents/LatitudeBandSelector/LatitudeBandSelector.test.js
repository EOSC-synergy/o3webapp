import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import LatitudeBandSelector from './LatitudeBandSelector';
import { createTestStore } from '../../../../../store/store';

let store;
beforeEach(() => {
    store = createTestStore();
});

describe('tests basic rendering', () => {
    it('renders without crashing', () => {
        render(
            <>
                <Provider store={store}>
                    <LatitudeBandSelector reportError={() => {}} />
                </Provider>
            </>
        );
    });

    it('renders correctly', () => {
        const { container } = render(
            <>
                <Provider store={store}>
                    <LatitudeBandSelector reportError={() => {}} />
                </Provider>
            </>
        );

        expect(container).toMatchSnapshot();
    });
});

describe('tests redux functionality', () => {
    it('updates the region accordingly in the store', () => {
        const { getByRole, getAllByRole } = render(
            <Provider store={store}>
                <LatitudeBandSelector reportError={() => {}} />
            </Provider>
        );

        userEvent.click(getByRole('button'));
        const options = getAllByRole('option');
        userEvent.click(options[2]);

        expect(store.getState().plot.generalSettings.location).toEqual({ minLat: -20, maxLat: 20 }); // Tropics
        userEvent.click(options[options.length - 1]);
    });

    it('displays a custom latitude band selector if custom region is selected', () => {
        const { getByRole, getAllByRole, container } = render(
            <Provider store={store}>
                <LatitudeBandSelector reportError={() => {}} />
            </Provider>
        );

        userEvent.click(getByRole('button'));
        const options = getAllByRole('option');

        expect(container).not.toHaveTextContent('Min. Lat');
        expect(container).not.toHaveTextContent('Max. Lat');
        userEvent.click(options[options.length - 1]);
        expect(container).toHaveTextContent('Min. Lat');
        expect(container).toHaveTextContent('Max. Lat');
    });
});
