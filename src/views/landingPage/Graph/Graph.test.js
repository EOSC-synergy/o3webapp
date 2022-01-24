import Graph from './Graph'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import {createTestStore} from "../../../store/store"

let store;
beforeEach(() => {
  store = createTestStore();
}); 

jest.mock('react-apexcharts', () => {
    return {
        __esModule: true,
        default: () => {
            return <div />
        },
    }
})
jest.mock('apexcharts', () => ({ exec: jest.fn(() => { return new Promise((resolve) => { resolve("uri") }) }) }));

let store;
describe('tests graph component rendering', () => {
    beforeEach(() => {
        store = createTestStore();
    });

test.only('Renders OK', async () => {
    const { container } = render(<Provider store={store}><Graph /></Provider>);
    expect(container).toMatchSnapshot();
    it('Renders OK', async () => {
        const { container } = render(<Provider store={store}>
            <Graph />
        </Provider>
        );
        expect(container).toMatchSnapshot();
    });
});})