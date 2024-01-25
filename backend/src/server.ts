import express, { Request, Response } from 'express';
import cors from 'cors';
import { IndexRouter } from './controller/v0/router';
import { config } from 'dotenv';
import swaggerDocs from './utils/swagger';

config();

export const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors())
app.use('/api/v0/', IndexRouter);

app.get('/', (req: Request, res: Response) => {
  return res.status(200).send("API root: '/api/v0/'");
});

app.listen(PORT, () => {
  console.log(`Server is available at http://localhost:${PORT}`);
  swaggerDocs(app, PORT)
  console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
  console.log(`Documentation(JSON) is available at http://localhost:${PORT}/docs.json`);
});