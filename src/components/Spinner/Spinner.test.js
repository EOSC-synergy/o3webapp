import { Spinner } from "./Spinner"; 
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe("testing spinner rendering", () => {
    it('renders without crashing', () => {
        render(<Spinner />);
    });

    it('renders OK', () => {
        const { container } = render(<Spinner />);
        expect(container).toMatchSnapshot();
    });

    it('displays the input text', () => {
        const { container } = render(<Spinner text={"loading"}/>)
        expect(container).toHaveTextContent("loading");
    });

});