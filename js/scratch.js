//----------- Load Google Charts ---------------
google.charts.load('current', {packages: ['corechart', 'line']}); // Load for Line
google.charts.load('current', {packages: ['corechart', 'bar']});  // Load for Bar
google.charts.load('current', {'packages':['corechart']});  // Load for Pie
//----------- End of Loading Google Charts --------

//----------- Global Variables (Data) ----------
var csvFile = null;
var data = null;
var pieChart = null;
var barChart = null;
var lineChart = null;
//----------- End of Global Variables -----------

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
            data = results.data;
            headers = results.meta .fields;
            //headers = data.shift(); // returns first row, which are headers, and then removes it from array
            console.log("Headers:", headers); 
            console.log("Data:", data);  // Get a record: data[0].Zipcode | where data[n'th item]."header"
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

    // Clear Messages
    document.getElementById('messageArea').textContent = "Data has been cleared!";
}
//-------- End of Button Handlers ---------
$('.table').footable({
    "columns": [
        { "name": "id", "title": "ID" },
        { "name": "firstName"},
        { "name": "lastName"},
        { "name": "jobTitle"},
        { "name": "started"},
        { "name": "dob"}
    ],
    "rows": [
        { "id": "123", "firstName": "John", "lastName": "Paul", "jobTitle": "Chef", "started": "11-5-20", "dob": "02-9-98" },
        { "id": "123", "firstName": "John", "lastName": "Paul", "jobTitle": "Chef", "started": "11-5-20", "dob": "02-9-98" },
        { "id": "123", "firstName": "John", "lastName": "Paul", "jobTitle": "Chef", "started": "11-5-20", "dob": "02-9-98" },
        { "id": "123", "firstName": "John", "lastName": "Paul", "jobTitle": "Chef", "started": "11-5-20", "dob": "02-9-98" }
    ]
});