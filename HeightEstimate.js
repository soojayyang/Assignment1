// Start: code for device orientation

let deviceAbsolute = null;
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

// function to print value on the webpage

let reading = [];
let average;

function reloadOrientationValues(deviceAbsolute)
{
  let x = deviceAbsolute.quaternion[0];
  let y = deviceAbsolute.quaternion[1];
  let z = deviceAbsolute.quaternion[2];
  let w = deviceAbsolute.quaternion[3];
  let data = Math.atan2(2*(w*x + y*z), 1 - 2*(Math.pow(x,2)+Math.pow(y,2)))*(180/Math.PI);

//feature 2
//console.log(data);
  reading.push(data);
  if (reading.length == 20)
  {
    let sum = 0;
    for (let i of reading)
    {
      sum += i;
    }
    average = (sum / 20).toFixed(2);
    reading = [];
    document.getElementById("tiltingAngle").innerText = average;
  }

  if (cameraHeight && baseAngle && topAngle) {
    document.getElementById("calculateButton").disabled = false;
  }
}

// end: code for device orientation

//feature 3
//set camera height
let cameraHeight;
function input()
{
  cameraHeight = prompt("Input camera height: ");
  while (isNaN(cameraHeight) || cameraHeight == 0)
  {
    cameraHeight = prompt("Please input valid camera height: ");
  }
  document.getElementById("heightOfCamera").innerText = cameraHeight;
}

//Feature 4a
//set base height
let baseAngle;
function setBase()
{
  baseAngle = average;
  document.getElementById("baseAngle").innerText = baseAngle;
}

//set top angle
let topAngle;
function setTop()
{
  topAngle = average;
  document.getElementById("topAngle").innerText = topAngle;
}

//Feature 5 & 6
function calculate() {
  const CONVERT_TO_RAD= Math.PI/180;

  //distance
  let distance = Math.tan(baseAngle* CONVERT_TO_RAD) * cameraHeight;
  document.getElementById("distanceOfObject").innerText = distance.toFixed(2);

  //building height
  let A = topAngle - baseAngle;
  //let b = Math.sqrt(Math.pow(cameraHeight, 2) + Math.pow(distance, 2));
  let b = cameraHeight/ (Math.cos(baseAngle * CONVERT_TO_RAD));
  let C = baseAngle;
  let B = 180 - A - C;
  let a = b/Math.sin(B*CONVERT_TO_RAD) * Math.sin(A*CONVERT_TO_RAD);
  let buildingHeight = a;

  document.getElementById("heightOfObject").innerText = buildingHeight.toFixed(2);
}
