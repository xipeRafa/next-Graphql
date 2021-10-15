

const resolvers = {
      Query:{ 
            getCourse:()=>"algo"
      },
      Mutation:{
            newUser:(_,{input},ctx,info)=>{
                  console.log(input)
                  return 'creando....'
            }
      }
}

module.exports=resolvers