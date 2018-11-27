let jsonGroups = {
    grupos: [
        {
            grupo: "Grupo da família!",
            mensagens: [
                {
                    usuario: "joao03",
                    texto: "Tudo bem?"
                },
                {
                    usuario: "victor23",
                    texto: "Tudo Tranqs"
                },
                {
                    usuario: "joao03",
                    texto: "Que bom"
                },
                {
                    usuario: "maria2000",
                    texto: "Que bom!"
                }
            ]
        },
        {
            grupo: "Churrascão no domingão",
            mensagens: [
                {
                    usuario: "maria2000",
                    texto: "Na paz?"
                },
                {
                    usuario: "victor23",
                    texto: "Show"
                },
                {
                    usuario: "maria2000",
                    texto: "Que bom"
                }
            ]
        },
        {
            grupo: "Só topzera",
            mensagens: [
                {
                    usuario: "victor03",
                    texto: "Bom?"
                },
                {
                    usuario: "robson_alves",
                    texto: "Bom"
                }
            ]
        }
    ]
}

var groupAtive = undefined;
let url = "http://rest.learncode.academy/api/fagner/groups";
let url_msg = "http://rest.learncode.academy/api/fagner/";

let list_group = document.querySelector(".list-group");
let body_chat = document.querySelector(".body-chat"); 

let login = document.querySelector(".header .login");
let modal = document.querySelector(".modal");
let btn_user = document.querySelector(".modal .painel-modal .btn-user");
let user_logado = document.querySelector(".header .user-name")
user_logado.innerHTML = localStorage.getItem("user");


if(localStorage.getItem("user")){
    login.innerHTML = "Sair";
}

login.addEventListener("click", function(){
   
    if(localStorage.getItem("user")){
        localStorage.removeItem("user");
        login.innerHTML = "Entrar";
        user_logado.innerHTML = "";
        window.location.reload();
    }
    else{
        modal.classList.add("modal-ativo");     
   }
})



btn_user.addEventListener("click", function(){
    
    let input_user = document.querySelector(".modal .painel-modal .input-user");
    localStorage.user = input_user.value;   
    login.innerHTML = "Sair";
    user_logado.innerHTML = localStorage.getItem("user");
    modal.classList.remove("modal-ativo");
    window.location.reload();
    
});

function createComponentGroup(title_group, id_group) {
    let li = document.createElement("li");
    
    let input = document.createElement("input");
    input.type = "hidden"
    input.value = id_group;

    let img = document.createElement("img");
    img.src = 'img/user.png';

    let text = document.createTextNode(title_group);
    
    li.appendChild(img);           
    li.appendChild(text);  
    li.appendChild(input);          
    list_group.appendChild(li);
}

function createComponentMsg(msgp) {            
    let title_chat = msgp.userName;
    let message = msgp.message;

    let painel = document.createElement("div");
    let title = document.createElement("span");
    let body = document.createElement("p");
   
    let group_msg = document.createTextNode(title_chat);
    let msg = document.createTextNode(message);


    title.appendChild(group_msg);
    body.appendChild(msg);
    painel.appendChild(title);
    painel.appendChild(body);

    body_chat.appendChild(painel);

}

function addGroup() {
    let request = new XMLHttpRequest();
    
    request.onreadystatechange = function(){             
        
        if(request.readyState == 4){                    
            let resultRequest = JSON.parse(request.responseText);         
            
            if(resultRequest.length){
                list_group.innerHTML = "";
                body_chat.innerHTML = "";
             
                for (let i = 0; i < resultRequest.length; i++) {                       
                    createComponentGroup(resultRequest[i].groupName, resultRequest[i].groupID);
                }
                event_click_group();
            }  
               
        } 
                       
    };

    request.open("GET", url, true);
    request.send();  

    // for (let i = 0; i < jsonGroups.grupos.length; i++) { createComponentGroup(jsonGroups.grupos[i].grupo);};                        
        
}

function openMsgs(groupId, groupName){
    let request = new XMLHttpRequest();
    let group_chat = document.querySelector(".chat .header-chat .group-chat");
            group_chat.innerHTML = groupName;
            

    request.onreadystatechange = function(){
        if(request.readyState == 4){
            let resultRequest = JSON.parse(request.responseText);
            resultRequest.forEach(createComponentMsg);              
        }
    };

    request.open("GET", url_msg+groupId, true);
    request.send();            

    // for (let i = 0; i < jsonGroups.grupos.length; i++) {
    //     for (let i = 0; i < jsonGroups.grupos[i].mensagens.length; i++) {                                 
    //               createComponentMsg(jsonGroups.grupos[i].mensagens[i].usuario, 
    //               jsonGroups.grupos[i].mensagens[i].texto );};};   
}  

if(localStorage.getItem("user")){
   
    addGroup();    

    function event_click_group(){  

        let click_group = document.querySelectorAll(".menu-lateral ul li")
        for(let i = 0; i < click_group.length; i++ ){
        
            click_group[i].addEventListener("click", function(){                   
                let groupId = (click_group[i].lastChild.value);
                groupAtive = groupId;
                let groupName = (click_group[i].childNodes[1].textContent);
                body_chat.innerHTML = "";
                openMsgs(groupId, groupName); 
            });
        }

    }

    let btn_msg = document.querySelector(".chat .msg-chat .btn-msg");
    btn_msg.addEventListener("click", function(){
        let input_msg = document.querySelector(".chat .msg-chat .input-msg");
        if(groupAtive){
            send_msg(groupAtive, input_msg.value);
            input_msg.value = "";
        }
        
    });

    function send_msg(groupID, content){
        let xmlr = new XMLHttpRequest;

        xmlr.onreadystatechange = function(){
            if(xmlr.readyState == 4){
                let data = JSON.parse(xmlr.responseText)
                createComponentMsg(data)
            }
        }
        var user = localStorage.getItem("user");
        var messag = {userName:user, message:content}
    
        xmlr.open("POST", url_msg+groupID, true);
        xmlr.setRequestHeader("Content-type", "application/json");
        xmlr.send(JSON.stringify(messag));
    }

    let btn_menu_group = document.querySelector(".menu-lateral .menu-gp .menu-btn");
    btn_menu_group.addEventListener("click", function(){
        let input_group = document.querySelector(".menu-lateral .menu-gp .menu-input");
        let input_group_id = document.querySelector(".menu-lateral .menu-gp .menu-input-id");
        create_group(input_group_id.value, input_group.value);  
        input_group.value = "";
        input_group_id.value = "";
    });

    function create_group(groupID, groupName){
        
        let xmlr = new XMLHttpRequest;

        xmlr.onreadystatechange = function(){
            if(xmlr.readyState == 4){
                let data = JSON.parse(xmlr.responseText)                
                addGroup();          
            }        
        }
        var user = localStorage.getItem("user");
        var data_send= {groupID:groupID, groupName:groupName}
    
        xmlr.open("POST", url, true);
        xmlr.setRequestHeader("Content-type", "application/json");
        xmlr.send(JSON.stringify(data_send));
    }
  
}


