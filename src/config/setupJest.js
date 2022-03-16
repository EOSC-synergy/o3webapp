// adding code to this file will ensure that jest
// executes it before each new unit test

// This allows to add a custom handler for left-over
// unhandled promises. Default is empty. 
process.on('unhandledRejection', () => {});