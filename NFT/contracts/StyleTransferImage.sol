pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StyleTransferImage is Ownable,ERC721 {
    struct Metadata {
        string productName;
        string mlModel;
    }
    Metadata[] MetaData;
    uint256 public tokenID;
    string private _currentBaseURI;

    constructor() ERC721("StyleTransferImage", "STI") {
        setBaseURI("http://localhost:8080/");
        mint("Apple","starry_night");
        mint("Mango","starry_night");
    }

    function mint(string memory _productName, string memory _mlModel) internal {
        Metadata memory metadata = Metadata({productName: _productName, mlModel: _mlModel});
        MetaData.push(metadata);
        super._mint(msg.sender,tokenID);
        tokenID++;


    }

    function claim(string memory _productName, string memory _mlModel) external returns (uint256) {
        mint(_productName, _mlModel);
        return tokenID;
    }

    function setBaseURI(string memory baseURI) internal {
        _currentBaseURI = baseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _currentBaseURI;
    }

    function get(uint256 tokenId) external view returns (Metadata memory) {
        return MetaData[tokenId];
    }

}
