const express = require('express')
    , app = express()
    , server = require('http').Server(app)     //Server(requestListener?: RequestListener);
    , io = require('socket.io')(server)
    , bodyParser = require('body-parser')
    , path = require('path')
    , videoUploadHandler = require('./controller/videoUploadHandler')
    , fs = require('fs');

let files = {}
    , blockSize = 1048676    //blockSize we are using is 1MB 
    , uploadDir = '/Video Uploads/';

//Creating express app-----------------------------------------------------------------------------
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'))


//Routes -------------------------------------------------------------------------------------------
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname , '/public/html/Homepage.html'));
});
app.use('/videoUpload',videoUploadHandler);


//sockets connection--------------------------------------------------------------------------------
io.on('connection' , (socket) =>{
    
    //Listen to Client Event 1 : Start upload -------------------------------------------------------
    socket.on('start upload' , (data)=>{
        
        console.log('A Client is Connected'+socket.id)

        try{
            let fileStats = fs.statSync(path.join(__dirname,uploadDir+data.name))
            if(fileStats.size == data.size)
                socket.emit('upload done' , {alreadyExisted: true})
            else
                socket.emit('send next block',{start: files[data.name].downloadedSize , end: files[data.name].downloadedSize + blockSize , resume:true})
            
        }catch(e){
            files[data.name] = {
                size: data.size,
                type: data.type,
                downloadedData: "",
                downloadedSize: 0,
                fileDescriptor: null
            }
            console.log('new upload '+files[data.name].downloadedSize+e)
            fs.open(path.join(__dirname, uploadDir + data.name) , 'a' ,(err,fd) =>{
                files[data.name].fileDescriptor = fd
            })
            socket.emit('send next block',{start: 0 , end: blockSize , resume:false})
        }
    })

    //Listen to Client Event 2 : a file block--------------------------------------------------------------------
    socket.on('a file block',(data)=>{
        files[data.fileName].downloadedData += data.fileBlock
        files[data.fileName].downloadedSize += data.fileBlock.length
        console.log(data.fileBlock.length+" files[data.fileName].downloadedSize "+files[data.fileName].downloadedSize)
        
        if(files[data.fileName].downloadedSize < files[data.fileName].size)
            socket.emit('send next block',{start: files[data.fileName].downloadedSize , end: files[data.fileName].downloadedSize + blockSize})
        
        if(files[data.fileName].downloadedData.length > 10486760 ){  //buffer reaches 10mb
            writeToFile(files[data.fileName].downloadedData , files[data.fileName].fileDescriptor)
            files[data.fileName].downloadedData = ""
        }
        
        if(files[data.fileName].downloadedSize == files[data.fileName].size){
            writeToFile(files[data.fileName].downloadedData , files[data.fileName].fileDescriptor)
            socket.emit('upload done' , {alreadyExisted: false})
            files[data.fileName] = null
        }
            
    })

    //listen to client event 3 : close connection------------------------------------------------------
    socket.on('close connection' , (data)=>{
        console.log('A Client is closing Connection'+socket.id)
        socket.disconnect()
    })
})


//Starting Server ------------------------------------------------------------------------------------
server.listen(process.env.PORT || 3000,()=>{
    console.log("Listening");
})

const writeToFile = (fileData , fd) =>{
    fs.writeFile(fd , fileData , 'Binary' ,(err)=>{
        if(err)
            console.log('error in writing file')
    })
}