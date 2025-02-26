import express from "express";
const app = express();
import cors from "cors";
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "ddc8ac2af871105cf2d5edaabc248b10d683d682": 100,
  "c0839351e569259cce6242ccf347280d8405daa6": 50,
  "e64734e476035599a6d86a17bebbae402dcc3605": 75,
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
