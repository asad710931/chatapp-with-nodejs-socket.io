
//=========select html tage simple way=========
const $=(e)=>{return document.querySelector(e)}
const $_all=(e)=>{return document.querySelectorAll(e)}


//=========Generate random text===============

const uniqeId=()=>{
  let time = Date.now()
  return `${time.toString(16)}`

}
const socket = io()


const SearchURL=window.location.search;
const params= new URLSearchParams(SearchURL)

let user=params.get('user');
let group=params.get('group');
$('.user-name').innerHTML=user
//usersLog.push(getDataFromURL())
//console.log(getDataFromURL())
socket.emit('joined',{user,group})




let messageArea=$('.message-area');
let inputText=$('.input-message')




socket.on('message',(msg)=>{
  //console.log(msg)
  viewMessage(messageArea,msg)
  messageArea.scrollTop=messageArea.scrollHeight;
})

const viewMessage=(htmltag,msg)=>{

  htmltag.innerHTML+=`<div class="message">
            <span class="username"><b>${msg.user}</b></span>
            <span class="time">${msg.time}</span><br/>
            <span class="m-font">${msg.msg}</span>
          </div>`
}


const SendData=()=>{
  let msg = inputText.value
  socket.emit('chatMessage',msg)
  inputText.value=''
}
$('.send-btn').addEventListener('click',SendData)
window.addEventListener('keypress',(e)=>{
  if(e.key=='Enter') SendData()
})



let userlog=$('.user-log')
socket.on('groupinfo',({group,users})=>{
   // console.log(group,users)
   $('#group-name').innerHTML=group
   
   userlog.innerHTML=`${ users.map(user=>`<li>${user.user}</li>`)}`


})


$('.out-btn').addEventListener('click',()=>{
  window.location='index.html'
})




const toggleNav=()=>{
      let navbar=$('.navbar')
    // navbar.style.left='0px'
      if(navbar.style.left=="-300px"){
        navbar.style.left='0px'
        navbar.style.transition='transition: left 0.5s linear 0s;'
      }else{
        navbar.style.left='-300px'
        navbar.style.transition='transition: left 0.5s linear 0s;'

      }
}


toggleNav()
$('.hamber').addEventListener('click',toggleNav)

const toggleUser=()=>{
  let bar=$('.user-option')
// navbar.style.left='0px'
  if(bar.style.display=="none"){
    bar.style.display="block"
    bar.style.transition='transition: display 0.5s linear 0s;'
  }else{
    bar.style.display="none"
    bar.style.transition='transition: display 0.5s linear 0s;'
  }
}
toggleUser()
$('.user-icon').addEventListener('click',toggleUser)


