
const User = require('../models/User')

const resolvers = {
      Query:{ 
            getCourse:()=>"algo"
      },
      Mutation:{
            newUser:async(_,{input},ctx,info)=>{

                  const {email, password}=input

                  //revisar si ya esxiste
                  const isUser = await User.findOne({email})
                  if(isUser){
                        throw new Error('El usuario ya existye')
                  }


                  //password

                  //guardarlo en DB
                  try {
                        const user = new User(input)
                        user.save()
                        return user
                  } catch (error) {
                        console.log(error)
                  }

            }
      }
}

module.exports=resolvers