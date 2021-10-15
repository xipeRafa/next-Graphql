

const resolvers = {
      Query:{ 
            getCourse:()=>"algo"
      },
      Mutation:{
            newUser:()=>"newUser created"
      }
}

module.exports=resolvers