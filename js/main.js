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
let correlationChart= null;
let maxNum = null;
let maxNumPopulation = null;
let maxNumWages = null; 
let minNumPopulation = null;
let minNumWages = null; 
let mapDrawn = false;
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
  if (mapDrawn) {
    document.getElementById('mapid').style.display='none';
  }
}

const setSliderValues = () => {
  let cookies = Cookies.get(); // get object of all cookies

  $('#estimatedPopulationsSlider').attr('min', minNumPopulation);
  $('#estimatedPopulationsSlider').attr('max', maxNumPopulation);

  $('#AvgWagesSlider').attr('min', minNumWages);
  $('#AvgWagesSlider').attr('max', maxNumWages);

  // Check if Cookie set
  if (cookies.username == null){ // Check if null and undefined simultaneously
    $('#estimatedPopulationsSlider').val(Math.ceil(getAvgPopulation()));
    document.getElementById('rangeValue1').textContent = `Value: ${Math.ceil(getAvgPopulation())}`;
    

    $('#AvgWagesSlider').val(Math.ceil(getAvgAvgWages()));
    document.getElementById('rangeValue2').textContent = `Value: ${Math.ceil(getAvgAvgWages())}`;
  } else {
    $.ajax({
      type:"POST",
      url:"src/loadSettings.php",
      data: {
        uid: cookies.uid
      },
      success: result => {
        let message = result.message;
        let settings = JSON.parse(result.settings);
        let AvgWages = settings[0].AvgWages;
        let EstimatedPopulation = settings[0].EstimatedPopulation;

        console.log(message);

        $('#estimatedPopulationsSlider').val(EstimatedPopulation);
        document.getElementById('rangeValue1').textContent = `Value: ${EstimatedPopulation}`;

        $('#AvgWagesSlider').val(AvgWages);
        document.getElementById('rangeValue2').textContent = `Value: ${AvgWages}`;

        console.log(settings);
      },
      error: result => {
        console.log(result);
        console.log(result.message);
        $('#estimatedPopulationsSlider').val(Math.ceil(getAvgPopulation()));
        document.getElementById('rangeValue1').textContent = `Value: ${Math.ceil(getAvgPopulation())}`;
        
    
        $('#AvgWagesSlider').val(Math.ceil(getAvgAvgWages()));
        document.getElementById('rangeValue2').textContent = `Value: ${Math.ceil(getAvgAvgWages())}`;
      }
    });
  }

}

const colorTablePopulation = () => {
  // index 4 is Estimated population | index 5 is AvgWages

  $('#table > tbody  > tr').each(function(index, tr) { 
    let cellNum = parseFloat(tr.cells[4].innerHTML.replace(/,/g, ''));
    let sliderVal = Number($('#estimatedPopulationsSlider').val());

    if(cellNum >= sliderVal){
      $(tr.cells[4]).addClass("text-success");
    } else {
      $(tr.cells[4]).removeClass("text-success");
    }

    // $(tr.cells[4]).removeClass("bg-success");
    // console.log(tr.cells[4].innerHTML);
  });
}

const colorTableWages = () => {
  // index 4 is Estimated population | index 5 is AvgWages

  $('#table > tbody  > tr').each(function(index, tr) { 
    let cellNum = parseFloat(tr.cells[5].innerHTML.replace(/,/g, ''));
    
    let sliderVal = Number($('#AvgWagesSlider').val());

    // console.log(cellNum);
    console.log(sliderVal);

    if(cellNum >= sliderVal){
      $(tr.cells[5]).addClass("text-danger");
    } else {
      $(tr.cells[5]).removeClass("text-danger");
    }

    // console.log(`slider value: ${$('#AvgWagesSlider').val()}`);

    // $(tr.cells[5]).removeClass("bg-success");
    // console.log(tr.cells[5].innerHTML);
  });
}

