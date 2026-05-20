const ex=require("express")
const app=ex()
const port =3000;
const path=require("path")
const mongoose=require("mongoose")
const dns=require("dns")
dns.setServers(["8.8.8.8","1.1.1.1"])
const listening=require("./models/listening.js")
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(ex.static(path.join(__dirname,"/public/css")))
app.use(ex.urlencoded({ extended: true }));
const methodOverride=require("method-override")
app.use(methodOverride("_method"))
const ejsMate=require("ejs-mate")
app.engine("ejs",ejsMate)


main()
.then(()=>{
    console.log("connection successfull")
})
.catch((err)=>{
    console.log(err)
})
async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/part_a")
    
}
// app.get("/testListening",async(req,res)=>{
// let sample=new listening({
//     title:"my home",
//     description:"hi this is amazing",
//     price:1200,
//     loaction:"indore",
//     country:"india",
// })
// await sample.save();
// console.log("sample was saved")
// res.send("successfull testing")

// })

app.get("/listen",async(req,res)=>{
  let alldata=await  listening.find({})
  res.render("listing/index.ejs",{alldata})
})
//new route form 

app.get("/listen/new",(req,res)=>{
    res.render("listing/new.ejs")
})
//show route
app.get("/listen/:id",async(req,res)=>{
let{id}=req.params;
const showdata=await listening.findById(id)
res.render("listing/show.ejs",{mydata:showdata})

})
app.post("/listen", async (req, res) => {
  console.log(req.body);           // ✅ see data
  console.log(req.body.arr); // ✅ nested object

  const newListen = new listening(req.body.arr);
  await newListen.save();
  res.redirect("/listen");
});

//edit 

app.get("/listen/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listendata=await listening.findById(id)
    res.render("listing/edit.ejs",{yourdata: listendata})
})
//update 
app.put("/listen/:id",async(req,res)=>{
    let {id}=req.params;
   await listening.findByIdAndUpdate(id,{...req.body.arr})
   res.redirect(`/listen/${id}`)
})
//delete
app.delete("/listen/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await listening.findByIdAndDelete(id)
    console.log("this is deleted",deletedListing)
    res.redirect("/listen")
})


app.listen(port,()=>{
    console.log(`http://localhost:${port}/listen`)
    })