
 $(document).ready(function(){

   
  });
  
var Place ;
var Currplace 
window.onload = function() {
    L.mapquest.key = 'lYrP4vF3Uk5zgTiGGuEzQGwGIVDGuy24';

    var map = L.mapquest.map('mapholder', {
      center: [31.96922, 34.83844],
      layers: L.mapquest.tileLayer('map'),
      zoom: 12
    });

    map.addControl(L.mapquest.control());

    map.on('click', function(ev) {
      alert(ev.latlng + ev.latlng.lat); // ev is an event object (MouseEvent in this case)
      if(Currplace == null){
         Currplace = L.marker(ev.latlng).addTo(map);
      }else{
        map.removeLayer(Currplace);
        Currplace = L.marker(ev.latlng).addTo(map);
      }
      Place = ev.latlng;
  });

  }
  var date = new Date();

//   

  function AddTaskToJson(){

  
    var inputValue = $("#TitleInput").val();
    var DateinputValue = document.getElementById("Date-to-do").value;
    if ((inputValue == '') || (DateinputValue == '' )) {
        alert("You must write TITLE and Date !");
      }else {

        var NewTAsk ={ 
             "Title": "",
             "Descr": "",
             "Start": new Date(),
             "ExecuteDate":" ",
             "Location": {  "name":"",
                             "x" :"",
                             "y" :" ",
                         },
              "finished" :false,
            };
        var TitleText = document.createTextNode(inputValue);
        NewTAsk.Title =TitleText.data;

        var DescriptioninputValue = $("#Description").val();
        var DescriptionText = document.createTextNode(DescriptioninputValue);
        NewTAsk.Descr =DescriptionText.data;

        var date = new Date();
        var CurrDateText = document.createTextNode(date.toDateString() +" at " +date.toLocaleTimeString());
        NewTAsk.Start = CurrDateText.data;

        
        var DateText = document.createTextNode(DateinputValue);
        NewTAsk.ExecuteDate = DateText.data;

      if(Place != null){
        NewTAsk.Location.x = Place.lat;
        NewTAsk.Location.y = Place.lng;

        $.ajax({
          // url: 'http://nominatim.openstreetmap.org/reverse?format=json&lat='+Place.lat+'&lon='+Place.lng+'&zoom=15&addressdetails=1',
          //  url: 'http://nominatim.openstreetmap.org/reverse?format=json&lat=31.96922&lon=34.83844&zoom=18&addressdetails=1',
          url: 'http://nominatim.openstreetmap.org/reverse?format=json&lat='+Place.lat+'&lon='+Place.lng+'&zoom=15&addressdetails=1',
          type: "GET",
          dataType: "json",
          success: function(data){
            console.log(data);
            alert(data.display_name)
            NewTAsk.Location.name = data.display_name
            $.ajax({
              type: 'POST',
              url: 'http://localhost:3000/AddTask',
              contentType: "application/json",
              // dataType: "JSON",
              data: JSON.stringify(NewTAsk),
              success: function (data) {
                alert("You add With succes");
              },
              error: function(error){
                alert("Error: you cant connect to dB" + NewTAsk);
               console.log(error);
          }
          });
          }, 
          error: function(error){
              alert("Error: you cant connect to Api" );
             console.log(error);
            }
        });
     
      }
      else{
        $.ajax({
          type: 'POST',
          url: 'http://localhost:3000/AddTask',
          contentType: "application/json",
          // dataType: "JSON",
          data: JSON.stringify(NewTAsk),
          success: function (data) {
            alert("You add With succes");
          },
          error: function(error){
            alert("Error: you cant connect to dB" + NewTAsk);
           console.log(error);
      }
      });
      }

    
      
     
        
      document.getElementById("TitleInput").value = "";
      document.getElementById("Description").value = "";
      document.getElementById("Date-to-do").value = "";

    }
  }
 