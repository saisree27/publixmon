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
        res = null // REMOVED API KEY
        jsonData = await res.json()
        await Promise.all(jsonData.pageContent.map(x=> tlogIDs.push(x.tlogId)))
        await Promise.all(tlogIDs.map(async function(x){
          date= new Date()
          res = null // REMOVED API KEY
          jsonData= await res.json()
          productNames.push(jsonData.tlog.items[0].productName)
        }))
    } catch(error) {
      console.log(error)
    }
    NFTProduct=productNames[Math.floor(Math.random() * productNames.length)]
    NFTProduct = NFTProduct.replace(/\s/g, '');
}
apiBackend()