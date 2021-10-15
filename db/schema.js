const { gql }=require('apollo-server') 

//squema -- QUERY SE TRANSLADA A RESOLVERS
const typeDefs = gql`
      type Course{
            title:String     
      }
      type Technology{
            technology:String
      }
      input CourseInput {
             technology:String 
      }
      type Query{ 
            getCourses(input : CourseInput!): [Course] 
            getTechnology: [Technology]
      }
`

module.exports = typeDefs