const clearWorkspace = () => {
  // remove table
  $("table").empty(); // removes all child nodes and content from the selected elements

  document.getElementById('mapid').style.display='none';
  clearCharts();

  if (correlationChart != null){
    correlationChart.clearChart();
    document.getElementById('correlationValue').innerHTML = ``;
  }
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

const getAvgAvgWages = () => {
  let nums = [];
  let sum = 0;
  let avg = 0;

  data.forEach(row => { 
    nums.push(Math.ceil(Number(row.AvgWages)));
  });

  for (let i = 0; i<nums.length; i++) {
    sum += nums[i];
  }

  avg = sum/(nums.length);

  return avg;
}

const getAvgPopulation = () => {
  let nums = [];
  let sum = 0;
  let avg = 0;

  data.forEach(row => { 
    nums.push(Math.ceil(Number(row.EstimatedPopulation)));
  });

  for (let i = 0; i<nums.length; i++) {
    sum += nums[i];
  }

  avg = sum/(nums.length);

  return avg;
}

const getMaxNums = () => {
  let highestNumPopulation = [];
  let highestNumAvgWages = [];

  console.log(data);

  data.forEach(row => { 
    highestNumPopulation.push(Math.ceil(Number(row.EstimatedPopulation))); 
    highestNumAvgWages.push(Math.ceil(Number(row.AvgWages)));
  });

  maxNumPopulation = Math.max(...highestNumPopulation);
  maxNumWages = Math.max(...highestNumAvgWages);

  console.log(maxNumPopulation);

  console.log(maxNumWages);
}

const getMinNums = () => {
  let lowestNumPopulation = [];
  let lowestNumAvgWages = [];

  console.log(data);

  data.forEach(row => { 
    lowestNumPopulation.push(Math.ceil(Number(row.EstimatedPopulation))); 
    lowestNumAvgWages.push(Math.ceil(Number(row.AvgWages)));
  });

  minNumPopulation = Math.min(...lowestNumPopulation);
  minNumWages = Math.min(...lowestNumAvgWages);

  console.log(minNumPopulation);

  console.log(minNumWages);
}

const cleanData = choice => {
    var states =[];
    var newData=[];
    let nums=[];

    // console.log(data.length);
  
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
            if(isNaN(Number(dataRow.EstimatedPopulation))){
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
    newData.forEach(row => { nums.push(Number(row[1])); });

    // console.log(newData);
    maxNum = Math.max(...nums);

    return newData;
}

// var data = new Array(
//   new Array(21,54,60,78,82),
//   new Array(20,54,54,65,45)
// );

// console.log(pearsonCorrelation(data,0,1))
const pearsonCorrelation = (prefs, p1, p2) => {
  var si = [];

  for (var key in prefs[p1]) {
    if (prefs[p2][key]) si.push(key);
  }

  var n = si.length;

  if (n == 0) return 0;

  var sum1 = 0;
  for (var i = 0; i < si.length; i++) sum1 += prefs[p1][si[i]];

  var sum2 = 0;
  for (var i = 0; i < si.length; i++) sum2 += prefs[p2][si[i]];

  var sum1Sq = 0;
  for (var i = 0; i < si.length; i++) {
    sum1Sq += Math.pow(prefs[p1][si[i]], 2);
  }

  var sum2Sq = 0;
  for (var i = 0; i < si.length; i++) {
    sum2Sq += Math.pow(prefs[p2][si[i]], 2);
  }

  var pSum = 0;
  for (var i = 0; i < si.length; i++) {
    pSum += prefs[p1][si[i]] * prefs[p2][si[i]];
  }

  var num = pSum - (sum1 * sum2 / n);
  var den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n) *
      (sum2Sq - Math.pow(sum2, 2) / n));

  if (den == 0) return 0;

  return num / den;
}

