var udf = exports;
udf.delay = (ms) => new Promise((res) => setTimeout(res, ms));