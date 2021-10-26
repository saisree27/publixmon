const StyleTransferImage = artifacts.require("StyleTransferImage");

contract("StyleTransferImage", accounts => {
    let date
    before(async () => {
        styletransferimage = await StyleTransferImage.new()

    })

     describe("Deployed StyleTransferImage", async () => {
        it("has an owner", async () => {
            let owner = await styletransferimage.owner()
            expect(owner).to.equal(accounts[0])
        })
        it("has a name", async () => {
            let name = await styletransferimage.name()
            expect(name).to.equal("StyleTransferImage")
        })
         it("has a symbol", async () => {
            let symbol = await styletransferimage.symbol()
            expect(symbol).to.equal("STI")
        })

        it("has correct tokenURI", async () => {
            let tokenURI = await styletransferimage.tokenURI(0)
            expect(tokenURI).to.equal("http://localhost:105/nft/0")
        })

        it("get function", async () => {
            let meta = await styletransferimage.get(0);
            console.log(meta[0]);
        })


      })


});
