var express=require('express');
var app=express();

 var cookieParser=require('cookie-parser');
 var bodyParser=require('body-parser');

 var mongoose=require('mongoose');

 app.use(bodyParser.json({limit:'10mb', extended:true}));
 app.use(bodyParser.urlencoded({limit:'10mb', extended:true}));

 var dbPath="mongodb://localhost/myDB";

 db=mongoose.connect(dbPath);

 mongoose.connection.once('open',function(){
   console.log("connected To Database Successfulyy..!");
 });

 var Blog= require('./blogData.js');
 var BlogModel=mongoose.model('Blog');

 app.use(function(req,res,next){
 console.log('Time Reqquest :', Date.now());
 console.log('request URL is :',req.originalUrl);
 console.log('reuest method is:', req.method);
 console.log('request ip address is :', req.ip);
 console.log('request fresh is:',req.fresh);
 console.log('request path is:',req.path);
 console.log('request host is:',req.hostname);


 next();
 });
 app.get('/',function(req ,res){

   res.send("Welcome To Blog Application World!");
 });

 app.get('/blogs',function(req, res){

   BlogModel.find(function(err,result){
     if(err){
       res.send(err);
     }else{
       res.send(result);
     }
   });
 });

 app.get('/blogs/:id',function(req, res){

   BlogModel.findOne({'_id':req.params.id},function(err,result){
     if(err){
       res.send('ID Not Found');
     }else{
       res.send(result);
     }
   });
 });

 app.post('/blogs/create', function(req, res){

   var newBlog= new BlogModel({
     title:req.body.title,
     subTitle:req.body.subTitle,
     blogBody:req.body.blogBody
   });

   var day=Date.now();
   newBlog.created=day;

   var allTags=(req.body.allTags!=undefined && req.body.allTags!=null)?req.body.allTags.split(','):'';
   newBlog.tags=allTags;

   var authorInfo={fullName: req.body.authorFullName, email : req.body.authorEmail};
   newBlog.authorInfo=authorInfo;

   newBlog.save(function(error){
     if(error){
       res.send(error);
     }else{
     res.send(newBlog);
     }
   });
 });

app.put('/blogs/:id/edit',function(req, res){

  var update=req.body;
  BlogModel.findOneAndUpdate({'_id':req.params.id},update,function(err,result){
    if(err){
      res.send('ID Not Found');
    }else{
      res.send(result);
    }

  });
});
app.post('/blogs/:id/delete',function(req, res){

  BlogModel.remove({'_id':req.params.id},function(err, result){
    if(err){
      res.send('ID Not Found');
    }else{
      res.send(result);
    }
  });
});
app.use(function(err,res){

  console.error(err.stack);
  res.status(500).send('Something Broke!');
  console.log('status : 500 Page');
});
app.use(function(err,res){

  console.error(err.stack);
  res.status(404).send('404! Page Is Not Found');
  console.log('status : 404 Page');
});
app.listen(1993,function(){

  console.log('listening on port 1993 !');
});
