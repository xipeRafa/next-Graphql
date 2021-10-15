const { ApolloServer }=require('apollo-server') 
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')

const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ()=>{
            const myContext = "hola"

            return {
                  myContext
            }
      }
})

//running
server.listen().then( ({url}) =>{
      console.log(`servidor corriendo en ${url}`)
})