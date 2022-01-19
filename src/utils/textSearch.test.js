import { performSearch } from "./textSearch";

describe('test logic of search utility functions', () => {
    it('should find all element when empty string is passed', () => {
        const searchArray = ["a", "b", "c"];
        const result = performSearch(searchArray, "");
        expect(result).toEqual([...Array(searchArray.length).keys()]); // returns all indices of given array
    });

    it('should find the correct elements when an non-empty string is passed', () => {
        const searchArray = ["a", "b", "c"];
        const result = performSearch(searchArray, "a");
        expect(result).toEqual([0]); // returns all indices of given array
    });

    it('should find the correct elements when an non-empty string is passed (obj array)', () => {
        const searchArray = [{a: "a"}, {b: "b"}, {c: "c"}];
        const result = performSearch(searchArray, "b");
        expect(result).toEqual([1]); // returns all indices of given array
    });
});