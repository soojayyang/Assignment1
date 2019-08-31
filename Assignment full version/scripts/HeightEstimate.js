/*
Project Name : Sensor App 
Purpose: To calculate the height of an object 
         by using sensor app 
Team: Team 191 
Authors :
Woon Siang Yi
Vishan Tan 
Lai Khairren
Soo Jay Yang
Last Modified : 31/8/2019
Reference Style: IEEE
*/

// Start: code for device orientation,[2].

let deviceAbsolute = null;
let errorRef = document.getElementById("toast");
// try-catch: exception handling
try
{
    // initialising object for device orientation
    deviceAbsolute = new AbsoluteOrientationSensor({ frequency: 60 });

    //if sensor is available but there is problem in using it
    deviceAbsolute.addEventListener('error', event => {
    // Handle runtime errors.
    if (event.error.name === 'NotAllowedError')
    {
      errorRef.innerText ="Permission to access sensor was denied.";
    }
    else if (event.error.name === 'NotReadableError' )
    {
      errorRef.innerText = "Cannot connect to the sensor.";
    }});
    // when sensor has a reading, call the function
    deviceAbsolute.addEventListener('reading', () => reloadOrientationValues(deviceAbsolute));

    //start the sensor
    deviceAbsolute.start();
}
catch (error)
{
// Handle construction errors.
  let errorText = "";
  if (error.name === 'SecurityError')
  {
    errorText = "Sensor construction was blocked by the Feature Policy.";
  }
  else if (error.name === 'ReferenceError')
  {
    errorText =" Sensor is not supported by the User Agent.";
  }
  else
  {
    errorText = "Sensor not supported";
  }
  errorRef.innerText = errorText;
}

//declaring global variable reading to be an empty array 
//which will contain a set of value of beta angle.
let reading = [];

//declare global variable averageAngle
//which hold the value of the average tilting angle
let averageAngle; 

//this function print the value onto the webpage,[2].
//and smooth the beta angle by finding average value
function reloadOrientationValues(deviceAbsolute)
{
  let x = deviceAbsolute.quaternion[0];
  let y = deviceAbsolute.quaternion[1];
  let z = deviceAbsolute.quaternion[2];
  let w = deviceAbsolute.quaternion[3];
  let data = Math.atan2(2*(w*x + y*z), 1 - 2*(Math.pow(x,2)+Math.pow(y,2)))*(180/Math.PI); 

//Feature 2 
//smooth data
  //adding value into the empty array using .push method.
  reading.push(data);
    
  //pre-allocating maximum length accepted for empty array
  if (reading.length == 20) 
  {
    //declaring global variable summation equal to zero
    let sum = 0;
      
    //initiasing for loop to sum all the elements in reading  
    for (let i of reading) 
    {
      sum += i;
    }
      
    //smoothing data by obtaining the average value in reading
    averageAngle = Math.round((sum / 20)*100)/100; 
      
    //reseting reading to be an empty array
    //to obtain the next set of value of beta angle
    reading = []; 
      
    ///displaying tilting angle in webpage
    document.getElementById("tiltingAngle").innerText = averageAngle; 
  }
  //check whether camera Height, base Angle and top angle had been input by user
  if (cameraHeight && baseAngle && topAngle)
  { 
    //enable the calculate button to function 
    document.getElementById("calculateButton").disabled = false; 
  }
}

// end: code for device orientation

//feature 3
//set camera height
// declared global varibale for camera height
let cameraHeight; 

//this function is designed to display camera height
function input()
{
  //promopt the user to input the camera height
  cameraHeight = prompt("Input camera height (m): "); 
    
  //validating the input for camera height
  if (isNaN(cameraHeight) || cameraHeight <= 0) 
  {
    // default camera height is set to 1.5m 
    cameraHeight = 1.5;
    alert("Camera Height invalid, set to default height"); 
  }
  else
  {
    alert("Camera Height successfully inputted"); 
  }
  //displaying camera height in webpage
  document.getElementById("heightOfCamera").innerText = cameraHeight + "m"; 
}

//Feature 4a
//set base height
//pre-allocate global variable base angle to be zero 
let baseAngle = 0; 
function setBase()
{
  //validating the input for base angle
  if (averageAngle > 0 && averageAngle < 90) 
  {
    baseAngle = averageAngle;
    alert("Base Angle successfully recorded");
    //displaying base angle in webpage
    document.getElementById("baseAngle").innerText = baseAngle; 
  }
  else
  {
    alert("Base angle must be between 0 and 90 degree");
  }
}

//set top angle
let topAngle = 0;
function setTop()
{
  //validating the input for top angle
  if (averageAngle > 0 && averageAngle < 180 && averageAngle > baseAngle) 
  {
    topAngle = averageAngle;
    alert("Top angle successfully recorded");
    //displaying top angle in webpage
    document.getElementById("topAngle").innerText = topAngle; 
  }
  else
  {
    alert("Top angle must be higher than base angle and below 180 degree");
  }
}

//Feature 5 & 6
//calculate the disance to the object
//calculate the height of an object
//this function will calculate the distance to the object
//and calculate the height of an object
function calculate()
{
  //declaring global variable CONVERT_TO_RAD
  //which contain the formula to convert degree to radian,[1].
  const CONVERT_TO_RAD= Math.PI/180; 

  //calculating distance using tangent(base angle) equal to horizontal distance/camera height
  //distance is equal to tangent(base angle) * camera height
  let distance = Math.tan(baseAngle* CONVERT_TO_RAD) * cameraHeight;
  
  //displaying distance onto the webpage
  document.getElementById("distanceOfObject").innerText = distance.toFixed(2) + "m";

  //calculating angle 1 in the triangle
  //which is the top angle minus base angle,[1].
  //declaring global variable A
  //which hold the value of the angle 1
  let A = topAngle - baseAngle;
    
  //calculating the length of hypotenuse 
  //by using cosine(base angle) equal to camera height/hypoteuse,[1].
  //length of hypotenuse equal to camera height/cosine(base angle)
  //declaring b to be global variable 
  //which hold the value of length of hypotenuse
  let b = cameraHeight/ (Math.cos(baseAngle * CONVERT_TO_RAD));
    
  //declaring c to be global variable
  //which hold the value of base angle
  let C = baseAngle;
  
  //calculating angle 2 in the triangle
  //which is 180 - angle 1 - base angle,[1].
  //declaring global variable B 
  //which hold the value of angle 2
  let B = 180 - A - C;
    
  //calculating height of object
  //by using sin rule
  //height of object/sin(angle 2) = length of hypotenuse/sin(angle 1)
  //height of object = (length of hypotenuse/sin(angle 1)) * sin(angle 2),[3].
  //declaring global variable a
  //which hold the value of the height of object
  let a = b/Math.sin(B*CONVERT_TO_RAD) * Math.sin(A*CONVERT_TO_RAD);
    
  //declaring global variable buildingHeight
  //which hold the value of a 
  let buildingHeight = a;

  //displaying height of the object in webpage
  document.getElementById("heightOfObject").innerText = buildingHeight.toFixed(2) + "m";
}

/*
Reference List
[1]"Trigonometry", Mathsisfun.com, 2016. [Online]. Available: https://www.mathsisfun.com/algebra/trigonometry.html.
[2]"Sensors", Eng1003.monash, 2019. [Online]. Available: https://eng1003.monash/materials/walkthrough/sensors.html.
[3]S, "Law of Sines Definition (Illustrated Mathematics Dictionary)", Mathsisfun.com, 2018. [Online]. Available: https://www.mathsisfun.com/definitions/law-of-sines.html
*/
