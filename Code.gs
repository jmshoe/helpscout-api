function getHSMailboxes() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(); //get active spreadsheet
  var sheet = ss.getSheetByName('Mailboxes'); //get sheet by name from active spreadsheet
  
  var apiKey = '{{insert API key}}'; //apiKey for HelpScout
  var password = 'X';
  var mailBoxID = "30677";
  
  var options = {};
  options.headers = {"Authorization": "Basic " + Utilities.base64Encode(apiKey + ":" + password)};
  
  var headers = {
    "Authorization" : "Basic " + Utilities.base64Encode(apiKey + ':' + password)
  };
  
  var params = {
    "method":"GET",
    "headers":headers
  };
  
  //var url = 'https://api.forecast.io/forecast/' + apiKey +"/" + lat +"," + long; 
  //var url = 'https://api.helpscout.net/v1/mailboxes/' + mailBoxID + "/conversations.json";
  var url = 'https://api.helpscout.net/v1/mailboxes.json'; //api endpoint as a string 
  
  var response = UrlFetchApp.fetch(url, params); // get api endpoint
  var json = response.getContentText(); // get the response content as text
  var data = JSON.parse(json); //parse text into json
  
  Logger.log(data); //log data to logger to check
  
  var info=[]; //create empty array to hold data points
  var i = 0;
  
  //The following lines push the parsed json into empty info array
  for (i = 0; i < 40; i++) {
    info.push(data.items[i].id); //mailbox ID
    info.push(data.items[i].name); //mailbox Name
    info.push(data.items[i].email); //mailbox email
    sheet.appendRow(info) //append the stats array to the active sheet
    info =[];
  }
}


function getHSUsers() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(); //get active spreadsheet
  var sheet = ss.getSheetByName('Users'); //get sheet by name from active spreadsheet
  
  var apiKey = '{{insert API key}}'; //apiKey for HelpScout
  var password = 'X';
  var mailBoxID = "30677";
  
  var options = {};
  options.headers = {"Authorization": "Basic " + Utilities.base64Encode(apiKey + ":" + password)};
  
  var headers = {
    "Authorization" : "Basic " + Utilities.base64Encode(apiKey + ':' + password)
  };
  
  var params = {
    "method":"GET",
    "headers":headers
  };
  
  var url = 'https://api.helpscout.net/v1/users.json'; //api endpoint as a string 
  
  var response = UrlFetchApp.fetch(url, params); // get api endpoint
  var json = response.getContentText(); // get the response content as text
  var data = JSON.parse(json); //parse text into json
  
  Logger.log(data); //log data to logger to check
  
  var info=[]; //create empty array to hold data points
  var i = 0;
  
  //The following lines push the parsed json into empty info array
  for (i = 0; i < data.items.length; i++) {
    info.push(data.items[i].id); //mailbox ID
    info.push(data.items[i].firstName); 
    info.push(data.items[i].lastName); 
    info.push(data.items[i].email); 
    info.push(data.items[i].role); 
    sheet.appendRow(info) //append the stats array to the active sheet
    info =[];
  }
}


function getConvoReport() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(); //get active spreadsheet
  var sheet = ss.getSheetByName('ConvoReport'); //get sheet by name from active spreadsheet
  
  var apiKey = '{{insert API key}}'; //apiKey for HelpScout
  var password = 'X';
  var mailBoxID = "30677";
  
  var options = {};
  options.headers = {"Authorization": "Basic " + Utilities.base64Encode(apiKey + ":" + password)};
  
  var headers = {
    "Authorization" : "Basic " + Utilities.base64Encode(apiKey + ':' + password)
  };
  
  var params = {
    "method":"GET",
    "headers":headers
  };

  var startDate = new Date();
  var endDate = new Date();

  startDate.setDate(startDate.getDate()-180);
  
  var startDateString = Utilities.formatDate(startDate, "CDT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  var endDateString = Utilities.formatDate(endDate, "CDT", "yyyy-MM-dd'T'HH:mm:ss'Z'");

  var url = 'https://api.helpscout.net/v1/reports/conversations/new.json' + "?start=" + startDateString + "&end=" + endDateString + "&mailboxes=" + mailBoxID + "&viewBy=day"; //api endpoint as a string 
  
  var response = UrlFetchApp.fetch(url, params); // get api endpoint
  var json = response.getContentText(); // get the response content as text
  var data = JSON.parse(json); //parse text into json
  
  Logger.log(data); //log data to logger to check
    
  var info=[]; //create empty array to hold data points
  var i = 0;
  
  //The following lines push the parsed json into empty info array
  for (i = 0; i < data.current.length; i++) {
    info.push(data.current[i].start); 
    info.push(data.current[i].count); 
    
    sheet.appendRow(info) //append the stats array to the active sheet
    info =[];
  }
}


function getFirstReplyReport() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(); //get active spreadsheet
  var sheet = ss.getSheetByName('FirstReplyReport'); //get sheet by name from active spreadsheet
  
  var apiKey = '{{insert API key}}'; //apiKey for HelpScout
  var password = 'X';
  var mailBoxID = "30677";
  
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

  startDate.setDate(startDate.getDate()-14);
  endDate.setDate(endDate.getDate()-7);
  
  var startDateString = Utilities.formatDate(startDate, "CDT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  var endDateString = Utilities.formatDate(endDate, "CDT", "yyyy-MM-dd'T'HH:mm:ss'Z'");

 
  //var url = 'https://api.forecast.io/forecast/' + apiKey +"/" + lat +"," + long; 
  //var url = 'https://api.helpscout.net/v1/mailboxes/' + mailBoxID + "/conversations.json";
  var url = 'https://api.helpscout.net/v1/reports/productivity/response-time.json' + "?start=" + startDateString + "&end=" + endDateString + "&mailboxes=" + mailBoxID + "&viewBy=week" + "&officeHours=1"; //api endpoint as a string 
  
  var response = UrlFetchApp.fetch(url, params); // get api endpoint
  var json = response.getContentText(); // get the response content as text
  var data = JSON.parse(json); //parse text into json
  
  Logger.log(data); //log data to logger to check
    
  var dataLength = data.current.length;
  var info=[]; //create empty array to hold data points
  var i = 0;
  
  //The following lines push the parsed json into empty info array
  for (i = 0; i < data.current.length; i++) {
    info.push(data.current[i].date); 
    info.push(data.current[i].time/60/60); 

    sheet.appendRow(info) //append the stats array to the active sheet
    info =[];
  }
}




