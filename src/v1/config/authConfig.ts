import * as dotenv from 'dotenv';

dotenv.config();

export default {
  secret: process.env.ACCESS_TOKEN_SECRET,
  refresh_secret: process.env.REFRESH_TOKEN_SECRET,
  expiresIn: "6h"
}