//----------- Load Google Charts ---------------
google.charts.load('current', {packages: ['corechart', 'line']}); // Load for Line
google.charts.load('current', {packages: ['corechart', 'bar']});  // Load for Bar
google.charts.load('current', {'packages':['corechart']});  // Load for Pie
//----------- End of Loading Google Charts --------

//----------- Global Variables (Data) ----------
var csvFile = null;
var unfilteredData = null;
var data = null;
var pieChart = null;
var barChart = null;
var lineChart = null;
//----------- End of Global Variables -----------

const checkChoice = () => {
    var choice;

    if($("#AvgWages").prop("checked")){
        choice = "AvgWages";
    } else if($("#EstimatedPopulation").prop("checked")) {
        choice = "EstimatedPopulation";
    } else if($("#State").prop("checked")) {
        choice = "Count";
    } else {
        choice = null;
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

const drawLine = choice => {
    lineData = new google.visualization.DataTable();
  
    var options = {
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
    
    var newData = cleanData(choice);
    lineData.addRows(newData);
  
    lineChart = new google.visualization.LineChart(document.getElementById('chart-div-2'));
    lineChart.draw(lineData, options);
}

const drawBar = choice => {
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
    
  
    barChart = new google.visualization.ColumnChart(document.getElementById('chart-div-1'));
    barChart.draw(barData, options);
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
    var choice = checkChoice();

    if(choice === "AvgWages"){
        drawBar(choice);
        drawLine(choice);
    } else if(choice == "EstimatedPopulation"){
        drawBar(choice);
        drawLine(choice);
    } else if (choice == "State"){
        drawBar(choice);
        drawPie(choice);
    } else{
        console.log("drawCharts failure...");
    }
}

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
    var headers;
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
    
    // Remove charts
    if (pieChart != null){
        pieChart.clearChart();
    }

    if (barChart != null){
        barChart.clearChart();
    }

    if (lineChart != null){
        lineChart.clearChart();
    }

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