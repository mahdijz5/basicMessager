const socket = io();

const chatForm = document.getElementById('chatForm'),
messageInput = document.getElementById("messageInput"),
feedback = document.getElementById("feedback")
chatBox = document.getElementById("chat-box"),
onlineUserList= document.getElementById("online-users-list"),
chatScroll = document.getElementById('chatScroll'),
recipient = document.getElementById('recipient')
pvMessageText = document.getElementById('pv-message-text'),
pvMessageForm = document.getElementById('pvMessageForm')



const user = localStorage.getItem("nickname"),
room = localStorage.getItem("room")
let socketId

socket.emit('online',{name : user , room })

//date
const date = () => { 
    let current = new Date()
    const h = current.getHours()
    const m = current.getMinutes()
    return `${h}:${m}`
}

//events
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    if(messageInput.value !== ''){
        socket.emit("chat message", {
            message : messageInput.value,
            name : user,
            room 
        })
        messageInput.value = "";
    }
})

chatForm.addEventListener('keypress',(e)=>{
    socket.emit("typing",{
        name: user,
        room
    })
})

pvMessageForm.addEventListener('submit',(e) => {
    e.preventDefault()
    
    socket.emit("pvChat", {
        message : pvMessageText.value,
        from : user,
        to : socketId,
    })
    
    $("#pvSenderMessage").modal("hide");
    pvMessageText.value = "";

})  


//listening

socket.on('onlineUsers',(data)=> {
    onlineUserList.innerHTML = ''
    for(const id in data) {
        if(room == data[id].room) {
        onlineUserList.innerHTML += `
        <button type="button" class="btn btn-light p-1 mx-2" data-toggle="modal" data-target="#pvSenderMessage" data-id="${id}" data-name="${data[
            id].name}">${data[id].name}</button>
        <span class="badge badge-success my-auto p-2"> </span>

        `
        }
    }
    
})

socket.on('typing',(data)=> {
    feedback.innerHTML = `<div class="alert alert-warning">${data.name} در حال نوشتن است </div>`
})

socket.on('chat message', (data)=> {
    feedback.innerHTML = ""
    chatBox.innerHTML += `
    <li class="alert alert-light">
                            <span
                                class="text-dark font-weight-normal"
                                style="font-size: 13pt"
                                >${data.name}</span
                            >
                            <span
                                class="
                                    text-muted
                                    font-italic font-weight-light
                                    m-2
                                "
                                style="font-size: 9pt"
                                >${date()}</span
                            >
                            <p
                                class="alert alert-info mt-2"
                                style="font-family: persian01"
                            >
                            ${data.message}
                            </p>
                        </li>
    `;
    chatScroll.scrollTop =
        chatScroll.scrollHeight - chatScroll.clientHeight;
})

socket.on('pvChat' , (data) => {
    feedback.innerHTML = ""
    chatBox.innerHTML += `
    <li class="alert alert-warning">
                            <span
                                class="text-dark font-weight-normal"
                                style="font-size: 13pt"
                                >پیام شخصی از ${data.from}</span
                            >
                            <span
                                class="
                                    text-muted
                                    font-italic font-weight-light
                                    m-2
                                "
                                style="font-size: 9pt"
                                >${date()}</span
                            >
                            <p
                                class="alert alert-info mt-2"
                                style="font-family: persian01"
                            >
                            ${data.message}
                            </p>
                        </li>
    `;
    chatScroll.scrollTop =
        chatScroll.scrollHeight - chatScroll.clientHeight;
})

$("#pvSenderMessage").on("show.bs.modal", function (e) {
    var button = $(e.relatedTarget);
    var user = button.data("name");
    socketId = button.data("id");

    recipient.innerHTML = "ارسال پیام شخصی به :" + user;
});
