
let inputFile, fr, fileBlock, startTime, endTime;
const fileinput = document.getElementById('fileInput')
    , fileData = document.getElementById('fileData')
    , uploadButton = document.getElementById('uploadButton')
    , progressBar = document.getElementById('progressBar')
    , resumeButton = document.getElementById('resumeButton')
    , plusIcon = document.getElementById('plusIcon') ; 

plusIcon.addEventListener('click', (e)=>{
    fileinput.click()
})
fileinput.addEventListener('change',(event)=>{
    inputFile = event.target.files[0];
    fileData.innerText = " \n Name: "+inputFile.name + " \n Size: "+ inputFile.size/1048676 + " Mb \n Type: "+inputFile.type 
})

uploadButton.addEventListener('click', (e) =>{
    
    //initialize filereader---------------------------------------------------------------------------
    fr = new FileReader()
    //asssigning an event handler to FileReaders onload which will gt fired every time a block is read
    fr.onload = (e)=>{
        socket.emit('a file block' , {fileName: inputFile.name , fileBlock: fr.result})
    }

    //Connecting sockets-------------------------------------------------------------------------------
    let socket = io.connect('http://localhost:3000')
    startTime = performance.now()
    //Emit Event 1 : start upload----------------------------------------------------------------------
    socket.emit('start upload' , {name: inputFile.name, size: inputFile.size, type: inputFile.type})

    //Listen to Event 1 : send next block--------------------------------------------------------------
    socket.on('send next block' , (data)=>{

        updateProgressBar(Math.ceil(data.start/inputFile.size*100))

        if(data.resume == true){
            resumeButton.style.visibility = 'visible'
            resumeButton.addEventListener('click' , (e)=>{
                readFile(data.start , data.end)
                resumeButton.style.visibility = 'hidden'
            })
        }
        else
            readFile(data.start , data.end)
    })

    //Listen to Event 2 : upload completed-------------------------------------------------------------
    socket.on('upload done' , data => {
        if(data.alreadyExisted == true)
            fileData.innerText += "\n\n File exists "
        socket.emit('close connection',{})
        updateProgressBar(100)
        endTime = performance.now()
        fileData.innerText += "\n\nTime required to upload: "+(endTime - startTime)/1000+" seconds"
    })

})


const updateProgressBar = (progress)=>{
    progressBar.innerText = progress
}

const readFile = (start , end) => {
    if(end < inputFile.size)   
        //block end is less than file size
        fileBlock = inputFile.slice(start,end)
    else    
        //end of the block to send is 
        fileBlock = inputFile.slice(start,inputFile.size)
            
    fr.readAsBinaryString(fileBlock)
}