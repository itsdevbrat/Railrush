const express = require('express'), 
    bodyParser = require('body-parser')
    path = require('path');

const videoUploadHandler = require('./Controller/videoUploadHandler');
    

//Creating express app-----------------------------------------------------------------------------
const app = express();
app.use(bodyParser.urlencoded({extended:true}));



//Routes -------------------------------------------------------------------------------------------
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname , '/View/html/Homepage.html'));
});
app.use('/videoUpload',videoUploadHandler);



//Starting Server -------------------------------------------------------------------------
app.listen(3000,()=>{
    console.log("Listening");
})



