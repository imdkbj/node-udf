const _udf = require("../index");

let udf = new _udf();

const delay = async () => {
  console.log("Hello1");
  await udf.delay(2000);
  console.log("Hello after 2 sec");
};

const stringToJSON = () => {
  let output = udf.stringToJSON("fname=deepak\nlname=kumar");
  console.log(output);
};

const isAlphaNumeric = () => {
  let output = udf.isAlphaNumeric("abcdxtyz", false);
  console.log(output);
};

const insertInToArray = () => {
  let output = udf.insertInToArray(["A", "C", "D"], 1, "B");
  console.log(output);
};

const convertToTradingSymbol = () => {
  //   let output = udf.convertToTradingSymbol("NIFTY 5 jan 23 18100 CE");
  let output = udf.convertToTradingSymbol("TECHM JAN 23 1020 CE");
  console.log(output);
};

const toBuffer = () => {
  let output = udf.toBuffer("abc");
  console.log(output);
};

const toSTR = () => {
  let output = udf.toSTR("YWJj");
  console.log(output);
};

const properCase = () => {
  let output = udf.properCase("YWJj");
  console.log(output);
};

const convertToTable = async () => {
  try {
    console.log(udf.prototype);
    let output = await udf.convertToTable(msg_arr, null, false, false, " ");
    console.log(output);
  } catch (e) {
    console.log(e);
  }
};

let msg_arr = [
  ["Telegram ID", "user_telegram_id"],
  ["Name", "toSTR(userfullname)"],
  ["Mobile", "mobile"],
  ["Email", "emailid"],
  ["Payment", "pg"],
  ["Amount", "rupee + amt"],
  ["Validity", "days" + " days"],
];

let msg = `Done! Congratulations on your new bot. You will find it at t.me/webloginbot. You can now add a description, about section and profile picture for your bot, see /help for a list of commands. By the way, when you've finished creating your cool bot, ping our Bot Support if you want a better username for it. Just make sure the bot is fully operational before you do this.

Use this token to access the HTTP API:
sd:AAE0lb2yevrfQ1jbMNlxdfddddddYdnZjFGKgd6oN-csd...
Keep your token secure and store it safely, it can be used by anyone to control your bot.

For a description of the Bot API, see this page: https://core.telegram.org/bots/api`;
parseBOTToken = () => udf.parseBOTToken(msg);

// parseBOTToken();

convertToTradingSymbol();
