var rp = require('request-promise');

async function sendDingtalkMsg(url, msg) {
  var options = {
    method: 'POST',
    uri: url,
    body: {
      "msgtype": "text",
      "text": {
        "content": msg
      },
      "at": {
        "isAtAll": false
      }
    },
    json: true // Automatically stringifies the body to JSON
  };

  return await rp(options)
}
module.exports = sendDingtalkMsg
