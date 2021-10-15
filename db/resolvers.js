
const User = require('../models/User')
const bcryptjs = require('bcryptjs')
require('dotenv').config({path:'.env'})
const jwt = require('jsonwebtoken')

const crearToken=(user, secretekey, expiresIn)=>{
      const {id,name,lastName,email}=user

      return jwt.sign({id, email, name, lastName}, secretekey, {expiresIn})
}

const resolvers = {
      Query:{ 
            getUser:async(_, {token})=>{
                  const userId = await jwt.verify(token, process.env.SECRETEKEY)
                  return userId
            }
      },
      Mutation:{
            newUser:async(_,{input},ctx,info)=>{

                  const {email, password}=input

                  //revisar si ya esxiste
                  const isUser = await User.findOne({email})
                  if(isUser){
                        throw new Error('El usuario ya existe')
                  }

                  //password
                  const salt = await bcryptjs.genSalt(10) 
                  input.password = await bcryptjs.hash(password, salt)

                  //guardarlo en DB
                  try {
                        const user = new User(input)
                        user.save()
                        return user
                  } catch (error) {
                        console.log(error)
                  }
            },
            autenticationUser:async(_,{input})=>{
                  const {email, password}=input

                  //revisar si ya esxiste
                  const isUserA = await User.findOne({email})
                  if(!isUserA){
                        throw new Error('El usuario No existe')
                  }

                  //revisar si password es correcto
                  const rightPassword = await bcryptjs.compare(password, isUserA.password)
                  if(!rightPassword){
                        throw new Error('El passwors es incorrecto')
                  }

                  //crear el token
                  return {
                        token: crearToken(isUserA, process.env.SECRETEKEY, '24hrs' )
                  } 
            }
      }
}

module.exports=resolvers