const User = require('../models/User')
const Product = require('../models/Product')
const Customer = require('../models/Customer')
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
            },
            getProducts: async()=>{
                  try {
                      const products = await Product.find({})  
                      return products
                  } catch (error) {
                      console.log(error)  
                  }
            },
            getProduct: async(_, {id})=>{
                  //revisar si el producto existe o no
                  const product = await Product.findById(id)

                  if(!product){
                        throw new Error('Producto No enconrtrado')  
                  }
                  return product
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
            },
            editProduct: async(_, {id, input})=>{
                  //revisar si el producto existe o no
                  let product = await Product.findById(id)

                  if(!product){
                        throw new Error('Producto No enconrtrado')  
                  }
                  //guardar en base de datos
                  product = await Product.findOneAndUpdate(
                        { _id:id }, 
                        input, 
                        {new:true}
                  ) 

                  return product
            },
            deleteProduct: async(_,{id})=>{
                  //revisar si el producto existe o no
                  let product = await Product.findById(id)

                  if(!product){
                        throw new Error('Producto No enconrtrado')  
                  }
                  
                  //Eliminar
                  await Product.findOneAndDelete({_id:id})
                  return 'producto eliminado'
            },
            newCustomer: async(_, {input}, ctx)=>{
                
                  const { email } = input  
                  const customer = await Customer.findOne({ email });
                  if(customer) {  //verificar si el cliente ya esta registrado\
                      throw new Error('Ese cliente ya esta registrado');
                  }

                  //guardar en DB
                  const newCustomer = new Customer(input);
                  newCustomer.seller = ctx.user.id;  

                 //asignar el vendedor
                 /*  newCustomer.seller = "61690e1a2aeb8d611868840a";  */
      
                  try {
                      const result = await newCustomer.save();
                      return result;
                  } catch (error) {
                      console.log(error);
                  }
            }
      }
}
module.exports=resolvers