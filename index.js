import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { portfolioRoute } from './routes/route.js';


dotenv.config();
const app = express();
// const PORT = 8000;

const PORT=process.env.PORT||8000;


app.use(cors());
app.use(express.json());


app.use('/portfolio',portfolioRoute)


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
