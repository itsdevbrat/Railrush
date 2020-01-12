const express = require('express'), 
    bodyParser = require('body-parser'),
    multer = require('multer');
    

const PythonShell = require('python-shell').PythonShell;


//Creating express app-----------------------------------------------------------------------------
const app = express();
const html = "<h1>Hello</h1><input type/><form action=\"/videoUpload\" method=\"post\" enctype=\"multipart/form-data\" ><input type=\"file\" name=\"videoInput\"/></form>";


//File upload config-----------------------------------------------------------------------------
const storage = multer.diskStorage({
    destination: (req,res,callback)=>{
        callback(null,'Video Uploads/');
    },
    filename : (req,res,callback)=>{
        console.log(req.file);
        callback(null, '-' + Date.now()+'.mp4');
    }
});
const fileUpload = multer({ storage : storage });


//Routes -------------------------------------------------------------------------------------------
app.get('/',(req,res)=>{
    res.send("<h1>Hello</h1><input type/><form action=\"/videoUpload\" method=\"post\" enctype=\"multipart/form-data\" ><input type=\"file\" name=\"videoInput\"/><input type=\"submit\"/></form>");
});

app.post('/videoUpload' , fileUpload.single('videoInput'), (req,res)=>{
    console.log(req.file);

    //Python Shell config------------------------------------------------------------------------------
    const pythonShellOptions = {
        mode : "text",
        scriptPath : './',
        args : [req.file.buffer]
    }
    PythonShell.run('CrowdCountModel.py' , pythonShellOptions, (err,output)=>{
        if(err) throw err;
        console.log(output);
    });

    res.send("Done");
});

//Starting Server -------------------------------------------------------------------------
app.listen(3000,()=>{
    console.log("Listening");
})



