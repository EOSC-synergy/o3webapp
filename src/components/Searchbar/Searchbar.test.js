import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import SearchBar from './Searchbar';

describe('test searchbar rendering', () => {
    
    it('renders without crashing', () => {
        render(<SearchBar inputArray={[]} foundIndicesCallback={() => {}}/>);
    });

    
    it('renders correctly', () => {
        const { container } = render(<SearchBar inputArray={[]} foundIndicesCallback={() => {}}/>);
        expect(container).toMatchSnapshot();
    });
    
    it('renders the input of the sarchbar', () => {
        const { getByTestId } = render(<SearchBar inputArray={[]} foundIndicesCallback={() => {}}/>);
        const input = getByTestId("SearchbarInput");
        expect(input).toBeInTheDocument();
    });
    
    it('calls the handleInputChange method which should delegate to the correct methods', () => {
        const callback = jest.fn();
        const { getByTestId } = render(<SearchBar inputArray={[]} foundIndicesCallback={callback}/>);
        const input = getByTestId("SearchbarInput");
        userEvent.type(input, "abc{enter}");
        expect(callback).toHaveBeenCalled();
    });
});

describe('test searchbar functionality', () => {
    it('returns the correct indices after searching for a string (obj array)', () => {
        const callback = jest.fn();
        const inputArray = [{model: "modelA"}, {model: "modelB"}, {}, {model: "modelA+"}];
        const { getByTestId } = render(<SearchBar inputArray={inputArray} foundIndicesCallback={callback}/>);
        const input = getByTestId("SearchbarInput");
        userEvent.type(input, "modelA{enter}");
        expect(callback.mock.calls[0][0]).toEqual([0, 3]); // expect the callback to be called with the correct indices
    });

    it('returns the correct indices after searching for a string (string array)', () => {
        const callback = jest.fn();
        const inputArray = ["hello", "world", "-hello-", "hell"];
        const { getByTestId } = render(<SearchBar inputArray={inputArray} foundIndicesCallback={callback}/>);
        const input = getByTestId("SearchbarInput");
        userEvent.type(input, "hello{enter}");
        expect(callback.mock.calls[0][0]).toEqual([0, 2]); // expect the callback to be called with the correct indices
    });

    it('returns the correct values after searching for a string (string array)', () => {
        const callback = jest.fn();
        const inputArray = ["hello", "world", "-hello-", "hell"];
        const { getByTestId } = render(<SearchBar inputArray={inputArray} foundIndicesCallback={callback} shouldReturnValues={true} />);
        const input = getByTestId("SearchbarInput");
        userEvent.type(input, "hello{enter}");
        expect(callback.mock.calls[0][0]).toEqual(["hello", "-hello-"]); // expect the callback to be called with the correct indices
    });

    it('returns the correct values after searching for a string (obj array)', () => {
        const callback = jest.fn();
        const inputArray = [{model: "modelA"}, {model: "modelB"}, {}, {model: "modelA+"}];
        const { getByTestId } = render(<SearchBar inputArray={inputArray} foundIndicesCallback={callback} shouldReturnValues={true} />);
        const input = getByTestId("SearchbarInput");
        userEvent.type(input, "modelA{enter}");
        expect(callback.mock.calls[0][0]).toEqual([{model: "modelA"}, {model: "modelA+"}]);
    });
});