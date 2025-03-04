import express from "express";
const app = express();
import cors from "cors";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "02956b46019ae74862a5aa9cb65828ef94cb181698b867b23c11c0e3501bc1e65e": 100, // priv key 42bcd3be4be0b52795c9f7889b9a6a2c34f6b92953fdd0ac080087af633aafc0
  "02ce0157aba80985ad656e67fb77d8a8cf35435ee717b7b54ebc9ba6fb8f4bbaaa": 50, // priv key c798d2524b243347fd3e0089d724829dca9f42f28b7c788277781bceedb91c98
  "039c57a1dff3d1943b59778bdea81b23d84f2dced2e4927a831b2b972fee790254": 75, // priv key 1d148116aa28dfec43d21fde11c673de8d5dcea3693debb7a1b80bbe63b24647
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: get a signature from the client-side application
  // recover the public address from the signature
  console.log("✅ Server received request");
  try {

  // 1. reconstruct the transactionMsg
  const { sender, recipient, amount, signature } = req.body;
  const transactionMsg = {
    sender,
    recipient,
    amount
  }

  // 2. convert the transactionMsg to JSON string for utf8ToBytes
  const jsonMsg = JSON.stringify(transactionMsg);

  // 3. hash the transaction message with keccak256
  // utf8ToBytes because keccak256 expects raw bytes not json string
  const hashedMsg = keccak256(utf8ToBytes(jsonMsg));

  // 5. extract the signature values and convert them back to BigInt
  const rHex = r;
  const sHex = s;

  console.log(typeof rHex);
  console.log(typeof sHex);


  // 6. create a secp256k1 signature using the existing rBigInt, sBigInt and the recovery sent from the client
  const signObj = secp256k1.sign(r, s, signature.recovery);
  console.log("hello")
  
  // 7. recover the public key from the signature
  const recoveredPublicKey = secp256k1.recoverPublicKey(hashedMsg, signObj, signature.recovery);

  // 8. convert the public key to ethereum style address
  const publicKeyAddress = recoveredPublicKey.slice(1);
  const addressHash = keccak256(publicKeyAddress);
  const address = `0x${bytesToHex(addressHash).slice(-40)}`;

  // 9. compare recovered address with the sender
  if (address.toLowerCase() !== sender.toLowerCase()) {
    return res.status(400).send({ message: "Recovered address does not match the sender!" });
  }
  
  // send success response
  return res.status(200).send({ message: "✅ Signature verified successfully!" });
} catch {
  // send error response
  console.log("❌ Signature verification failed")
  return res.status(400).send({ message: `Signature verification failed`});
}
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
