const express = require('express')
    , app = express()
    , server = require('http').Server(app)     //Server(requestListener?: RequestListener);
    , io = require('socket.io')(server)
    , bodyParser = require('body-parser')
    , path = require('path')
    , fileUpload = require('./controller/fileUpload')
    , videoUploadHandler = require('./controller/videoUploadHandler');

//Creating express app----------------------------------------------------------------------------
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'))


//Routes -------------------------------------------------------------------------------------------
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname , '/public/html/Homepage.html'));
});
app.use('/videoUpload',videoUploadHandler);

fileUpload(io)


//Starting Server ------------------------------------------------------------------------------------
server.listen(process.env.PORT || 3000,()=>{
    console.log("Listening");
})
