/** @module CSV */

/**
 * This function translates a javascript object or a json into a string formatted
 * as in csv file format. 
 * 
 * Example input format: An array with objects where each element represents a line in the csv file
 * and each key with corresponding value represents a column.
 * 
 * @param {Array.<Object>} objArray contains the data that should be converted to csv
 * @returns a string containing the csv formatted data
 */
export function generateCsv(objArray) {
    const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let line = '';
    let result = '';
    const columns = [];

    let i = 0;
    for (let j = 0; j < array.length; j++) {
      for (let key in array[j]) {
        let keyString = key + "";
        keyString = '"' + keyString.replace(/"/g, '""') + '",';
        if (!columns.includes(key)) {
          columns[i] = key;
          line += keyString;
          i++;
        }
      }
    }

    line = line.slice(0, -1);
    result += line + '\r\n';

    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let j = 0; j < columns.length; j++) {
        const value = (typeof array[i][columns[j]] === 'undefined') ? '' : array[i][columns[j]];
        const valueString = value + "";
        line += '"' + valueString.replace(/"/g, '""') + '",';
      }

      line = line.slice(0, -1);
      result += line + '\r\n';
    }

    return result;
}
