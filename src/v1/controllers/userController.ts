import { Response, Request } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User, { IUser } from '../models/user'
import authConfig from '../config/authConfig'
import RefreshToken from '../models/refreshToken'

function generateAccessToken(user: IUser, refreshToken = false){

  let payload = {
    sub: user._id,
    name: user.username,
    aud: 'SICPAE API',
  }

  if (refreshToken)
    return jwt.sign(payload, authConfig.refresh_secret, {algorithm: 'HS256'})

  return jwt.sign(payload, authConfig.secret, {algorithm: 'HS256', expiresIn: authConfig.expiresIn})

}


const UserController = {

  async register(req: Request, res: Response) {

    //check if the user already exists
    const { username, password } = req.body

    const userExist = await User.findOne({ username: username })
    if (userExist) return res.status(400).send('username already exist')

    const user = new User({
      username,
      password
    })

    try {
      const savedUser = await User.create(user)
      res.status(201).send({ user: savedUser._id })
    } catch (err) {
      res.send(err)
    }
  },

  async authenticate(req: Request, res: Response) {

    const { username, password } = req.body
    const user = await User.findOne({ username }).select('+password +refreshToken')

    if (!user) 
      return res.status(400).send({ error: 'Username not found' })

    if(!await bcrypt.compare(password, user.password))
      return res.status(400).send({ error: 'Invalid password' })

    let data = { "accessToken": generateAccessToken(user) }

    if (user.refreshToken){
      const token = generateAccessToken(user, true)
      await RefreshToken.create({token})
      data["refreshToken"] = token
    } 
    res.send(data)

  },

  async token(req: Request, res: Response){
    
    const token = req.body.token

    if (!token) return res.sendStatus(401)

    let tokenExists = await RefreshToken.findOne({token})

    if (!tokenExists || !tokenExists.active)
      return res.sendStatus(403)

    jwt.verify(token, authConfig.refresh_secret, (err, access) => {
      if (err) return res.sendStatus(403).send({ error: err.message })
      let user = new User({ id_: access.sub, name: access.name })
      const accessToken = generateAccessToken( user, false)

      res.send({accessToken})
    })

  },

  async logout(req: Request, res: Response){
    
    const token = req.body.token

    if (token)
      await RefreshToken.findOneAndDelete({token})
    
    return res.sendStatus(204)

  }

}

export default UserController