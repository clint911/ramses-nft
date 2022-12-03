require("dotenv").config()
const API_URL = process.env.API_URL
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
//you can as well print the abi to your screen you sick bastard 
//console.log(JSON.stringify(contract.abi));
//using web3 to create our contract 
const contractAddress = "0xbc445D275Eb61A2E9822dfa8F65f16C4f29C9886";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

//lets mint our nft 
async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');//get latest nonce 

  //the transaction 
  const tx = {
    'from': PUBLIC_KEY,
    'to': contractAddress,
    'nonce': nonce,
    gas: 500000,
    'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
  }

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function(err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is:",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            )
          } else {
            console.log(
              "Something went wrong when submitting your transaction or it got dropped off by the node:",
              err
            )
          }
        }
      )
    })
    .catch((err) => {
      console.log("Promise failed:", err)
    })

}
mintNFT("ipfs://QmWNbjKHpLF86k6qsBkyybAMDFECDtY4UY9r61jbXAK8Lj");

