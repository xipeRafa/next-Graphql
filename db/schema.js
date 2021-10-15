const { gql }=require('apollo-server') 

//squema  
const typeDefs = gql`

      type User{
            id:ID
            name:String
            lastName:String
            email:String
            start:String
      }
      type Token{
            token:String
      }
      type Product{
            id:ID
            name:String
            stock:Int
            price:Float
            start:String
      }

      input userInput{
            name:String!
            lastName:String!
            email:String!
            password:String!
      }
      input inputAutentication{
            email:String!
            password:String!
      }
      input ProductInput{
            name:String!
            stock:Int!
            price:Float!
      } 

     type Query{
           #usuarios
           getUser(token:String!): User

           #getProducts
           getProducts: [Product]
           getProduct(id:ID!):Product
     }

     type Mutation{
           # Users
           newUser(input:userInput): User
           autenticationUser(input:inputAutentication):Token

           # Products
           newProduct(input:ProductInput): Product
           editProduct(id:ID!, input:ProductInput): Product
           deleteProduct(id:ID!):String
     }

`
module.exports = typeDefs