import { not, arraysEqual } from 'utils/arrayOperations';

let a: number[], b: number[];

describe('not works expectedly', () => {
    it('works with no intersection', () => {
        const a = [1, 2, 3];
        const b = [4, 5, 6];
        expect(not(a, b)).toStrictEqual([1, 2, 3]);
        expect(not(b, a)).toStrictEqual([4, 5, 6]);
    });

    it('works with some intersection', () => {
        a = [1, 2, 3];
        b = [2, 3, 4];
        expect(not(a, b)).toStrictEqual([1]);
        expect(not(b, a)).toStrictEqual([4]);
    });

    it('works with full intersection', () => {
        a = [1, 2, 3];
        b = [1, 2, 3];
        expect(not(a, b)).toStrictEqual([]);
        expect(not(b, a)).toStrictEqual([]);
    });

    it('works with an empty array', () => {
        a = [1, 2, 3];
        b = [];
        expect(not(a, b)).toStrictEqual([1, 2, 3]);
        expect(not(b, a)).toStrictEqual([]);
    });

    it('works with double elements', () => {
        a = [1, 2, 3];
        b = [1, 1, 1];
        expect(not(a, b)).toStrictEqual([2, 3]);
        expect(not(b, a)).toStrictEqual([]);
    });
});

describe('arraysEqual works expectedly', () => {
    it('should recognize equal arrays as so', () => {
        a = [1, 2, 3, 4];
        b = [1, 2, 3, 4];
        expect(arraysEqual(a, b)).toEqual(true);
    });

    it('should recognize the same array as equal', () => {
        a = [1, 2, 3, 4];
        expect(arraysEqual(a, a)).toEqual(true);
    });

    it('should recognize not equal arrays (of same length) as so', () => {
        a = [1, 2];
        b = [1, 3];
        expect(arraysEqual(a, b)).toEqual(false);
    });

    it('should recognize permutation of array as not equal', () => {
        a = [1, 2];
        b = [2, 1];
        expect(arraysEqual(a, b)).toEqual(false);
    });

    it('should recognize not equal arrays (of differnt length) as so', () => {
        a = [1, 2, 3];
        b = [4, 5, 6];
        expect(arraysEqual(a, b)).toEqual(false);
    });
});
