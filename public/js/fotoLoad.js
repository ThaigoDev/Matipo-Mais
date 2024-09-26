 function loadFileEdited (event,i) { 
  console.log(i) 
  let image = document.getElementById(`output-edited-${i}`); 
  console.log(image)
  image.src = URL.createObjectURL(event.target.files[0]);
};
 function loadFile (event) {
    let image = document.getElementById("output");
    image.src = URL.createObjectURL(event.target.files[0]);
  }; 


  
  