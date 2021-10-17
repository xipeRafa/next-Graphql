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
      type Order {
            id: ID
            order: [OrderGroup]
            total: Float
            customer: ID
            seller: ID
            date: String
            state: OrderState
      }
      type OrderGroup{
            id: ID
            quantity: Int
            name: String
            price: Float
      }
      type TopCustomer {
            total: Float
            customer: [Customer]
      }
      type TopSeller {
            total: Float
            seller: [User]
      }

      input UserInput{
            name:String!
            lastName:String!
            email:String!
            password:String!
      }
      input InputAutentication{
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
      input OrderProductInput {
            id: ID
            quantity: Int
            name: String
            price: Float
      }

      input OrderInput { 
            order: [OrderProductInput]
            total: Float
            customer: ID
            state: OrderState
      } #schema

      enum OrderState {
            PENDING
            COMPLETED
            CANCELED
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
           getCustomer(id: ID!): Customer

            # Orders
            getOrders: [Order]
            getOrdersBySeller: [Order] 
            getOrderById(id: ID!): Order
            getOrdersByState(state: String!): [Order]

            # Advanced Searches
            bestCustomers: [TopCustomer]
            bestSellers: [TopSeller]
            searchProductByName(text: String!) : [Product]
     }

     type Mutation{
           # Users
           newUser(input:UserInput): User
           autenticationUser(input:InputAutentication): Token

           # Products
           newProduct(input:ProductInput): Product
           editProduct(id:ID!, input:ProductInput): Product
           deleteProduct(id:ID!):String

           # Customers
           newCustomer(input:CustomerInput): Customer
           edithCustomer(id:ID!, input:CustomerInput): Customer
           deleteCustomer(id:ID!): String

            # Orders
            newOrder(input: OrderInput): Order
            editOrder(id: ID!, input: OrderInput): Order
            deleteOrder(id: ID!): String

     }

`
module.exports = typeDefs