const cleanLineData = () => {
  let newData=[];
  let wagesNum = Number($('#AvgWagesSlider').val());  
  let populationNum = Number($('#estimatedPopulationsSlider').val());

  console.log(data);

  let count = 0;
  data.forEach( row => {
    let index = [];
    if(row.AvgWages >= wagesNum && row.EstimatedPopulation >= populationNum){
      index.push(count++);
      index.push(Number(row.EstimatedPopulation));
      index.push(Number(row.AvgWages));
      newData.push(index);
    }
  });

  return newData;
}

const getAvgWagesArray = () => {
  let avgWages=[];

  data.forEach(row => {
    avgWages.push(Number(row.AvgWages));
  });

  return avgWages;
}

const getPopulationArray = () => {
  let estimatedPopulation=[];

  data.forEach(row => {
    estimatedPopulation.push(Number(row.EstimatedPopulation));
  });

  return estimatedPopulation;
}

const getCorrelation = () => {
  let newData=[];
  let avgWages=[];
  let estimatedPopulation=[];
  let wagesNum = Number($('#AvgWagesSlider').val());  
  let populationNum = Number($('#estimatedPopulationsSlider').val());

  data.forEach( row => {
    if(row.AvgWages >= wagesNum && row.EstimatedPopulation >= populationNum){
      estimatedPopulation.push(Number(row.EstimatedPopulation));
      avgWages.push(Number(row.AvgWages));
    }
  });

  newData = new Array(avgWages, estimatedPopulation);

  console.log(newData);

  return pearsonCorrelation(newData,0,1);
}

const drawCorrelation = () => {
  if(data == null) {
    // Show Pop up Modal
    document.getElementById('popup-title').textContent = "Error"; 
    document.getElementById('popup-message').textContent = "Load Data First";

    $('#popupModal').modal('toggle');
  }

  let correlationData = new google.visualization.DataTable();

  correlationData.addColumn('number', 'Index');
  correlationData.addColumn('number', 'EstimatedPopulation');
  correlationData.addColumn('number', 'AvgWages');


  var options = {
    chart: {
      title: 'Analytics',
      subtitle: 'Correlation'
    },
    height: 200
  };

  newData = cleanLineData();
  console.log(newData);

  correlationData.addRows(newData);


  correlationChart = new google.visualization.LineChart(document.getElementById('correlation'));
  correlationChart.draw(correlationData, options);

  console.log(getCorrelation());
  document.getElementById('correlationValue').innerHTML = `Correlation: ${getCorrelation()} <br/> Number of records: ${newData.length}`;
}

const drawNonGoogleBar = () => {
  let ctx = document.getElementById('canvas');

  newData=cleanData("AvgWages");
  console.log(cleanData("AvgWages"));
  let labels = [];
  let nums = [];

  newData.forEach(row => {
    labels.push(row[0]);
    nums.push(Math.ceil(row[1]));
  });

  console.log(labels);

  let myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [{
              label: 'AvgWage by State',
              data: nums,
              backgroundColor: getBackColor(),
              borderColor: getBorderColor(),
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: false
                  }
              }]
          }
      }
  });
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
  console.log(newData);
  lineData.addRows(newData);

  lineChart = new google.visualization.LineChart(document.getElementById(elementID));
  lineChart.draw(lineData, options);
}

