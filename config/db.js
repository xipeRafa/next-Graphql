const mongoose = require('mongoose')
require('dotenv').config({path:'.env'})

const connectDB=async()=>{
      try{

            await mongoose.connect(process.env.MONGO_DB, {
                  useNewUrlParser:true,
                  useUnifiedTopology:true
            })

            console.log('base de datos online')

      }catch(error){

            console.log('error en DB')
            console.log(error)
            process.exit(1)
            
      }
}

module.exports=connectDB
