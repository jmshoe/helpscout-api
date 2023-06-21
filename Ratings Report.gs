function runTeamReport() {
  var teamList =[17113,33081,37456,38035,41062,41279,50669,56241,56243,59947,59950,71826,72733,72737,72739,75366,75370,79272,93879];  
  
  for (i=0; i < teamList.length; i++) {
    getRatingsReport(teamList[i]);  
  }
}

function getRatingsReport(userID) {
  var ss = SpreadsheetApp.getActiveSpreadsheet(); //get active spreadsheet
  var sheet = ss.getSheetByName('Ratings'); //get sheet by name from active spreadsheet
  
  var apiKey = '{{insert API key}}'; //apiKey for HelpScout
  var password = 'X';
  var mailBoxID = "10735";
  //var userID = "41279"
  
  var options = {};
  options.headers = {"Authorization": "Basic " + Utilities.base64Encode(apiKey + ":" + password)};
  
  var headers = {
    "Authorization" : "Basic " + Utilities.base64Encode(apiKey + ':' + password)
  };
  
  var params = {
    "method":"GET",
    "headers":headers
  };
  
  var startTime = 'T00:00:00Z';
  var endTime = 'T23:59:59Z';
  
  var startDate = new Date();
  var endDate = new Date();

  startDate.setDate(startDate.getDate()-90);
  endDate.setDate(endDate.getDate());
  
  var startDateString = Utilities.formatDate(startDate, "CDT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  var endDateString = Utilities.formatDate(endDate, "CDT", "yyyy-MM-dd'T'HH:mm:ss'Z'");

  var url = 'https://api.helpscout.net/v1/reports/user/ratings.json' + "?start=" + startDateString + "&end=" + endDateString + "&mailboxes=" + mailBoxID + "&user=" + userID+ "&rating=0"; //api endpoint as a string 
  
  var response = UrlFetchApp.fetch(url, params); // get api endpoint
  var json = response.getContentText(); // get the response content as text
  var data = JSON.parse(json); //parse text into json
  
  Logger.log(data); //log data to logger to check
    
  var dataLength = data.results.length;
  var info=[]; //create empty array to hold data points
  var i = 0;
  
  //The following lines push the parsed json into empty info array
  for (i = 0; i < 1; i++) {
    info.push(startDate);
    info.push(endDate);
    info.push(userID);
    info.push(data.results[i].ratingUserName);
    info.push(data.results[i].ratingComments);
    info.push(data.results[i].ratingCustomerName); 
    
    sheet.appendRow(info) //append the stats array to the active sheet
    info =[];
  }
}


