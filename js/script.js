var slimServe = "./slim/index.php";

window.onload=function(){
  var rootURL = slimServe+"/getAllTask";
  $.ajax({
    type: 'GET',
    contentType: 'application/json',
    url: rootURL,
    success: function(data, textStatus, jqXHR){
      var tasks = JSON.parse(data);
      if(tasks.length>0){
        for (var i = 0; i < tasks.length; i++) {
          addTaskInHTML(tasks[i].id,tasks[i].description,tasks[i].state);
        }
      }
      updateEventListen();
    },
    error: function(jqXHR, textStatus, errorThrown){
      errorAjax();
    }
  });
}
function modifyState(){
  var id = $(this).attr("key");
  switch (this.attributes.state.value) {
    case "activated":
      if(changeState(id,1)){
        this.attributes.state.value = "disabled";
        this.classList.add("disabled");
      }
      break;
    case "disabled":
      if(changeState(id,0)){
        this.attributes.state.value = "activated";
        this.classList.remove("disabled");
      }
      break;
    default:
      // Error State Unknown
      break;
  }
}
function changeState(id, state){
  var rootURL = slimServe+"/changeState",
      data = {
        id:id,
        state:state
      },
      aux = false;
  return $.ajax({
    type: 'PUT',
    contentType: 'application/json',
    url: rootURL,
    data: JSON.stringify(data),
    success: function(data, textStatus, jqXHR){
      res = JSON.parse(data);
      if (res.error) {
        msg('Error',res.error.text);
      } else if(res.correct){
        msg('Success','Estado De Tasca Modificada Correctamente!');
        return true;
      }else{
        msg('Error','Error grave, contacta con admin por favor');
      }
    },
    error: function(jqXHR, textStatus, errorThrown){
      errorAjax();
    }
  });
  return false;
}
function deleteTasca(){
  var task = $("#"+this.attributes.key.value);
  var rootURL = slimServe+"/deleteTask",
      data = {
        id:$(this).attr('key')
      }
  $.ajax({
    type: 'DELETE',
    contentType: 'application/json',
    url: rootURL,
    data: JSON.stringify(data),
    success: function(data, textStatus, jqXHR){
      res = JSON.parse(data);
      if (res.error) {
        msg('Error',res.error.text);
      } else if(res.correct){
        task.css('display','none');
        msg('Success','Tasca Eliminada Correctamente!');
      }else{
        msg('Error','Error grave, contacta con admin por favor');
      }
    },
    error: function(jqXHR, textStatus, errorThrown){
      errorAjax();
    }
  });
}
function addTask(){
  var rootURL = slimServe+"/addTask",
      data = {
        description:$("#descriptionNewTask").val()
      }
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    url: rootURL,
    data: JSON.stringify(data),
    success: function(data, textStatus, jqXHR){
      res = JSON.parse(data);
      if (res.error) {
        msg('Error',res.error.text);
      } else if(res.correct){
        var id = res.correct.id;
        addTaskInHTML(id,$("#descriptionNewTask").val());
        updateEventListen();
        $("#descriptionNewTask").val("");
        msg('Success','Tasca Creada Correctamente!');
      }else{
        msg('Error','Error grave, contacta con admin por favor');
      }
    },
    error: function(jqXHR, textStatus, errorThrown){
      errorAjax();
    }
  });
}
function changeDescription(){
  //Modify description for dialog
  $("#descriptionTask").val($("#"+$(this).attr("key")+" .description")[0].innerText);
  $("#descriptionTask").attr("key",$(this).attr("key"));
  $('#dialogModify').modal("show");
}
function submitModified(){
  var rootURL = slimServe+"/modifyDescriptionTask",
      data = {
        description:$("#descriptionTask").val(),
        id:$("#descriptionTask").attr("key")
      }
  $.ajax({
    type: 'PUT',
    contentType: 'application/json',
    url: rootURL,
    data: JSON.stringify(data),
    success: function(data, textStatus, jqXHR){
      res = JSON.parse(data);
      if (res.error) {
        msg('Error',res.error.text);
      } else if(res.correct){
        $("#"+$("#descriptionTask").attr("key")+" .description")[0].innerText = $("#descriptionTask").val();
        msg('Success','Tasca Modificada Correctamente!');
      }else{
        msg('Error','Error grave, contacta con admin por favor');
      }
    },
    error: function(jqXHR, textStatus, errorThrown){
      errorAjax();
    }
  });
}
function updateEventListen(){
  //Delete listen For Event
  $(".description").off("click");
  $(".btnDelete").off("click");
  $("#newTask").off('click');
  $(".btnModify").off("click");
  $("#submitModified").off('click');
  //Add Listen For Event
  $(".description").on("click", modifyState);
  $(".btnDelete").on("click", deleteTasca);
  $("#newTask").on('click',addTask);
  $(".btnModify").on("click", changeDescription);
  $("#submitModified").on('click',submitModified);
}
function errorAjax(){
  msg('Error','Fallo conexion al servidor (slim).');
}
function msg(state,description){
  switch (state) {
    case 'Error':
      toastr.error(description, state);
      break;
    case 'Success':
      toastr.success(description, state);
      break;
    case 'Warning':
      toastr.warning(description, state);
      break;
    default:
      toastr.warning(description, 'Estado desconocido, contacta con admin por favor');
      break;
  }
}
function addTaskInHTML(id, description, state){
  var clas = "",
      stat = "",
      html = "";
  clas = (state==1)?' disabled':'';
  stat = (state==1)?'disabled':'activated';
    html =  '<div id="'+id+'" class="task">';
    html += '  <div class="row">';
    html += '    <div class="col-lg-10 col-sm-8">';
    html += '      <span class="description '+clas+'" key="'+id+'" state="'+stat+'">'+description+'</span>';
    html += '    </div>';
    html += '    <div class="col-lg-2 col-sm-4 buttons">';
    html += '      <button class="btn btn-warning btnModify" key="'+id+'">Edit</button>';
    html += '      <button class="btn btn-danger btnDelete" key="'+id+'">X</button>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';
  $("#tasks").append(html);
}