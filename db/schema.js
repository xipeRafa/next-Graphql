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

     type Query{
           getUser(token:String!):User
     }
     type Mutation{
           newUser(input:userInput): User
           autenticationUser(input:inputAutentication):Token
     }
`

module.exports = typeDefs