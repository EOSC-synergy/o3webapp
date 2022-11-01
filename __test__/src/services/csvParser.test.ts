import { generateCsv } from 'services/csvParser';

describe('tests the csv generation', () => {
    it('generates a correct csv from an array of objects', () => {
        const data = [
            { col1: 1, col2: 2, col3: 3 },
            { col1: 4, col2: 5, col3: 6 },
            { col1: 7, col2: 8, col3: 9 },
        ];

        expect(generateCsv(data)).toEqual(
            '"col1","col2","col3"\r\n' + '"1","2","3"\r\n' + '"4","5","6"\r\n' + '"7","8","9"\r\n'
        );
    });
});
