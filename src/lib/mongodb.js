import mongoose from "mongoose"

const connecToDatabase = async  () =>{
  
  try{
         await mongoose.connect(process.env.Mongourl);
         console.log("connect to maongo db")
  }catch(err){
    console.log("error while connecting database",err)
  }
}

export default connecToDatabase