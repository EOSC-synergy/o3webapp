/**
 * mocks a sleeping function; used for dev reasons
 * @param {int} ms the number of milliseconds the program should sleep
 * @returns a promise waiting ms milliseconds
 * @todo after getAvailablePlotTypes is connect remove this function
 */
export  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}