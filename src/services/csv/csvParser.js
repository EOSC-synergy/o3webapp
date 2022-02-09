/**
 * This function translates an javascript object or a json into a string formatted 
 * as in csv file format. 
 * 
 * Example input format: An array with objects where each element represents a line in the csv file
 * and each key with corresponding value represents a column.
 * 
 * @param {object or array} objArray contains the data that should be converted to csv
 * @returns a string containing the csv formatted data
 */
export function generateCsv(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var line = '';
    var result = '';
    var columns = [];

    var i = 0;
    for (var j = 0; j < array.length; j++) {
      for (var key in array[j]) {
        var keyString = key + "";
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

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var j = 0; j < columns.length; j++) {
        var value = (typeof array[i][columns[j]] === 'undefined') ? '' : array[i][columns[j]];
        var valueString = value + "";
        line += '"' + valueString.replace(/"/g, '""') + '",';
      }

      line = line.slice(0, -1);
      result += line + '\r\n';
    }

    return result;
}
