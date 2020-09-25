var common = exports;

common.delay = (ms) => new Promise((res) => setTimeout(res, ms));