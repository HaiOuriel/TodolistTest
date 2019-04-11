
    $(document).ready(function(){

      setInterval(myTimer, 1000);

      $(document).on('click','#btnDelete',function(e) {
        $(this).parent().parent().hide();
        DeleteTAsk(this.parentElement.parentNode.children.item(2).textContent);    
      });
    
      $(document).on('click','.RadioChoice',function(e){
        Toaffiche(this.value);
        
      })

      $(document).on('click','.Trcheck',function(e){
        if (e.target.id=='btnDelete') {
          
        }else{
        // alert(this.className)
        var updateF= this.children.item(2).textContent;
        var status =this.classList.item(1);

        if (status=="not") {
          status = true;
        }
        else{
          status =false;
        }
        $(this).toggleClass('not');
        $(this).toggleClass('Do');
        CheckedTask(updateF,status);
      }
      });
      Geolocationnn();
      readDatafromserver()
      setInterval(Position,1800000);//All half hour
      
    });
  function Position(){

    Geolocationnn();

    for (let index = 0; index < JsonPositionTask.length; index++) {
      
    if (!(JsonPositionTask[index].finished)&&(distance(crd.latitude,crd.longitude,JsonPositionTask[index].Location.x,JsonPositionTask[index].Location.y,"K")) <= 1){

      swal("You Are less that 1 Km for accomplish this task : "+ JsonPositionTask[index].Title+"", {
        buttons: { //creates a button. You can separate them with a comma.
          cancel: "Cancel!", 
          catch: {
            text: "Try to do it!",
            value: "catch",
          },   
        },
      })
    }
  } 
}
  function CheckedTask(TaskToUpdate,CurrStatus){

    var data ={ 
      "Start": TaskToUpdate,
      "status": CurrStatus,
      };

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/UpdateTask',
      contentType: "application/json",
      // dataType: "JSON",
      data: JSON.stringify(data),
      success: function (data) {
        alert("You Update With succes");
      },
      error: function(error){
        alert("Error: you cant connect to dB" );
       console.log(error);}
    });
  }

 function Toaffiche(choic){
    if (choic =="Finished") {
      $(".Do").show();
      $(".not").hide();
    }
    else if (choic == "NotF") {

      $(".Do").hide();
      $(".not").show();
      
    } else {
      $(".Do").show();
      $(".not").show();
      
    }
  }
 function DeleteTAsk(text){

$.ajax({
  type: 'POST',
  url: 'http://localhost:3000/DeleteTask',
  contentType: "text",
  dataType: "text",
  data: text,
  success: function (data) {
    alert("You deleted With succes");
  },
  error: function(error){
    alert("Error: you cant connect to dB" + NewTAsk);
   console.log(error);
}
});
 }
    var JsonPositionTask;
function readDatafromserver(){
  $.ajax({
    url: 'http://localhost:3000/GetAll',
    type: "GET",
    dataType: "JSON",
    success: function(data){

      JsonPositionTask = data;
        alert("Connection to Db server Succes");
        for (let i = 0; i < data.length; i++) {
          var classe;
          if(data[i].finished)
          {
            classe = "Do"
          }else{
            classe = "not"
          }
          var Title = "<tr class= 'Trcheck  "+classe+"' ><td>"+ data[i].Title + "</td><td>" +data[i].Descr +"</td><td>" +data[i].Start +"</td><td>" +data[i].ExecuteDate +"</td>"+
          +"<td>" +data[i].ExecuteDate +"</td><td> "+data[i].Location.name+"</td><td><button id='btnDelete' class='btn btn-danger'>Delete</button> </td></tr>";

       
                        if (!(data[i].finished)&&(distance(crd.latitude,crd.longitude,data[i].Location.x,data[i].Location.y,"K")) <= 1){
                          swal("You Are less that 1 Km for accomplish this task : "+ data[i].Title+"", {
                            buttons: { //creates a button. You can separate them with a comma.
                              cancel: "Cancel!", 
                              catch: {
                                text: "Try to do it!",
                                value: "catch",
                              },   
                            },
                          })
                        }

          $('#Table-list').append(Title)
          
          
        }
    },
    error: function(error){
          alert("Error: you cant connect to dB");
         console.log(error);
    }
});
 
}


function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};
var crd ;
function success(pos) {
   crd = pos.coords;
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}
 
function Geolocationnn(){
navigator.geolocation.getCurrentPosition(success, error, options);
}



function myTimer() {
  var d = new Date();
 $("timer").innerHTML = d.toLocaleTimeString();
}