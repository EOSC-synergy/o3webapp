import Graph from './Graph'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

jest.mock('react-apexcharts', () => {
    return {
      __esModule: true,
      default: () => {
        return <div />
      },
    }
})
jest.mock('apexcharts', () => ({ exec: jest.fn(() => { return new Promise((resolve) => { resolve("uri") }) }) }));


test.only('Renders OK', async () => {
    const { container } = render(<Graph />);
    expect(container).toMatchSnapshot();
});