const { Console, table } = require('console');
const cons = require('consolidate');
const { resolveSoa } = require('dns');
var express = require('express');
const path=require('path');
const { response } = require('../app');
var router = express.Router();
var db=require('../dbconnector/connection')
const bcrypt=require('bcrypt');
const { create } = require('domain');
const { createDecipher } = require('crypto');
const fs=require('fs');
const { type } = require('os');
const { resourceLimits } = require('worker_threads');
var number=10;

/* GET home page. */

// m1 start
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn)
  {
   next()
  }else(res.redirect('/'))
  
}
router.get('/signup',function(req,res){
 res.render('signup')
})
router.post('/signup',async(req,res)=>{
//var encryptedpassword=await bcrypt.hash(req.body.psw,number);error
// console.log(encryptedpassword)
// console.log(req.body.name)
const admin=[[req.body.name,req.body.email,req.body.pswd,req.body.dateofjoin,req.body.dob,req.body.emp_id,req.body.mob]]
console.log(admin)
var sql="INSERT INTO login (name,email,pass,dateofjoin,dob,emp_id,mob) VALUES ?";

db.query(sql,[admin],(err,result)=>{
  if(err)
  console.log(err)
  else{
  console.log(result[0])
  res.redirect('/')
  }
})
})
router.get('/', function(req, res) {
  

  if(req.session.loggedIn){
  
 
    res.render('page')
  }else{
  res.render('manu_login')
  }

});

router.post('/login',(req,res)=>{
  console.log(req.body)
  var password=req.body.pswd;//front end
  var email=req.body.email;//front end
  console.log(email,password)
  var sql="select * from login where email= ?"
  db.query(sql,[email], (err,result)=>{
    if(err){console.log("error"); res.redirect('/');}

  else{
    console.log(result.length)
  
  if(result.length>0){
    const password=req.body.pasw
    console.log(password)
    
    //const bcryp =  bcrypt.compareSync(password, result[0].password); error
    if(password==result[0].pass)
   // console.log(bcryp)
    {
    
    
      req.session.loggedIn=true;
      // req.session.user=response.user
      req.session.data=result
      
      if(result[0])
      {
      data=req.session.data
      console.log(data)
      res.render('page',{data})
      }
    
    
  }
    else{
      res.redirect('/')
      console.log("password error")
    }
  
  }
}
  

})

})

router.get('/page', verifyLogin,function(req, res) {
  data=req.session.data.name
  res.render('page', { title: 'Dashboard',data });
});
router.get('/user', function(req, res) {
  
  res.render('user', { title: 'Express' });
});
router.get('/next',verifyLogin,function(req, res) {
  
  res.render('next', { title: 'Express' });
});
router.get('/slot', function(req, res) {
 let data=req.session.data;
//   var data={"data": {
//     "Vaccine Name": "'Covaxin'",
//     "Expiry Date": "'23-05-2024'",
//     "Manufacturing Date": "'12-05-2022'",
//     "Company Name": "'UltraShield'",
//     "Vaccine Id": "'abcd'"
// }}
  res.status(200).json(data)
  // res.render('slot', { title: 'Dashboard' });
});
router.post('/slot',(req,res)=>{
console.log(req.body)

})
router.get('/select', function(req, res) {
  
  res.render('select', { title: 'Express' });
});

router.get('/front',verifyLogin,function(req, res) {
   let data=req.session.data;
 
  res.render('front', {data});
  
 
              
   })
   router.get('/history',verifyLogin,(req,res)=>{
    res.render('history')
   })
   

router.post('/front',(req,res)=>{

  
  const box_details=[[req.body.name,req.body.boxid,req.body.empid,req.body.password]]
  var sql =`INSERT INTO med (box_name,BOX_id,Emp_id,emp_n) VALUES ?`
  db.query(sql,[box_details],(err,result)=>{
  if(err)
  {
    console.log(err)
  }
  else
  {
    res.redirect('/vaccine_dt')
  }
  
  
})
  






});
router.get('/vaccine_dt',verifyLogin,(req,res)=>{
  
 let data=req.session.data;
 // console.log(data)
 var sql="select * from vaccine_details"
 db.query(sql,function(err,result){
  if(err){console.log(err); res.render('vaccine')}
  else{
    if(result.length>0){
      console.log(result)
      res.render('vaccine',{result,data})
    }
  }
 })
  
  
})

router.post('/vaccine_dt',(req,res)=>{
  // var sql="select * from vaccine_details"
  // db.connect(sql,(err,result)=>{
  //   if(err){
  //     console.log(err)
  //   }else{
  //     //console.log(result)
  //     res.render('vaccine',{result})
  //   }

  // })
})

/*<==========================POST METHOD FETCH FROM CV2 ======================================================================================>*/
router.post('/vaccine',(req,res)=>{
  let data=req.session.data;
  console.log(data)
//  console.log(req.body.data)
  var vaccine_data=req.body.data
  // console.log(vaccine_data);

  var d=vaccine_data
 // console.log(d)
 // console.log(typeof d)

 
var sql=`INSERT INTO vaccine_details (vaccinename,Expiry_d,Manufact_d,company_n,Vaccine_id) VALUES (${d["Vaccine Name"]},${d["Manufacturing Date"]},${d["Expiry Date"]},${d["Company Name"]},${d["Vaccine Id"]})`
console.log(sql)
db.query(sql,(err,result)=>{
  if(err){
    console.log(err)
  }
  else{
    console.log("INSERTED")
  }
})

/*<====================================POST METHOD END===============================================================================================>*/

//   var sql_view="select * from vaccine_details"
//  db.query(sql_view,(err,result)=>{
//     if(err){
//       console.log(err)

//     }
//     else
//     {
//       console.log(result)
//       res.render('vaccine',{results})
//     }

//   })


  
 
  
  
})
router.get('/logout',(req,res)=>{
   req.session.destroy()
    res.redirect('/')
})
router.get('/history',function(req,res){

})
 

/*<=============================M1 stop===========================================================>*/
router.post('/main',(req,res)=>{
  console.log(req.body)
  res.status(200).send("HI")
})



module.exports = router;