const drawBar = (choice,elementID) => {
    var dataArray = [];
    dataArray.push(['State', choice]);
  
    var newData = cleanData(choice);
    console.log(newData);
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

const drawMap = () => {
  let mapboxAccessToken = 'pk.eyJ1Ijoia3RhcGlhNTc2IiwiYSI6ImNrM20ydzJnMzFheTIzZXQ3N3JwazU3N28ifQ.nuoJgYJoxVp0SHBzI5zyXg';
  let map = L.map('mapid').setView([37.8, -96], 4);
  let info = L.control();
  let geojson;

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
      id: 'mapbox/light-v9',
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
  }).addTo(map);


  const formatStatesData = statesData => {
    statesData.features.forEach( row => {
      row.properties.AvgWages = "0";
      row.properties.EstimatedPopulation = "0";
      row.properties.Count = "0";
    });

    return statesData;
  }

  const removeNullStates = statesData => {
    let cleanData =  JSON.parse(JSON.stringify(statesData)); // copy object to new variable
    cleanData.features = [];

    console.log(cleanData);
    console.log(statesData);

    statesData.features.forEach( row => {
      console.log(Number(row.properties.Count));
      if(Number(row.properties.Count) !== 0){
        cleanData.features.push(row);
        console.log(row);
      }
      console.log("i work");
    });
    console.log("here2");

    return cleanData;
  }

  const cleanStatesData = (statesData,data,choice) => {
    data = cleanData(choice);

    statesData.features.forEach(
      row => {
        data.forEach( item => {
          let state = item[0];
          let num = item[1];
        
          if(state === row.properties.abbr) {
            row.properties[choice] = num;
          }
        });
      }
    );
  }

  const highlightFeature = e => {
    let layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
  }

  const resetHighlight = e => {
    geojson.resetStyle(e.target);
    info.update();
  }

  const zoomToFeature = e => {
    map.fitBounds(e.target.getBounds());
  }

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  }

  const getColor = item => {
    item = item/maxNum;

    return item > .9 ? '#084594' :
      item > .75  ? '#2171b5' :
      item > .6  ? '#4292c6' :
      item > .45  ? '#6baed6' :
      item > .3   ? '#9ecae1' :
      item > .15   ? '#c6dbef' :
      '#eff3ff';
  }

  const style = feature => {
    return {
      fillColor: getColor(feature.properties.Count),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
  };

  // method that we will use to update the control based on feature properties passed
  info.update = function (props) {
      this._div.innerHTML = `<h4>US Count</h4>` +  (props ? 
        `<b>${props.name}</b><br />${Number(props.AvgWages).toFixed(2)} AvgWages <br />
        ${Number(props.EstimatedPopulation).toFixed(2)} EstimatedPopulation <br/>
        ${Number(props.Count).toFixed(2)} Count <br/>` 
        : 'Hover over a state');
  };

  info.addTo(map);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        colors = ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594'],
        labels = ['15%', '30%', '45%', '60%', '75%', '90%', '100%'];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < colors.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> <' +
            labels[i] +'<br>';
    }

    return div;
  };

  legend.addTo(map);

      
  console.log(JSON.stringify(statesData));
  statesData = formatStatesData(statesData);

  cleanStatesData(statesData,data,"AvgWages");
  cleanStatesData(statesData,data,"EstimatedPopulation");
  cleanStatesData(statesData,data,"Count"); // make sure last to set maxNum

  console.log(JSON.stringify(statesData));
  statesData = removeNullStates(statesData);

  geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);
}

const drawTable = data => {
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
}

//----------- Button Handlers -----------------
const saveSetting = () => {
  let cookies = Cookies.get(); // get object of all cookies

  let uidNum = Number(cookies.uid);
  let wagesNum = Number($('#AvgWagesSlider').val());  
  let populationNum = Number($('#estimatedPopulationsSlider').val())

  $.ajax({
    type:"POST",
    url:"src/saveSettings.php",
    data: {
      uid: uidNum,
      login: cookies.username,
      AvgWages: wagesNum,
      EstimatedPopulation: populationNum
    },
    success: result => {
      let message = result.message;
      console.log(result);

      document.getElementById('popup-message').textContent = message;
      document.getElementById('popup-title').textContent = 'Success';
      $('#popupModal').modal('toggle');  
    },
    error: result => {
      console.log(result);
      console.log(result.message);
    }
  });
}

$("#colorTable").click( e => {
  colorTablePopulation();
  colorTableWages();
});

