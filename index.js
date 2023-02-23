
//import all required modules
const express = require('express')
const socketio = require('socket.io')
const http= require('http');
const path = require('path');
const moment = require('moment')
//setup all required configuration 
const app = express()
const server = http.createServer(app);
const Server = socketio.Server
const io = new Server(server)


//Config public dir to excecute all html and vanilla js
app.use(express.static(path.join(__dirname,'public')))




//==========configuration of user, message and room function and objects 

const messageinfo=(user,msg)=>{
  return {
    user,
    msg,
    time:moment().format('hh:mm a')
  }
}
//===================

const usersObj=[]


//put user data in usersObj and return that user
const userJoin=(id,user,group)=>{
    let singleUser={id,user,group}
    usersObj.push(singleUser)
    return singleUser
}

//get single user
const getUser=(id)=>{
    return usersObj.find(user=>user.id===id)
}

//remove user who leave chat
const leaveUser=(id)=>{
    const index = usersObj.findIndex(user=>user.id===id)
    if (index !==-1) return usersObj.splice(index,1)[0] 

}

//get user from room

const getRoomUser=(group)=>{
    return usersObj.filter(user=>user.group===group)
}


//===============================//



//io config
io.on('connection',(socket)=>{
   // console.log('new user joined')

   socket.on('joined',({user,group})=>{
      console.log(user,group)
      const userid = userJoin(socket.id,user,group)

      socket.join(userid.group)

      //welcome to current user
      socket.emit('message',messageinfo('AdminBot','Welcome to Chat-App'))
     //Broadcast when a user connect
      socket.broadcast
      .to(userid.group)
      .emit('message',messageinfo('AdminBot',`${userid.user} has just joined the chat`))

      //
      io.to(userid.group).emit('groupinfo',{group:userid.group,users:getRoomUser(userid.group)})
  
   })



    socket.on('chatMessage',(msg)=>{
        const cuUser=getUser(socket.id)
        io.to(cuUser.group).emit('message',messageinfo(cuUser.user,msg))
    })


    socket.on('disconnect',()=>{
        const cuUser=leaveUser(socket.id)
        if(cuUser){
            io.to(cuUser.group).emit('message',messageinfo('AdminBot',`${cuUser.user} has left the chat`))
            io.to(cuUser.group).emit('groupinfo',{group:cuUser.group,users:getRoomUser(cuUser.group)})

        }
    })
})


const port = 3030||process.env.PORT
server.listen(port,()=>{
    console.log('server started at',port)
})


