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

     type Query{
           getCourse:String
     }
     type Mutation{
           newUser: String
     }
`

module.exports = typeDefs