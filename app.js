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
app.use(ex.static(path.join(__dirname,"/public")))
app.use(ex.urlencoded({ extended: true }));
app.use(ex.json());
const methodOverride=require("method-override")
app.use(methodOverride("_method"))
const ejsMate=require("ejs-mate");
const wrapAsysc = require("./utils/wrapAsysc.js");
app.engine("ejs",ejsMate)

const { wrap } = require("module");
const expressErr=require("./utils/expressErr.js")
const{listingSchema}=require("./schema.js")
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
app.get("/listen/:id",wrapAsysc(async(req,res)=>{
let{id}=req.params;
const showdata=await listening.findById(id)
res.render("listing/show.ejs",{mydata:showdata})

}))

//validation middleware
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((e) => e.message).join(",");
         console.log(errMsg)
        throw new expressErr(400, errMsg);
    } else {
        next();
    }
};



app.post("/listen",validateListing, wrapAsysc(async (req, res, next) => {
console.log("REQ BODY =", req.body);
 let result = listingSchema.validate(req.body);
 if(result.error){
console.log(result.error.details[0].message);
throw new expressErr(
            400,
            result.error.details[0].message
        );}
const newListen = new listening(req.body.arr);
await newListen.save();
console.log("DATA SAVED");
res.redirect("/listen");

}));
//edit 

app.get("/listen/:id/edit",wrapAsysc( async(req,res)=>{
    let {id}=req.params;
    const listendata=await listening.findById(id)
    res.render("listing/edit.ejs",{yourdata: listendata})
}))
//update 
app.put("/listen/:id", validateListing,wrapAsysc( async(req,res)=>{
    if(!req.body.arr){
    throw new expressErr(404,"send valid data")
   }
    let {id}=req.params;
    
   await listening.findByIdAndUpdate(id,{...req.body.arr})
   res.redirect(`/listen/${id}`)
}))
//delete
app.delete("/listen/:id",wrapAsysc( async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await listening.findByIdAndDelete(id)
    console.log("this is deleted",deletedListing)
    res.redirect("/listen")
}))
app.all("/{*any}",(req,res,next)=>{
    next(new expressErr(404,"page not found"))
})
//custum err middleware
app.use((err,req,res,next)=>{
let {statusCode=500,message="Something went wrong"} = err;
res.status(statusCode);
res.render("err.ejs",{err});
});
app.listen(port,()=>{
    console.log(`http://localhost:${port}/listen`)
    })