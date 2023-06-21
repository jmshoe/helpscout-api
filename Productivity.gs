function getProductivity() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(); //get active spreadsheet
  var sheet = ss.getSheetByName('Productivity'); //get sheet by name from active spreadsheet
  var team = ss.getSheetByName('Online Team'); //get sheet by name from active spreadsheet
  var ownerEmailHoursArray = team.getRange(2,9,sheet.getLastRow()).getValues();
  
  var apiKey = '{{insert API key}}'; //apiKey for HelpScout
  var password = 'X';
  var mailBoxID = "10735,45382,9626";
  var userID = "17113"
  
  //Online team IDs
  var ownerIDArray = getEmailSpecialists();
  
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
  
  var startDateString = Utilities.formatDate(startDate, "UTC", "yyyy-MM-dd");
  var endDateString = Utilities.formatDate(endDate, "UTC", "yyyy-MM-dd");

  for ( j = 0; j < ownerIDArray.length; j++) {
    var url = 'https://api.helpscout.net/v1/reports/user.json' + "?start=" + startDateString + startTime + "&end=" + endDateString + endTime + "&mailboxes=" + mailBoxID + "&viewBy=day" + "&user=" + ownerIDArray[j]; //api endpoint as a string 
    
    var response = UrlFetchApp.fetch(url, params); // get api endpoint
    var json = response.getContentText(); // get the response content as text
    var data = JSON.parse(json); //parse text into json
    
    Logger.log(data); //log data to logger to check
    
    var dataLength = data.current.length;
    var info=[]; //create empty array to hold data points
    
    var dateStr = data.current.startDate.substring(0,10);
    var year = +dateStr.substring(0,4);
    var month = +dateStr.substring(5,7);
    var day = +dateStr.substring(8,10);
    
    var formattedDate = Utilities.formatDate(new Date(year,month,day), "UTC", "yyyy-MM-dd");
    
    
    info.push(startDateString); 
    info.push(data.user.id);
    info.push(data.user.name);
    //info.push(data.current.happinessScore);
    info.push(data.current.handleTime/60);
    info.push(data.current.repliesPerDay);
    info.push(data.current.customersHelped);
    info.push(data.current.repliesPerDay*data.current.handleTime/60/60); //Total Handle Time
    sheet.appendRow(info) //append the stats array to the active sheet    
  }
}


//Get active specialist from schedule sheet
function getEmailSpecialists() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(); //get active spreadsheet
  var sheet = ss.getSheetByName('Online Team'); //get sheet by name from active spreadsheet
  var team = ss.getSheetByName('Online Team'); //get sheet by name from active spreadsheet

  var activeOwnerArray = [];
  var ownerIDArray = sheet.getRange(2,1,sheet.getLastRow()).getValues();
  var ownerEmailHoursArray = team.getRange(2,9,sheet.getLastRow()).getValues();


  //var ownerChannelArray = sheet.getRange(2,7,sheet.getLastRow()).getValues();
  //var ownerScheduleArray = sheet.getRange(2,8,sheet.getLastRow()).getValues();
  
  for (i = 0; i < ownerIDArray.length; i++) {
    if (ownerEmailHoursArray[i][0] > 0) {
        activeOwnerArray.push(ownerIDArray[i]);
    }
  }
  
  return activeOwnerArray;
}
