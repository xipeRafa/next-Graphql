const User = require('../models/User')
const Product = require('../models/Product')
const Customer = require('../models/Customer')
const Order = require('../models/Order')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config({path:'.env'})

const crearToken=(user, secretekey, expiresIn)=>{
      const {id,name,lastName,email} = user
      return jwt.sign({id, email, name, lastName}, secretekey, {expiresIn})
}

const resolvers = {
      Query:{ 
            getUser: async(_, {token})=>{
                  
                  const userId = await jwt.verify(token, process.env.SECRETEKEY)
                  return userId
            },
            getProducts: async()=>{
                  try {
                      const products = await Product.find({})  
                      return products
                  } catch (error) {
                      console.log(error)  
                  }
            },
            getProduct: async(_, {id})=>{
                  
                  const product = await Product.findById(id) //revisar si el producto existe o no
                  if(!product){ throw new Error('Producto No enconrtrado') }

                  return product
            },
            getCustomers: async () => {
                  try {
                      const customer = await Customer.find({});
                      return customer;
                  } catch (error) {
                      console.log(error);
                  }
            },
            getCustomersBySeller: async (_, {}, ctx ) => {
                  try {
                      const customer = await Customer.find({ seller: ctx.user.id.toString() });
                      return customer;
                  } catch (error) {
                      console.log(error);
                  }     //1.- autenticar usuario to get new JWT.  2.- + query getCustomerSeller { ... }
                        //3.- HEADERS authorization-jwt
            },
            getCustomer: async (_, { id }, ctx) => {
                  
                  const customer = await Customer.findById(id); // Revisar si el cliente existe o no
                  if(!customer) { throw new Error('Cliente no encontrado') }
      
                  if(customer.seller.toString() !== ctx.user.id ) { // Quien lo creo puede verlo
                      throw new Error('No tienes las credenciales');
                  }
      
                  return customer;
            },
            getOrders: async () => {
                  try {
                      const orders = await Order.find({});
                      return orders;
                  } catch (error) {
                      console.log(error);
                  }
            },
            getOrdersBySeller: async (_, {}, ctx) => {
                  try {
                        const orders = await Order.find({ seller: ctx.user.id })
                        // console.log(orders);
                        return orders;
                  } catch (error) {
                        console.log(error);
                  }
            },
            getOrderById: async(_, {id}, ctx) => {
                 
                  const order = await Order.findById(id);  // Si el pedido existe o no
                  if(!order) {
                      throw new Error('Order no encontrado');
                  }
                  
                  if(order.seller.toString() !== ctx.user.id) { // Solo quien lo creo puede verlo
                      throw new Error('No tienes las credenciales');
                  }
      
                  return order; 
            },
            getOrdersByState: async (_, { state }, ctx) => {
                  const orders = await Order.find({ seller: ctx.user.id, state });
                  return orders;
            },
            bestCustomers: async () => {
                  const customers = await Order.aggregate([
                      { $match : { state : "COMPLETED" } },
                      { $group : { _id : "$customer", total: { $sum: '$total' } } }, 
                      {
                          $lookup: {
                              from: 'customers', 
                              localField: '_id',
                              foreignField: "_id",
                              as: "customer"
                          }
                      }, 
                      { $limit: 10 }, 
                      { $sort : { total : -1 } }
                  ]);
      
                  return customers;
              }, 
              bestSellers: async () => {
                  const sellers = await Order.aggregate([
                      { $match : { state : "COMPLETED"} },
                      { $group : { _id : "$seller", total: {$sum: '$total'} } },
                      {
                          $lookup: {
                              from: 'users', 
                              localField: '_id',
                              foreignField: '_id',
                              as: 'seller'
                          }
                      }, 
                      { $limit: 3 }, 
                      { $sort: { total : -1 } }
                  ]);
      
                  return sellers;
              },
              searchProductByName: async(_, { text }) => {

                  const products = await Product.find({ $text: { $search: text  } }).limit(10)
                  
                  return products;
              }
      },
      Mutation:{
            newUser: async(_,{input},ctx,info)=>{
                  const {email, password}=input

                  const isUser = await User.findOne({email})//revisar si ya esxiste
                  if(isUser){ throw new Error('El usuario ya existe') }

                  const salt = await bcryptjs.genSalt(10) 
                  input.password = await bcryptjs.hash(password, salt)

                  try {      
                        const user = new User(input)
                        user.save()
                        return user
                  } catch (error) { console.log(error) }
            },
            autenticationUser: async(_,{input})=>{
                  const {email, password}=input

                  const isUserA = await User.findOne({email}) //revisar si ya esxiste
                  if(!isUserA){ throw new Error('El usuario No existe') }
                 
                  const rightPassword = await bcryptjs.compare(password, isUserA.password)
                  if(!rightPassword){ throw new Error('El passwors es incorrecto') }  // revisar password 

                  return { token: crearToken(isUserA, process.env.SECRETEKEY, '24hrs' ) }    //crear el token
            },
            newProduct: async(_,{input})=>{
                  try {
                       const product = new Product(input) 
                       const result = await product.save()
                       return result
                  } catch (error) {
                        console.log(error)
                        console.log('ERROR EN PRODUCT')
                  }
            },
            editProduct: async(_, {id, input})=>{
                 
                  let product = await Product.findById(id)  //revisar si el producto existe o no
                  if(!product){ throw new Error('Producto No enconrtrado') }
                 
                  product = await Product.findOneAndUpdate({ _id:id }, input, {new:true}) //guardar en base de datos
                  return product
            },
            deleteProduct: async(_,{id})=>{
                  
                  let product = await Product.findById(id) //revisar si el producto existe o no
                  if(!product){ throw new Error('Producto No enconrtrado') }
                  
                  await Product.findOneAndDelete({_id:id})
                  return 'producto eliminado'
            },
            newCustomer: async(_, {input}, ctx)=>{
                
                  const { email } = input  
                  const customer = await Customer.findOne({ email });
                  if(customer) {  //verificar si el cliente ya esta registrado\
                      throw new Error('Ese cliente ya esta registrado');
                  }

                  //guardar en DB
                  const newCustomer = new Customer(input);
                  newCustomer.seller = ctx.user.id;  

                 //asignar el vendedor
                 /*  newCustomer.seller = "61690e1a2aeb8d611868840a";  */
      
                  try {
                      const result = await newCustomer.save();
                      return result;
                  } catch (error) {
                      console.log(error);
                  }
            },
            edithCustomer: async (_, {id, input}, ctx) => {
                 
                  let customer = await Customer.findById(id);  // Verificar si existe o no
                  if(!customer) { throw new Error('Ese customer no existe') }
      
                  // Verificar si el vendedor es quien edita
                  if(customer.seller.toString() !== ctx.user.id ) {
                      throw new Error('No tienes las credenciales');
                  }
      
                  customer = await Customer.findOneAndUpdate({_id : id}, input, {new: true} );
                  return customer;
            },
            deleteCustomer : async (_, {id}, ctx) => {
                 
                  let customer = await Customer.findById(id);
                  if(!customer) { throw new Error('Ese customer no existe') }  // Verificar si existe o no
      
                  if(customer.seller.toString() !== ctx.user.id ) { // Verificar si el vendedor es quien elimina
                      throw new Error('No tienes las credenciales');
                  }
      
                  await Customer.findOneAndDelete({_id : id}); // Eliminar Cliente
                  return "Cliente Eliminado"
            },
            newOrder: async (_, {input}, ctx) => {

                  const { customer } = input

                  let customerIs = await Customer.findById(customer); // Verificar si existe o no
                  if(!customerIs) { throw new Error('Ese customer no existe') }
      
                  if(customerIs.seller.toString() !== ctx.user.id ) {
                        throw new Error('No tienes las credenciales');// Verificar si el customer es del vendedor
                  }
      
                  for await ( const item of input.order ) { // Revisar que el stock este disponible
                        const { id } = item;
                        const product = await Product.findById(id);
      
                        if(item.quantity > product.stock) {
                              throw new Error(`El item: ${product.name} excede la cantidad disponible`);
                        } else {
                              product.stock = product.stock - item.quantity; // Restar la cantidad a lo disponible
                              await product.save();
                        }
                  }

                  const newOrder = new Order(input); // Crear un nuevo pedido
                  newOrder.seller = ctx.user.id; // asignarle un vendedor
                  
                  const result = await newOrder.save();// Guardarlo en la base de datos
                  return result;
            },
            editOrder: async(_, {id, input}, ctx) => {

                  const { customer } = input;
      
                  const orderIs = await Order.findById(id); // Si el pedido existe
                  if(!orderIs) { throw new Error('El pedido no existe') }
      
                  const customerIs = await Customer.findById(customer); // Si el cliente existe
                  if(!customerIs) { throw new Error('El Cliente no existe') }
      
                  if(customerIs.seller.toString() !== ctx.user.id ) { 
                      throw new Error('No tienes las credenciales');
                  }                              // Si el cliente y pedido pertenece al vendedor
      
                  if( input.order ) {       // Revisar el stock este disponible
                      for await ( const item of input.order ) {

                          const { id } = item;
                          const product = await Product.findById(id);
          
                          if(item.quantity > product.stock) {
                              throw new Error(`El item: ${product.name} excede la cantidad disponible`);
                          } else {             
                              product.stock = product.stock - item.quantity;  // Restar la cantidad a lo disponible
                              await product.save();
                          }

                      } // que solo puedan modificar el estado
                  }
      
                  const result = await Order.findOneAndUpdate({_id: id}, input, { new: true });
                  return result;   // Guardar el pedido
            },
            deleteOrder: async (_, {id}, ctx) => {
                  
                  const order = await Order.findById(id); // Verificar si el order existe o no
                  if(!order) { throw new Error('El order no existe') }
      
                  // verificar si el vendedor es quien lo borra
                  if(order.seller.toString() !== ctx.user.id ) {
                      throw new Error('No tienes las credenciales')
                  }
      
                  await Order.findOneAndDelete({_id: id});
                  return "Order Eliminado"
            }

      }
}
module.exports = resolvers