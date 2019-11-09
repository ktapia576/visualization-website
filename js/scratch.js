// Button Handlers
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

    if (table != null){
        table.clearChart();
    }

    // Clear Data
    csvFile = null;
    data = null;
    pieChart = null;
    barChart = null;
    lineChart = null;
    table = null;

    // Clear Messages
}