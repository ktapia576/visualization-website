//----------- Load Google Charts ---------------
google.charts.load('current', {packages: ['corechart', 'line']}); // Load for Line
google.charts.load('current', {packages: ['corechart', 'bar']});  // Load for Bar
google.charts.load('current', {'packages':['corechart']});  // Load for Pie
//----------- End of Loading Google Charts --------

//----------- Global Variables (Data) ----------
let csvFile = null;
let unfilteredData = null;
let data = null;
let pieChart = null;
let barChart = null;
let lineChart = null;
//----------- End of Global Variables -----------

const clearCharts = () => {
  if (pieChart != null){
    pieChart.clearChart();
  }
  if (barChart != null){
    barChart.clearChart();
  }
  if (lineChart != null){
    lineChart.clearChart();
  }
}


const clearWorkspace = () => {
  // remove table
  $("table").empty(); // removes all child nodes and content from the selected elements

  clearCharts();
}

const checkChoice = () => {
  let choice;

  if($("#AvgWages").prop("checked")){
    choice = "AvgWages";
  } else if($("#EstimatedPopulation").prop("checked")) {
    choice = "EstimatedPopulation";
  } else if($("#State").prop("checked")) {
    choice = "Count";
  } else {
    choice = null;
    console.log(`Error with checkChoice(): choice=${choice}`);
  }

  return choice;
}

const cleanData = choice => {
    var states =[];
    var newData=[];
  
    // Get states
    data.forEach( row => { 
      states.push(row.State);
    });
    states = new Set(states); // Get unique states
  
    // Get avg of choice per state
    var count = 0;
    var total = 0;
  
    // Check what choice
    if (choice == "AvgWages") {
      states.forEach(state => {
        data.forEach(dataRow => {
          if(state == dataRow.State){
            if(isNaN(Number(dataRow.AvgWages))){
              // skip
            } else {
              total = total + Number(dataRow.AvgWages);
              count++;
            }
          }
        });
  
        newData.push([state, total/count]);
        total=0;
        count=0;
      });
    } else if (choice == "EstimatedPopulation") {  
      states.forEach(state => {
        data.forEach(dataRow => {
          if(state == dataRow.State){
            if(isNaN(Number(dataRow.AvgWages))){
              // skip
            } else {
              total = total + Number(dataRow.EstimatedPopulation);
              count++;
            }
          }
        });
  
        newData.push([state, total/count]);
        total=0;
        count=0;
      });
    } else if (choice == "Count") {
      states.forEach(state => {
        data.forEach(dataRow => {
          if(state == dataRow.State){
            count++;
          }
        });
  
        newData.push([state, count]);
        total=0;
        count=0;
      });
    } else {
      console.log("Error with choice");
    }
    return newData;
}

const drawLine = (choice, elementID) => {
  lineData = new google.visualization.DataTable();

  let options = {
    height: 450,
    title: `${choice} by State`,
    hAxis: {
      title: 'State'
    },
    vAxis: {
      title: choice
    },
    backgroundColor: '#ffffff'
  };

  lineData.addColumn('string', 'State');
  lineData.addColumn('number', choice);
  
  let newData = cleanData(choice);
  lineData.addRows(newData);

  lineChart = new google.visualization.LineChart(document.getElementById(elementID));
  lineChart.draw(lineData, options);
}

const drawBar = (choice,elementID) => {
    var dataArray = [];
    dataArray.push(['State', choice]);
  
    var newData = cleanData(choice);
    newData.forEach(row => { dataArray.push(row)});
  
    var barData = google.visualization.arrayToDataTable(dataArray);
  
    var options = {
        height: 450,
        title: `${choice} by State`,
        hAxis: {
          title: "State"
        },
        vAxis: {
          title: choice
        }
    };
    
  
    barChart = new google.visualization.ColumnChart(document.getElementById(elementID));
    barChart.draw(barData, options);
}

const drawPie = (choice, elementID) => {
  var dataArray = [];
  dataArray.push(['State', choice]);

  var newData = cleanData(choice);
  newData.forEach(row => { dataArray.push(row)});

  var pieData = google.visualization.arrayToDataTable(dataArray);

  var options = {
    height: 400,
    title: `${choice} by State`,
    chartArea: {width: '80%', height: '80%'},
    hAxis: {
      title: choice
    },
    vAxis: {
      title: "State"
    }
  };

  pieChart = new google.visualization.PieChart(document.getElementById(elementID));
  pieChart.draw(pieData, options);
}


//----------- Button Handlers -----------------
const showClientInfo = () => {
    var browser = navigator.userAgent;  // Get user's browser
    var os = navigator.platform; 
    var version = navigator.appVersion;
    var vendor = navigator.vendor;  // Mozilla Firefox returns empty string
    var cookie = navigator.cookieEnabled;
    var java= navigator.javaEnabled();

    var clientInfo = `<b>Browser:</b> ${browser}, <b>${vendor}</b></br>
        <b>OS Platform:</b> ${os}</br>
        <b>Browser Version:</b> ${version}</br>
        <b>Cookies Enabled:</b> ${cookie}</br>
        <b>Java Enabled:</b> ${java}</br>`;
    
    document.getElementById('clientInfo').innerHTML = clientInfo; // innerHTML returns HTML, textContent has better performance because its value is not parsed as HTML
    $('#clientInfoModal').modal('toggle');
}

