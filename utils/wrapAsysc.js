module.exports=(fuc)=>{
    return function(req,res,next){
        fuc(req,res,next).catch(next)
    }
}