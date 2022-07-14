import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import authConfig from '../config/authConfig';

export default function authToken(req: Request, res: Response, next: NextFunction){

  const authHeader = req.headers.authorization

  const token = authHeader && authHeader.split(' ')[1]

  if (!token) 
    return res.status(401).send({ error: 'No token provided'})

  jwt.verify(token, authConfig.secret, (err, access) => {
    if (err) return res.status(403).send({ error: err.message })
    req.access = access
    next()
  })

}