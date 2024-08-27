var loadFile = function (event) {
    var image = document.getElementById("output");
    image.src = URL.createObjectURL(event.target.files[0]);
  }; 

  var loadFileEdited = function (event,i) {
    var image = document.getElementById(`output-${i}`);
    image.src = URL.createObjectURL(event.target.files[0]);
  };
  
  