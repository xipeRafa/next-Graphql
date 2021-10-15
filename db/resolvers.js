
const User = require('../models/User')
const bcryptjs = require('bcryptjs')

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
                  const salt = await bcryptjs.genSalt(10) 
                  input.password = await bcryptjs.hash(password, salt)
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