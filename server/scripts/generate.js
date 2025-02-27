
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";


const privateKey = secp256k1.utils.randomPrivateKey();
const publicKey = secp256k1.getPublicKey(privateKey); // publicKey is very long so change it to a keccak256 address

const format = keccak256(publicKey.slice(1)); // slice off the first "format" byte
const keccakPublicAddress = format.slice(-20); // use only the last 20 bytes for the address

console.log(`private key: ${toHex(privateKey)}`);
console.log(`public key: ${toHex(publicKey)}`);
// console.log(`keccak public key: ${toHex(keccakPublicAddress)}`);