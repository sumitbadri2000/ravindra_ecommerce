import mongoose from "mongoose"

const Connection = async() => {
  try {
    const connect = await mongoose.connect(process.env.URL);
    console.log(`Connected to MongoDB ${connect.connection.host}`);
  } catch (error) {
    console.log(`Error:- ${error}`);
  }
}

export default Connection