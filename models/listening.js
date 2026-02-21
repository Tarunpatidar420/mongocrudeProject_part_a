const mongoose=require("mongoose")
const {Schema}=mongoose;

const ListeningSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
  filename: {
    type: String,
    default: "listingimage",
  },
  url: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1761839259112-aaea03db3633?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1761839259112-aaea03db3633?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        : v,
  },
},
    price:Number,
    location:String,
    country:String,
})
let listening=mongoose.model("listening",ListeningSchema)
module.exports =listening;