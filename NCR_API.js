export function createHMAC(sharedKey, secretKey, httpMethod, requestURL, contentType, nepOrganization, nepServiceVersion, contentMD5, nepApplicationKey, nepCorrelationID,  nepEnterpriseUnit) {
  const sdk = require('postman-collection');
  const cryptojs = require('crypto-js');
  const url = new sdk.Url(requestURL);
  const uri = encodeURI(url.getPathWithQuery());
  const d = new Date();
  d.setMilliseconds(0);
  const time = d.toISOString();
  const oneTimeSecret = secretKey + time;
  let toSign = httpMethod + "\n" + uri;
  if (contentType) {
    toSign += "\n" + contentType.trim();
  }
  if (contentMD5) {
    toSign += "\n" + contentMD5.trim();
  }
  if (nepApplicationKey) {
    toSign += "\n" + nepApplicationKey.trim();
  }
  if (nepCorrelationID) {
    toSign += "\n" + nepCorrelationID.trim();
  }
  if (nepOrganization) {
    toSign += "\n" + nepOrganization.trim();
  }
  if (nepServiceVersion) {
    toSign += "\n" + nepServiceVersion.trim();
  }
  const key = cryptojs.HmacSHA512(toSign, oneTimeSecret);
  const accessKey = sharedKey + ":" + cryptojs.enc.Base64.stringify(key);
  return "AccessKey " + accessKey;
}

// const fetch = require("node-fetch");
// date= new Date()
// fetch("https://gateway-staging.ncrcloud.com/catalog/v2/items/banana", {
//         method:'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': createHMAC("9a5809533556487f88634eb416feb3f8","e342e54705404e35a398e5320836e2e8", "GET", "https://gateway-staging.ncrcloud.com/catalog/v2/items/banana", "application/json", "test-drive-da9200603a984026a1e16"),
//             'nep-organization': "test-drive-da9200603a984026a1e16",
//             'nep-enterprise-unit': "5d6aa3ce35514d3b9b33ca5e131001ca",
//             'Date': date.toGMTString()
//           }
// }).then((res)=>res.json()).then((data)=> console.log(data))

