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

let list_group = document.querySelector(".list-group");
let body_chat = document.querySelector(".body-chat"); 

let url = "http://rest.learncode.academy/api/lms/groups";
let url_msg = "http://rest.learncode.academy/api/lms/";

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

function createComponentMsg(title_chat, message) {            
    
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
                
                for (let i = 0; i < resultRequest[0].grupos.length; i++) {                       
                    createComponentGroup(resultRequest[0].grupos[i].groupName, resultRequest[0].grupos[i].groupID);
                }
                event_click_group();
            }         
        } 
                       
    };

    request.open("GET", url, true);
    request.send();  

    // for (let i = 0; i < jsonGroups.grupos.length; i++) { createComponentGroup(jsonGroups.grupos[i].grupo);};                        
        
}
addGroup();

function openMsgs(groupId, groupName){
    let request = new XMLHttpRequest();
    let group_chat = document.querySelector(".chat .header-chat .group-chat");
             group_chat.innerHTML = groupName;
            
   
    request.onreadystatechange = function(){
        if(request.readyState == 4){
            let resultRequest = JSON.parse(request.responseText);
                               
            for (let i = 0; i < resultRequest[0].mensagens.length; i++) { 
                  let msg = resultRequest[0].mensagens[i];        
                  createComponentMsg(msg.usuario, msg.texto);                         
            }
        }
    };
   
    request.open("GET", url_msg+groupId, true);
    request.send();            

    // for (let i = 0; i < jsonGroups.grupos.length; i++) {
    //     for (let i = 0; i < jsonGroups.grupos[i].mensagens.length; i++) {                                 
    //               createComponentMsg(jsonGroups.grupos[i].mensagens[i].usuario, 
    //               jsonGroups.grupos[i].mensagens[i].texto );};};   
}  

function event_click_group(){  

    let click_group = document.querySelectorAll(".menu-lateral ul li")
    for(let i = 0; i < click_group.length; i++ ){
       
        click_group[i].addEventListener("click", function(){                   
            let groupId = (click_group[i].lastChild.value);
            let groupName = (click_group[i].childNodes[1].textContent);
            body_chat.innerHTML = "";
            openMsgs(groupId, groupName); 
        });
    }

}
