import express from "express";
import 'dotenv/config';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Frontend Server ready at http://localhost:${PORT}`);
});

