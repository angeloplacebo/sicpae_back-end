import express from 'express';
import mongoose from 'mongoose';

import * as dotenv from 'dotenv';

import userRoute from './routes/user'

dotenv.config();

mongoose.connect(process.env.DATABASE_URL!)

const db = mongoose.connection
const app = express();

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected do Database'))

app.use(express.json())
app.use(userRoute)

app.listen(process.env.AUTH_PORT || 3333, () => console.log('Server started at port:', process.env.AUTH_PORT))
