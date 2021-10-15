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
      input userInput{
            name:String!
            lastName:String!
            email:String!
            password:String!
      }

     type Query{
           getCourse:String
     }
     type Mutation{
           newUser(input:userInput): String
     }
`

module.exports = typeDefs