const showUserInfo = () => {
    var cookies = Cookies.get(); // get object of all cookies

    // Check if Cookie set
    if (cookies.username == null){ // Check if null and undefined simultaneously
        document.getElementById('userInfo').textContent = "Login to see User info!";
    } else {
        var userInfo = `<b>UID:</b> ${cookies.uid}</br>
        <b>Username:</b> ${cookies.username}</br>
        <b>Name:</b> ${cookies.name}</br>
        <b>Gender:</b> ${cookies.gender}</br>`;

        document.getElementById('userInfo').innerHTML = userInfo; // innerHTML returns HTML, textContent has better performance because its value is not parsed as HTML
    }

    $('#userInfoModal').modal('toggle');  // Show modal
}

const drawCharts = () => {
  let choice = checkChoice();

  clearCharts();

  // Check whether to draw bar and pie chart
  if(choice == "Count") {
    drawBar(choice, "chart-div-1");
    drawPie(choice, "chart-div-2");
    return;
  }

  drawBar(choice, "chart-div-1");
  drawLine(choice, "chart-div-2");
}

$("#drawBar").click(e => {
  let choice = checkChoice();

  clearCharts();
  drawBar(choice, "chart-div-1");
});

$("#drawLine").click(e => {
  let choice = checkChoice();

  clearCharts();

  // Check if State(Bar, Pie) chosen
  if(choice === "Count"){
    console.log("Cannot draw Line for selected chart...");
    return;
  }

  drawLine(choice, "chart-div-1");
});

$("#drawPie").click(e => {
  let choice = checkChoice();

  clearCharts();

  // Check if State(Bar, Pie) chosen
  if(choice === "Count"){
    drawPie(choice, "chart-div-1");
  }

  console.log("Cannot use pie chart for selected chart...");
});

$("#drawMap").click(e => {
  clearCharts();
  console.log("Draw Map has been called...");
});

$("#bothCharts").click(e => {
  drawCharts();
});

$("#login").submit(e => {
  e.preventDefault(); // avoid to execute the actual submit of the form.

  var form = $("#login");
  var url = form.attr('action');
  console.log(form.serialize());

  $.ajax({
    type: "POST",
    url: url,
    data: form.serialize(), // serializes the form's elements.,
    success: result => {
      var cookies = Cookies.get(); // get object of all cookies

      document.getElementById('loginDropmenu').style.display='none';
      document.getElementById("username").textContent = cookies.username;
      document.getElementById("username-item").style.display='block';
      document.getElementById('sign-out').style.display='block';

      console.log("success");
      console.log(result);
    },
    error: result => {
      var message = result.responseJSON.message;
      console.log("error");
      console.log(result);
    }
  });
});

//------- End of Button Handlers -------------

//------- Clean Data from CSV File -----------
const formatData = unformattedData => {
    var formattedData = [];
    unformattedData.forEach( row => {
        var obj = {
            "RecordNumber": row.RecordNumber, 
            "Zipcode": Number(row.Zipcode), 
            "City": row.City, 
            "State": row.State, 
            "EstimatedPopulation": Number(row.EstimatedPopulation), 
            "AvgWages": Number(row.AvgWages), 
            "Latitude": Number(row.Latitude), 
            "Longitude": Number(row.Longitude)
        }
        formattedData.push(obj);
    });
    return formattedData;
}
//------- End of Cleaning Data ---------------


//----- Load File -------
$("#file").change( e => {  // when value of input changes (once user uploads file), do this [change event is sent to an element when its value changes]
    loadFile();
});

const loadFile = () => {

  clearWorkspace();
  clearCharts();


  let headers;
  csvFile = document.getElementById("file").files[0];   // get first file only
  console.log(csvFile.size);
    
  // Parse local CSV file
  Papa.parse(csvFile, {
      delimiter: ",",
      header: true,
      skipEmptyLines: true, //  lines that are completely empty will be skipped
      complete: results => {  // Callback to execute when parsing complete
          console.log("Finished:", results); 
          unformattedData = results.data;
          console.log("unfiltered:",unformattedData);
          headers = results.meta .fields;
          //headers = data.shift(); // returns first row, which are headers, and then removes it from array
          console.log("Headers:", headers); 

          data = formatData(unformattedData);
          console.log("Data:", data);

          $('.table').footable({
              "paging": {
                  "enabled": true,
                  "size": 15
              },
              "sorting": {
                  "enabled": true
              },
              "columns": $.get("content/columns.json"),   // Load columns.json
              "rows": data
          });
      }, 
      error: error => {   // Callback to execute if FileReader encounters an error.
          console.log(error.message); 
      } 
  });
}
//------ End of Load File ----------

const exit = () => {
  // Remove all cookies
  Cookies.remove("name"); 
  Cookies.remove("gender"); 
  Cookies.remove("uid"); 
  Cookies.remove("username"); 
  
  clearWorkspace();
  
  // Clear Data
  csvFile = null;
  data = null;
  pieChart = null;
  barChart = null;
  lineChart = null;

  // remove table
  $("table").empty(); // removes all child nodes and content from the selected elements

  // Clear Messages
  document.getElementById('messageArea').textContent = "Data has been cleared!";
}
//-------- End of Button Handlers ---------