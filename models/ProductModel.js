import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    offer:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.ObjectId,
        ref:'Category',
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    photo1: {
        type: String,
    },
    photo2: {
        type: String,
    },
      // photo3: {
      //   type: String,
      // },
      // photo4: {
      //   type: String,
      // },
      // photo5: {
      //   type: String,
      // },
    shipping:{
        type:Boolean
    } 
},{timestamps:true})

export default mongoose.model('Products',productSchema)