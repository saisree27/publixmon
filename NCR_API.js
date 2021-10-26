function createHMAC(sharedKey, secretKey, httpMethod, requestURL, contentType, nepOrganization, nepServiceVersion, contentMD5, nepApplicationKey, nepCorrelationID,  nepEnterpriseUnit) {
  const cryptojs = require('crypto-js');
  const uri = requestURL.trim().replace(/^https?:\/\/[^\/]+\//, '/');
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
async function apiBackend(){
  const fetch = require("node-fetch");
  let tlogIDs=[]
  let productNames=[]
      try{
        date= new Date()
        res = await fetch("https://gateway-staging.ncrcloud.com/transaction-document/transaction-documents/find", {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': createHMAC("9a5809533556487f88634eb416feb3f8","e342e54705404e35a398e5320836e2e8", "POST", "https://gateway-staging.ncrcloud.com/transaction-document/transaction-documents/find", "application/json", "test-drive-da9200603a984026a1e16"),
                'nep-organization': "test-drive-da9200603a984026a1e16",
                'nep-enterprise-unit': "5d6aa3ce35514d3b9b33ca5e131001ca",
                'Date': date.toGMTString()
              },
            body: JSON.stringify({
                  "fromTransactionDateTimeUtc": {
                    "dateTime": "2020-01-01T00:00:00.000Z"
                  },
                  "toTransactionDateTimeUtc": {
                    "dateTime": "2021-01-01T00:00:00.000Z"
                  }
                })
        })
        jsonData = await res.json()
        await Promise.all(jsonData.pageContent.map(x=> tlogIDs.push(x.tlogId)))
        await Promise.all(tlogIDs.map(async function(x){
          date= new Date()
          res = await fetch("https://gateway-staging.ncrcloud.com/transaction-document/transaction-documents/"+x, {
              method:'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': createHMAC("9a5809533556487f88634eb416feb3f8","e342e54705404e35a398e5320836e2e8", "GET", "https://gateway-staging.ncrcloud.com/transaction-document/transaction-documents/"+x, "application/json", "test-drive-da9200603a984026a1e16"),
                  'nep-organization': "test-drive-da9200603a984026a1e16",
                  'nep-enterprise-unit': "5d6aa3ce35514d3b9b33ca5e131001ca",
                  'Date': date.toGMTString()
                }
          })
          jsonData= await res.json()
          productNames.push(jsonData.tlog.items[0].productName)
        }))
    } catch(error) {
      console.log(error)
    }
    NFTProduct=productNames[Math.floor(Math.random() * productNames.length)]
    NFTProduct = NFTProduct.replace(/\s/g, '');
    console.log("https://image-stg-cdn.ncrcloud.com/test-drive-da9200603a984026a1e16-dce174a0cb0a4bc4b8cd7e675b6aa570/image-container/"+NFTProduct+".jpeg")
}
apiBackend()




