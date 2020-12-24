const fetch = require("node-fetch");
const FormData = require("form-data");
const RRError = require("../errors/RRError");
module.exports = class Request {
  constructor(bot) {
    this.bot = bot;
  }

  make(path, method, options) {
    let headers = {};
    headers["User-Agent"] =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36";
    if (this.bot.cookie) headers["cookie"] = this.bot.cookie;
    if (options && options.headers)
      headers = Object.assign(options.headers, headers);
    const form = new FormData();
    if (options && options.body) {
      for (const body in options.body) {
        if (!options.body[body]) continue;
        form.append(body, options.body[body]);
      }
    }
    return new Promise(async (resolve, reject) => {
      const body = options && options.body ? form : undefined;
      try {
        this.bot.emit(
          "debug",
          `Trying to fetch content from ${path} with method ${method}.`
        );
        let res = await fetch(`${this.bot.baseUrl}${path}`, {
          method,
          headers,
          body
        });
        const responseData = res;
        res = await res.text();
        if (responseData != 200)
          return reject(
            new RRError(
              `Status ${responseData.status} from path ${path} with method ${method}.`
            )
          );
        this.bot.emit(
          "debug",
          `Successfully fetched content from ${path} with method ${method}.`
        );

        try {
          res = JSON.parse(res);
          if (res.error) return reject(new RRError(res.error_info[1]));
        } catch {
          if (!res.includes("<!DOCTYPE html>")) res = Buffer.from(res);
        }
        responseData.content = res;
        resolve(responseData);
      } catch (err) {
        reject(err);
      }
    });
  }
};
