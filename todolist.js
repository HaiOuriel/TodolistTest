
    function AddNewElement() {

    var trCurrRow = document.createElement("tr");
    var inputValue = document.getElementById("myInput").value;
    if (inputValue == '') {
        alert("You must write something!");
      }else {

        var tdTitle = document.createElement("td");
        var TitleText = document.createTextNode(inputValue);
        tdTitle.appendChild(TitleText);

        var DescriptioninputValue = document.getElementById("Description").value;
        var tdDescriptuion = document.createElement("td");
        var DescriptionText = document.createTextNode(DescriptioninputValue);
        tdDescriptuion.appendChild(DescriptionText);

        var DateinputValue = document.getElementById("Date-to-do").value;
        var tdDate = document.createElement("td");
        var DateText = document.createTextNode(DateinputValue);
        tdDate.appendChild(DateText);

        var date = new Date();
        var tdcurrDate = document.createElement("td");
        var CurrDateText = document.createTextNode(date.toDateString() +" at " +date.toLocaleTimeString());
        tdcurrDate.appendChild(CurrDateText); 

        trCurrRow.appendChild(tdTitle)
        trCurrRow.appendChild(tdDescriptuion)
        trCurrRow.appendChild(tdDate)
        trCurrRow.appendChild(tdcurrDate)
       
        
     
      document.getElementById("Table-list").appendChild(trCurrRow);

      document.getElementById("myInput").value = "";
      document.getElementById("Description").value = "";
      document.getElementById("Date-to-do").value = "";


    }
   
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    trCurrRow.appendChild(span);
  
   
  
    for (i = 0; i < close.length; i++) {
        close[i].onclick = function() {
          var div = this.parentElement;
          div.style.display = "none";
        }
      }
  }

var myNodelist = document.getElementsByTagName("td");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}



