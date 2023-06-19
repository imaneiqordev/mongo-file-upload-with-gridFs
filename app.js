const express = require('express');
const bodyParser=require('body-parser');
const path = require('path');
const crypto= require('crypto');
const mongoose = require('mongoose');
const multer=require('multer');
const {GridFsStorage}=require('multer-gridfs-storage');
const Grid=require('gridfs-stream');
const methodOverride=require('method-override');


const app=express();

//MiddleWare
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.set('view engine','ejs');

//Mongo URI
const mongoURI='mongodb://127.0.0.1:27017/mongoupload';

//create mongo connection
const con = mongoose.createConnection(mongoURI);

//init gridfsstream
let gfs;
con.once('open',()=>{
    //init stream
    gfs=Grid(con.db,mongoose.mongo);
    gfs.collection('yes');
})

//create storage engine
const storage = new GridFsStorage({
    url:mongoURI,
    file:(req,file)=>{
        return new promise((resolve,reject)=>{
            crypto.randomBytes(16,(err,buf)=>{
                if(err){
                    return reject (err);
                }
                const filename=buf.toString('hex')+path.extname(file.originalname);
                const fileInfo={
                    filename:filename,
                    bucketName:'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({storage});   


//@route GET /
//@desc Loads form




app.get('/',(req,res)=>{
    res.render('index');
});

//@route POST / upload
//@desc iploads file to db 

app.post('/upload',upload.single('file'),(req,res)=>{
    res.json({file:req.file});
})



const port=5000;

app.listen(port,()=>console.log(`server started on port ${port}`));