const mongoose=require("mongoose")
const initdata=require("./data.js")
const dns=require("dns")
dns.setServers(["8.8.8.8","1.1.1.1"])
const listening=require("../models/listening.js")


main()
.then(()=>{
    console.log("connection successfull")
})
.catch((err)=>{
    console.log(err)
})
async function main() {
    mongoose.connect("mongodb+srv://tarun:tarun2805@cluster0.qurzrkz.mongodb.net/nodedata?appName=Cluster0")
    
}
const initDb=async()=>{
  await listening.deleteMany({})
  await listening.insertMany(initdata.data)
  console.log("data was initialized")
}
initDb()