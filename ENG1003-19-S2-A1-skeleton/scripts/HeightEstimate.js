// Start: code for device orientation

let deviceAbsolute = null;
// try-catch: exception handling
try
{
    // initialising object for device orientation
    deviceAbsolute = new AbsoluteOrientationSensor({ frequency: 10 });

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
  if (reading.length == 10) {
    let sum = 0;
    for (let i of reading) {
      sum += i;
    }
    average = (sum / 10).toFixed(2);
    reading = [];
    document.getElementById("tiltingAngle").innerText = average;
  }
}

// end: code for device orientation

//feature 3
//set camera height
let cameraHeight;
function input() {
  cameraHeight = prompt("Input camera height: ");
  while (isNaN(cameraHeight) || cameraHeight == 0) {
    cameraHeight = prompt("Please input valid camera height: ");
  }
  document.getElementById("heightOfCamera").innerText = cameraHeight;
}
