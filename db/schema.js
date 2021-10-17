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
      type Customer{
            id:ID
            name:String
            lastName:String
            enterprise:String
            email:String
            phone:String
            seller:ID
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
      input CustomerInput{
            name:String!
            lastName:String!
            enterprise:String!
            email:String!
            phone:String
      } 

     type Query{
           #usuarios
           getUser(token:String!): User

           #getProducts
           getProducts: [Product]
           getProduct(id:ID!):Product

           # Customers
           getCustomers: [Customer]
           getCustomersBySeller: [Customer]
     }

     type Mutation{
           # Users
           newUser(input:userInput): User
           autenticationUser(input:inputAutentication):Token

           # Products
           newProduct(input:ProductInput): Product
           editProduct(id:ID!, input:ProductInput): Product
           deleteProduct(id:ID!):String

           # Customers
           newCustomer(input:CustomerInput): Customer

     }

`
module.exports = typeDefs