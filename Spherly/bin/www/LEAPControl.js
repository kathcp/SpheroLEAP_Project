// ********** Variables Section ************* //

var controller = new Leap.Controller();
var oldCoords = [0,0,0];
var directions = ["RIGHT","LEFT","UP","DOWN","BACK","FORWARD"];

// ********** Function Section ************* //

// Function that defines the direction of the hand
function defineDirections(newCoords){

  // X vector - Increase = RIGHT; Decrease = LEFT
  // Y vector - Increase = UP; Decrease = DOWN
  // Z vector - Increase = BACK; Decrease = FORWARD
  
  // loop to verify the direction
  for (var i = 0; i < oldCoords.length; i++){

    var result = "";

    if (newCoords[i]){
    
      // check if the old coordinates are setted up 
      for (var j = 0; j < oldCoords.length; j++){
        if (oldCoords[j] === 0){
          oldCoords[j] = newCoords[j];
        }
      }
  
      //verify the direction of the coordinate
      if (newCoords[i] - oldCoords[i] >= 0.05){
        result += directions[2*i];
      }
      else if(oldCoords[i] - newCoords[i] >= 0.05){
        result += directions[(2*i)+1];
      }
      else{
        result += "STOP";
      }

      //change the image of the black arrow for the green one and call sendCommands
      if (result !== null && result !== "STOP"){
        
        var direction = document.getElementById(result);
        var newImage = "img/" + result + "_Active.png";
        direction.src = newImage;

        var att = document.createAttribute("onload");
        att.value = "tryTo(SpheroManager.sendCommands)";
        direction.setAttributeNode(att);

        var oldImage = "img/" + result + ".png";
        direction.src = oldImage;
      }

      oldCoords[i] = newCoords[i];
    }
  }
}


// function that returns the values of a vector in a more readable way 
function vectorToString(vector, digits){

  if (typeof digits === "undefined") {
  digits = 1;
  }
  
  var newVector = [vector[0].toFixed(digits), vector[1].toFixed(digits), vector[2].toFixed(digits)];
  
  return newVector;
}

// ********** Main Section ************* //
controller.on("frame", function(frame){

  if(frame.pointables.length > 0)
  {      
 
        //Get a pointable and normalize the tip position
        var pointable = frame.pointables[0];
        var interactionBox = frame.interactionBox;
        var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);
    
        currentCoords = vectorToString(normalizedPosition,2);
    
        defineDirections(currentCoords);        
    }
});
controller.connect();
