const { ApolloServer }=require('apollo-server') 
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')

const connectDB = require('./config/db')
connectDB()

const jwt = require('jsonwebtoken')
require('dotenv').config({path:'.env'}) 

const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({req}) => {
            /*  console.log('headers:', req.headers['authorization'])  */
              const token = req.headers['authorization'] || ''; 
    
            if(token) {
                  try {
                        const user = jwt.verify(token, process.env.SECRETEKEY)
                        /*  console.log('user:', user)   */
                        return { user } 
                  }catch (error) {
                        console.log('Hubo un error');
                        console.log(error);
                  }
            }  
            //1.- create new user 2.- autentication 3.- use the JWT in authorization HEADERS(newCustomewr) 
            //4.- create new customer whit the last dates(name,lastname,enterprise,email,phone)  
      } 
})

server.listen().then( ({url}) =>{
      console.log(`servidor corriendo en ${url}`)
})