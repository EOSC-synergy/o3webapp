import Graph from './Graph'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ReactApexChart from "react-apexcharts";

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
    //screen.debug();
    expect(container).toMatchSnapshot();
    //expect(await screen.findByText('OCTS Plot')).toBeInTheDocument();
});