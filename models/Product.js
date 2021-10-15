const mongoose = require('mongoose')

const productsSchema = mongoose.Schema({
      name: {type:String, required:true, trim:true},
      stock:{type:Number, required:true, trim:true},
      price:{type:Number, required:true, trim:true},
      start:{type:Date,   default:Date.now()}
})

module.exports=mongoose.model('Product', productsSchema)