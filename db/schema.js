const { gql }=require('apollo-server') 

//squema  
const typeDefs = gql`
     type Query{
           getCourse:String
     }
`

module.exports = typeDefs