const showClientInfo = () => {
    let browser = navigator.userAgent;  // Get user's browser
    let os = navigator.platform; 
    let version = navigator.appVersion;
    let vendor = navigator.vendor;  // Mozilla Firefox returns empty string
    let cookie = navigator.cookieEnabled;
    let java= navigator.javaEnabled();

    let clientInfo = `<b>Browser:</b> ${browser}, <b>${vendor}</b></br>
        <b>OS Platform:</b> ${os}</br>
        <b>Browser Version:</b> ${version}</br>
        <b>Cookies Enabled:</b> ${cookie}</br>
        <b>Java Enabled:</b> ${java}</br>`;
    
    document.getElementById('clientInfo').innerHTML = clientInfo; // innerHTML returns HTML, textContent has better performance because its value is not parsed as HTML
    $('#clientInfoModal').modal('toggle');
}

const showUserInfo = () => {
    let cookies = Cookies.get(); // get object of all cookies

    // Check if Cookie set
    if (cookies.username == null){ // Check if null and undefined simultaneously
        document.getElementById('userInfo').textContent = "Login to see User info!";
    } else {
        let name = cookies.name.replace("+"," "); // Replace all +'s with space

        let userInfo = `<b>UID:</b> ${cookies.uid}</br>
        <b>Username:</b> ${cookies.username}</br>
        <b>Name:</b> ${name}</br>
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
    let errorInfo = "Cannot create a Line Chart for selected chart option"

    document.getElementById('errorInfo').textContent = errorInfo;
    $('#errorModal').modal('toggle');

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
    return;
  }

  let errorInfo = "Cannot create a Pie Chart for selected Chart Option"

  document.getElementById('errorInfo').textContent = errorInfo;
  $('#errorModal').modal('toggle');

  console.log("Cannot use pie chart for selected chart...");
});

$('#analytics').click(e=> {
  drawCorrelation();
});

//---------- Map functions ----------------------
 $("#drawMap").click(e => {
  clearCharts();
  mapDrawn=true;

  document.getElementById('mapid').style.display='block';
  drawMap();
  console.log(`Draw Map has been called...`);
});

$('#estimatedPopulationsSlider').on('change', function() {
  colorTablePopulation();
  drawCorrelation();
  console.log( this.value );
});

$('#AvgWagesSlider').on('change', function() {
  colorTableWages();
  drawCorrelation();
  console.log( this.value );
});

$("#bothCharts").click(e => {
  drawCharts();
});

$("#newCharts").click( e => {
  mapDrawn=true;

  document.getElementById('mapid').style.display='block';
  drawMap();
  console.log(`Draw Map has been called...`);

  drawNonGoogleBar();
});

$("#load-db-1").click( e => {
  clearWorkspace();
  clearCharts();

  $.ajax({
    type:"POST",
    url:"src/loadData.php",
    data: {database: "1"},
    success: result => {
      data = JSON.parse(result.data);

      getMaxNums();
      getMinNums();
      setSliderValues();

      // Set Save Setting Buttons
      if (data != null) {
        $('#saveSetting').prop("disabled", false); // Element(s) are now enabled.
      }

      drawTable(data);
    },
    error: result => {
      console.log(result);
    }
  });
});

$("#load-db-2").click( e => {
  clearWorkspace();
  clearCharts();
  
  $.ajax({
    type:"POST",
    url:"src/loadData.php",
    data: {database: "2"},
    success: result => {
      data = JSON.parse(result.data);

      drawTable(data);

      getMaxNums();
      getMinNums();
      setSliderValues();

      // Set Save Setting Buttons
      if (data != null) {
        $('#saveSetting').prop("disabled", false); // Element(s) are now enabled.
      }

      console.log(data);
      console.log(result);
    },
    error: result => {
      console.log(result);
    }
  });
});

$("#load-db-3").click( e => {
  clearWorkspace();
  clearCharts();

  $.ajax({
    type:"POST",
    url:"src/loadData.php",
    data: {database: "3"},
    success: result => {
      data = JSON.parse(result.data);

      drawTable(data);

      getMaxNums();
      getMinNums();
      setSliderValues();

        // Set Save Setting Buttons
      if (data != null) {
        $('#saveSetting').prop("disabled", false); // Element(s) are now enabled.
      }

      console.log(data);
      console.log(result);
    },
    error: result => {
      console.log(result);
    }
  });
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
      let cookies = Cookies.get(); // get object of all cookies

      document.getElementById('loginDropmenu').style.display='none';  // Make function for these later
      document.getElementById("username").textContent = cookies.username;
      document.getElementById("username-item").style.display='block';
      document.getElementById('sign-out').style.display='block';
      document.getElementById('messageArea').textContent = `Welcome, ${cookies.username}!`; 

      // Remove Load Database buttons
      document.getElementById('load-db-1').style.display='block';
      document.getElementById('load-db-2').style.display='block';
      document.getElementById('load-db-3').style.display='block';

      // Set Save Setting Buttons
      if (data != null) {
        $('#saveSetting').prop("disabled", false); // Element(s) are now enabled.
      }
      console.log("success");
      console.log(result);
    },
    error: result => {
      let message = result.responseJSON.message;

      let errorInfo = "Error Logging In: "

      document.getElementById('errorInfo').textContent = errorInfo+message;
      $('#errorModal').modal('toggle');

      console.log(result);
      
    }
  });
});

$("#sign-out").click( e => {
  // Remove all cookies
  Cookies.remove("name"); 
  Cookies.remove("gender"); 
  Cookies.remove("uid"); 
  Cookies.remove("username"); 

  // Switch Login States
  document.getElementById('loginDropmenu').style.display='block'; // Make function for these
  document.getElementById("username-item").style.display='none';
  document.getElementById('sign-out').style.display='none';

  // Remove Load Database buttons
  document.getElementById('load-db-1').style.display='none';
  document.getElementById('load-db-2').style.display='none';
  document.getElementById('load-db-3').style.display='none';

  // Show Pop up Modal
  document.getElementById('popup-title').textContent = "Logged Out"; 
  document.getElementById('messageArea').textContent = "Login for more features"; 
  document.getElementById('popup-message').textContent = "Logout Successful!";  // Display you have been logged out

  // Set Save Setting Buttons
  $('#saveSetting').prop("disabled", true); // Element(s) are now disabled.

  $('#popupModal').modal('toggle');
  console.log("sign out");
});

//------- End of Button Handlers -------------

$(document).ready( () => {
  let cookies = Cookies.get(); // get object of all cookies

    // Default disable button
    $('#saveSetting').prop("disabled", true); // Element(s) are now disabled.

  // Check if Cookie set
  if (cookies.username == null){ // Check if null and undefined simultaneously
    document.getElementById('messageArea').textContent = "Login for more features!";
  } else {
    document.getElementById('messageArea').textContent = "Welcome, "+cookies.username;

    // setup the navbar for logged in user
    document.getElementById('loginDropmenu').style.display='none';
    document.getElementById("username").textContent = cookies.username;
    document.getElementById("username-item").style.display='block';
    document.getElementById('sign-out').style.display='block';

    // Show load database buttons
    document.getElementById('load-db-1').style.display='block';
    document.getElementById('load-db-2').style.display='block';
    document.getElementById('load-db-3').style.display='block';

    // Set Save Setting Buttons
    if (data != null) {
      $('#saveSetting').prop("disabled", false); // Element(s) are now enabled.
    }
  }
});

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

          getMaxNums();
          getMinNums();
          setSliderValues();

          // Set Save Setting Buttons
          if (data != null) {
            $('#saveSetting').prop("disabled", false); // Element(s) are now enabled.
          }

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

  // Switch Login States
  document.getElementById('loginDropmenu').style.display='block'; // Make function for these
  document.getElementById("username-item").style.display='none';
  document.getElementById('sign-out').style.display='none';

  // Remove Load Database buttons
  document.getElementById('load-db-1').style.display='none';
  document.getElementById('load-db-2').style.display='none';
  document.getElementById('load-db-3').style.display='none';

  // Clear Messages
  document.getElementById('messageArea').textContent = "Data has been cleared!";
}