// index.ts

import express from 'express';

import coordinator from './Routes/coordinator';
import dotenv from 'dotenv';
import { CustomError } from './Errors/CustomError';
import swaggerUI from 'swagger-ui-express';
import { swaggerSpec } from '../swaggerDoc';
import swagger from '../swagger.json';
import cronJobs from './Jobs/cronCoordinator';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', coordinator);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swagger));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log('here errro');
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.log(err);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  cronJobs();
});
