//Overall Happiness Report
function getHappinessReport() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(); //get active spreadsheet
  var sheet = ss.getSheetByName('Happiness'); //get sheet by name from active spreadsheet
  
  var apiKey = '{{insert API key}}'; //apiKey for HelpScout
  var password = 'X';
  var mailBoxID = "10735";
  
  var options = {};
  options.headers = {"Authorization": "Basic " + Utilities.base64Encode(apiKey + ":" + password)};
  
  var headers = {
    "Authorization" : "Basic " + Utilities.base64Encode(apiKey + ':' + password)
  };
  
  var params = {
    "method":"GET",
    "headers":headers
  };
  
  var startDate = new Date(); //set the date and time to now()
  var endDate = new Date();  //set the date and time to now()
  
  startDate.setHours(00,00,00); //set the date and time to start of the day (Central)
  endDate.setHours(23,59,59);  //set the date and time to end of the day (Central)
  
  var dayOffset = -1; //offset the reporting dates from today's date

  startDate.setDate(startDate.getDate() + dayOffset); 
  endDate.setDate(endDate.getDate() + dayOffset); 
  
  var startDateString = Utilities.formatDate(startDate, "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  var endDateString = Utilities.formatDate(endDate, "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");

  var url = 'https://api.helpscout.net/v1/reports/happiness.json' + "?start=" + startDateString + "&end=" + endDateString + "&mailboxes=" + mailBoxID; //api endpoint as a string 
  
  var response = UrlFetchApp.fetch(url, params); // get api endpoint
  var json = response.getContentText(); // get the response content as text
  var data = JSON.parse(json); //parse text into json
  
  Logger.log(data); //log data to logger to check
    
  var dataLength = data.current.length;
  var info=[]; //create empty array to hold data points
  var i = 0;
  
  //The following lines push the parsed json into empty info array
  for (i = 0; i < 1; i++) {
    info.push(startDate);
    info.push(endDate);
    info.push(data.current.great/100);
    info.push(data.current.okay/100); 
    info.push(data.current.notGood/100);
    info.push(data.current.greatCount);
    info.push(data.current.okayCount);
    info.push(data.current.notGoodCount);
    info.push(data.current.totalCustomersWithRatings);
    info.push(data.current.totalCustomers); 
    info.push(data.current.happinessScore); 

    sheet.appendRow(info) //append the stats array to the active sheet
    info =[];
  }
}


//Team happiness report by response
function getTeamHappinessReport() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(); //get active spreadsheet
  var sheet = ss.getSheetByName('Team Happiness'); //get sheet by name from active spreadsheet
  
  var apiKey = '{{insert API key}}'; //apiKey for HelpScout
  var password = 'X';
  var mailBoxID = "10735";
  var userID = "93879"
  
  var options = {};
  options.headers = {"Authorization": "Basic " + Utilities.base64Encode(apiKey + ":" + password)};
  
  var headers = {
    "Authorization" : "Basic " + Utilities.base64Encode(apiKey + ':' + password)
  };
  
  var params = {
    "method":"GET",
    "headers":headers
  };
  
  var startTime = 'T05:00:00Z'; //12a CST start time - 1 day represented in UTC
  var endTime = 'T04:59:59Z'; //11:59pm CST end time represented in UTC
  
  var startDate = new Date();
  var endDate = new Date();
  var dayOffset = -1;

  startDate.setDate(startDate.getDate() + dayOffset); //today's date
  endDate.setDate(endDate.getDate() + dayOffset +1); //today's date
  
  var startDateString = Utilities.formatDate(startDate, "CDT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  var endDateString = Utilities.formatDate(endDate, "CDT", "yyyy-MM-dd'T'HH:mm:ss'Z'");

  var pageNum = 1;
  var pageCount = 1;
  for(j=0; j < pageCount; j++) {
    var url = 'https://api.helpscout.net/v1/reports/happiness/ratings.json'+ "?start=" + startDateString + "&end=" + endDateString + "&mailboxes=" + mailBoxID + "&rating=" + 0+ "&page=" + pageNum; //api endpoint as a string 
    
    var response = UrlFetchApp.fetch(url, params); // get api endpoint
    var json = response.getContentText(); // get the response content as text
    var data = JSON.parse(json); //parse text into json
    
    Logger.log(data); //log data to logger to check
    
    pageNum = j+1;
    pageCount = data.pages;
    var info=[]; //create empty array to hold data points
    var i = 0;
    
    //The following lines push the parsed json into empty info array
    for (i = 0; i < data.results.length; i++) {
      info.push(data.results[i].threadCreatedAt);
      info.push(data.results[i].ratingCustomerName);
      
      if(data.results[i].ratingId == 1) {
        info.push("Good");
      } else if(data.results[i].ratingId == 2) {
        info.push("Okay");
      } else if(data.results[i].ratingId == 3) {
        info.push("Not Good");
      } else {
        infor.push("");
      }
      
      info.push(data.results[i].ratingComments);
      info.push(data.results[i].ratingUserName);
      
      sheet.appendRow(info) //append the stats array to the active sheet
      info =[];
    }
  }
}

