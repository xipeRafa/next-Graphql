const mongoose = require('mongoose')

const CustomerSchema = mongoose.Schema({
      name:{type:String, required:true, trim:true},
      lastName:{type:String, required:true, trim:true},
      enterprise:{type:String, required:true, trim:true},
      email:{type:String,required:true,trim:true,unique:true},
      phone:{type:String, trim:true},
      seller:{
            type: mongoose.Schema.Types.ObjectId,
            required:true, 
            ref:'User'
      }
})

module.exports=mongoose.model('Customer', CustomerSchema)