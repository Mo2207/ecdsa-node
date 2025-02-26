import express from "express";
const app = express();
import cors from "cors";
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
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
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
