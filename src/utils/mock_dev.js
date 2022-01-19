/**
 * mocks a sleeping function; used for dev reasons
 * @param {int} ms the number of milisecons the program should sleep
 * @returns a promise waiting ms milisecons
 * @todo after getAvailablePlotTypes is connect remove this function
 */
export  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}