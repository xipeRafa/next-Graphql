const User = require('../models/User')
const Product = require('../models/Product')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config({path:'.env'})

const crearToken=(user, secretekey, expiresIn)=>{
      const {id,name,lastName,email} = user
      return jwt.sign({id, email, name, lastName}, secretekey, {expiresIn})
}

const resolvers = {
      Query:{ 
            getUser: async(_, {token})=>{
                  const userId = await jwt.verify(token, process.env.SECRETEKEY)
                  return userId
            }
      },
      Mutation:{
            newUser: async(_,{input},ctx,info)=>{
                  const {email, password}=input

                  const isUser = await User.findOne({email})//revisar si ya esxiste
                  if(isUser){ throw new Error('El usuario ya existe') }

                  const salt = await bcryptjs.genSalt(10) 
                  input.password = await bcryptjs.hash(password, salt)

                  try {      
                        const user = new User(input)
                        user.save()
                        return user
                  } catch (error) { console.log(error) }
            },
            autenticationUser: async(_,{input})=>{
                  const {email, password}=input

                  const isUserA = await User.findOne({email}) //revisar si ya esxiste
                  if(!isUserA){ throw new Error('El usuario No existe') }
                 
                  const rightPassword = await bcryptjs.compare(password, isUserA.password)
                  if(!rightPassword){ throw new Error('El passwors es incorrecto') }  // revisar password 

                  return { token: crearToken(isUserA, process.env.SECRETEKEY, '24hrs' ) }    //crear el token
            },
            newProduct: async(_,{input})=>{
                  try {
                       const product = new Product(input) 
                       const result = await product.save()
                       return result
                  } catch (error) {
                        console.log(error)
                        console.log('ERROR EN PRODUCT')
                  }
            }
      }
}
module.exports=resolvers