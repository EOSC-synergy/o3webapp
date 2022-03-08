import { union, not, intersection } from "./arrayOperations";

it('union works expectedly',  () => {
    // no intersection
    let a = [1, 2, 3];
    let b = [4, 5, 6];
    expect(union(a, b)).toStrictEqual([1, 2, 3, 4, 5, 6]);

    // some intersection
    a = [1, 2, 3];
    b = [2, 3, 4];
    expect(union(a, b)).toStrictEqual([1,2,3,4]);

    // full intersection
    a = [1, 2, 3];
    b = [1, 2, 3];
    expect(union(a, b)).toStrictEqual([1,2,3]);

    // empty array
    a = [1, 2, 3];
    b = [];
    expect(union(a, b)).toStrictEqual([1,2,3]);


    // double elements
    a = [1, 2, 3];
    b = [1, 1, 1];
    expect(union(a, b)).toStrictEqual([1,2,3]);
});


it('intersection works expectedly',  () => {
    // no intersection
    let a = [1, 2, 3];
    let b = [4, 5, 6];
    expect(intersection(a, b)).toStrictEqual([]);

    // some intersection
    a = [1, 2, 3];
    b = [2, 3, 4];
    expect(intersection(a, b)).toStrictEqual([2,3]);

    // full intersection
    a = [1, 2, 3];
    b = [1, 2, 3];
    expect(intersection(a, b)).toStrictEqual([1,2,3]);

    // empty array
    a = [1, 2, 3];
    b = [];
    expect(intersection(a, b)).toStrictEqual([]);


    // double elements
    a = [1, 2, 3];
    b = [1, 1, 1];
    expect(intersection(a, b)).toStrictEqual([1]);
});

it('not works expectedly',  () => {
    // no intersection
    let a = [1, 2, 3];
    let b = [4, 5, 6];
    expect(not(a, b)).toStrictEqual([1, 2, 3]);
    expect(not(b, a)).toStrictEqual([4, 5, 6]);

    // some intersection
    a = [1, 2, 3];
    b = [2, 3, 4];
    expect(not(a, b)).toStrictEqual([1]);
    expect(not(b, a)).toStrictEqual([4]);

    // full intersection
    a = [1, 2, 3];
    b = [1, 2, 3];
    expect(not(a, b)).toStrictEqual([]);
    expect(not(b, a)).toStrictEqual([]);

    // empty array
    a = [1, 2, 3];
    b = [];
    expect(not(a, b)).toStrictEqual([1,2,3]);
    expect(not(b, a)).toStrictEqual([]);


    // double elements
    a = [1, 2, 3];
    b = [1, 1, 1];
    expect(not(a, b)).toStrictEqual([2,3]);
    expect(not(b, a)).toStrictEqual([]);
});