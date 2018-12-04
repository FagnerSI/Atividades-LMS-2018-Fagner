
let url_user = "http://rem-rest-api.herokuapp.com/api/liveuser";
let url_teste = "http://rest.learncode.academy/api/lms/protucts";
let documento = window.location.href.substr(window.location.href.lastIndexOf("/") + 1);


function appState(){

  if(localStorage.userLogado){

   let user = JSON.parse(localStorage.userLogado)
   let $btn_entrar =  $("#btn-entrar");

   $btn_entrar.text("Sair"); 
   $btn_entrar.removeClass("dropdown-toggle"); 
   $btn_entrar.attr("title", user.email);


   $("#btn-entrar").click(function(){
     $(this).empty();

     localStorage.removeItem("userLogado");    
     location.reload();

     let documento = window.location.href.substr(window.location.href.lastIndexOf("/") + 1);

     if(documento.indexOf("compras.html") != -1){
      window.location.href = window.location.href.replace("compras.html","index.html")
    }
  });

   $("#create-account").addClass("disabled-component");
   $("#car").removeClass("disabled-component"); 
   $(".input-group.disabled-component").removeClass("disabled-component"); 
   handleClickButtonCard();
 }
}

appState()


$("#btn-login").click(function(event){

  let $email = $("#login-email");
  let $password = $("#login-senha");       

  let user = {
    email:$email.val(),
    password:$password.val()
  }  
  

  if(!login(user)){

    if(!$email[0].checkValidity()){
      alertUser($email[0].validationMessage);     
    }
    else{

      if(!$password[0].checkValidity()){
        alertUser($password[0].validationMessage)
      }
      else{
        event.preventDefault();
        $email.val(""),
        $password.val(""),
        alertUser("Usuário e/ou senha incorreto(s). Tente Novamente!");
      }
    }
  }

});

$("#btn-create").click(function(event){

  let $email = $("#account-email").val();
  let $password = $("#account-senha").val();

  let user = {
    email:$email,
    password:$password
  }

  createAccount(user)                

});

$("#car").click(function(){
  
 
  for(let i = 0; i < 6; i++){
   
    if(localStorage.getItem("product"+i)){
       let product = JSON.parse(localStorage.getItem("product"+i));

       let componentProduct = "<li class='list-group-item d-flex justify-content-between align-items-center'>"
                     +product.name
                     +"<br>"
                     +"R$ "+product.value
                     +"<span class='badge badge-primary badge-pill'>"
                     +product.qtd
                     +"</span> </li>";

       $("#car .list-group").append(componentProduct); 
    }
  }

 });

$("#finaleAll").click(function(){
 
  for(let i = 0; i < 6; i++){   
    
    if(localStorage.getItem("product"+i)){
       post(url_teste, JSON.parse(localStorage.getItem("product"+i)));
     }
   }
   
   get(url_teste);
});

if(documento.indexOf("compras.html") != -1){
 
  let total = 0;

  for(let i = 0; i < 6; i++){
   
    if(localStorage.getItem("product"+i)){
       let product = JSON.parse(localStorage.getItem("product"+i));

       let componentProduct = "<tr>"
                     +"<td>"+product.name+"</td>"
                     +"<td>"+product.qtd+"</td>"
                     +"<td>"+product.value+"</td>"
                     +"</tr>";

       $("#tableTemp tbody").append(componentProduct); 
       total += parseFloat(product.value.replace(",","."));       
    }

    $("#total").text(" R$ "+ total);
  }

  get(url_teste);
};


function handleClickButtonCard(){

  let btnsCards = $(".card .input-group button");
  let titlesCards = $(".card .card-body .card-title");
  let valueCards = $(".card .card-body .value i");  
  let qtdsCards = $(".card .card-body .input-group input");   
  
  $.each(btnsCards, function(i, item) {   

    btnsCards[i].addEventListener("click", function(){      

      let product = { 
        name: titlesCards[i].innerText,
        value: valueCards[i].innerHTML,
        qtd: qtdsCards[i].value
      }

      localStorage.setItem( "product"+i, JSON.stringify(product));
     
    });
  });
}


function createAccount(user){  
  localStorage.userCreated = JSON.stringify(user);
  localStorage.userLogado = localStorage.userCreated;
}

function login(user){    
 let userString = JSON.stringify(user);   

 if(userString == localStorage.userCreated){
  localStorage.userLogado = userString;
  return true;
 }
return false; 
}

function post(url_send, data_send) {       

  $.ajax({
    type:'POST',
    url: url_send,  
    data: data_send,                
    success: function(data){                   
     console.log(data)
   }
 }); 

}       

function get(url_get){
  $.ajax({
    type:'GET',
    url: url_get,              
    success: function(data){     
      handleData(data); 
    }
  });
}

function handleData(data){
  
 $("#tableTempFinale tbody").empty();
 
 $.each(data, function(i, item) {   

     let componentProduct = "<tr>"
     +"<td>"+data[i].name+"</td>"
     +"<td>"+data[i].qtd+"</td>"
     +"<td>"+data[i].value+"</td>"
     +"</tr>";

     $("#tableTempFinale tbody").append(componentProduct);

 });
}

function alertUser(mensagem){
  let alertMensagem = "<div class='alert alert-danger role='alert'>"+mensagem+"<div>";
  
  if($("#info").children()){
   $("#info").empty();
 }
 $("#info").append(alertMensagem);

}