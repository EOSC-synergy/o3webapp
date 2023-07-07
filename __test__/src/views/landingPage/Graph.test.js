import Graph from '../../../../src/views/landingPage/Graph';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createTestStore } from '../../../../src/store';
import { REQUEST_STATE } from '../../../../src/services/API/apiSlice';

jest.mock('react-apexcharts', () => {
    return {
        __esModule: true,
        default: () => {
            return <div>Graph Component</div>;
        },
    };
});

const mockDispatch = jest.fn();
const mockSelector = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockSelector,
}));

let store;
describe('tests graph component rendering', () => {
    beforeEach(() => {
        store = createTestStore();
    });

    it.skip('renders the chart component if request was successfully', () => {
        mockSelector
            .mockReturnValueOnce('tco3_zm')
            .mockReturnValueOnce('title')
            .mockReturnValueOnce({ years: { minX: 100, maxX: 200 } })
            .mockReturnValueOnce({ minX: 100, maxX: 200 })
            .mockReturnValueOnce({
                status: REQUEST_STATE.success,
                data: [],
                error: null,
            })
            .mockReturnValueOnce({
                modelGroups: {},
            })
            .mockReturnValueOnce(false)
            .mockReturnValueOnce('tco3_zm')
            .mockReturnValueOnce('title')
            .mockReturnValueOnce({ years: { minX: 100, maxX: 200 } })
            .mockReturnValueOnce({ minX: 100, maxX: 200 })
            .mockReturnValueOnce({
                status: REQUEST_STATE.success,
                data: [],
                error: null,
            })
            .mockReturnValueOnce({
                modelGroups: {},
            })
            .mockReturnValueOnce(false);

        const windowSpy = jest.spyOn(document, 'getElementById');

        windowSpy.mockReturnValue({ offsetHeight: 0 });

        const { container } = render(
            <Provider store={store}>
                <Graph />
            </Provider>
        );

        expect(container).toHaveTextContent('Graph Component');
    });

    it.skip('renders an error message and calls the reportError function', () => {
        const reportedErrorMessage = 'Something went wrong :(';

        mockSelector
            .mockReturnValueOnce('tco3_zm')
            .mockReturnValueOnce({
                status: REQUEST_STATE.error,
                data: [],
                error: reportedErrorMessage,
            })
            .mockReturnValueOnce({
                modelGroupList: [],
                modelGrous: {},
            })
            .mockReturnValueOnce('tco3_zm')
            .mockReturnValueOnce({
                status: REQUEST_STATE.error,
                data: [],
                error: reportedErrorMessage,
            })
            .mockReturnValueOnce({
                modelGroupList: [],
                modelGrous: {},
            });

        const reportError = jest.fn();

        const { container } = render(
            <Provider store={store}>
                <Graph reportError={reportError} />
            </Provider>
        );

        expect(container).toHaveTextContent(reportedErrorMessage);
        expect(reportError).toHaveBeenCalledWith(reportedErrorMessage);
    });
});
