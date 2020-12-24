const express = require("express");
const app = express();
let bot = require("./src/bot/bot.js");
bot = new bot();

bot.on("ready", async cookie => {
  console.log(`Successfully logged in with the cookie: ${cookie}`);
});

bot.on("debug", info => {
  console.log(info);
});

bot.login("YOURUSERNAME", "YOURPASSWORD")

app.get("/", function(request, response) {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
