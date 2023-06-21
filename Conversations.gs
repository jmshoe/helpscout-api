function listThreads() {
  var apiKey = '{{insert API key}}'; //apiKey for HelpScout
  var password = 'X';
  var mailBoxID = "10735";
  
  var ss = SpreadsheetApp.getActiveSpreadsheet(); //get active spreadsheet
  var sheet = ss.getSheetByName('Conversations'); //get sheet by name from active spreadsheet
 
  
  var headers = {
    "Authorization" : "Basic " + Utilities.base64Encode(apiKey + ':' + password)
  };
  
  var params = {
    "method":"GET",
    "headers":headers
  };
  
  var converationList = getConversationList();
  
  var threadList = [];
  
  for (i = 0; i < converationList.length; i++) {
    var url = 'https://api.helpscout.net/v1/conversations/' + threadList[i] + '.json';
    
    var response = UrlFetchApp.fetch(url, params); // get api endpoint
    var json = response.getContentText(); // get the response content as text
    var conversationData = JSON.parse(json); //parse text into json
   
    threadList.push(conversationData.items); 
  }
  
}


function getConversationList() {
  var apiKey = '{{insert API key}}'; //apiKey for HelpScout
  var password = 'X';
  var mailBoxID = "10735";
  
  var headers = {
    "Authorization" : "Basic " + Utilities.base64Encode(apiKey + ':' + password)
  };
  
  var params = {
    "method":"GET",
    "headers":headers
  };
  
  var conversationList = [];
  
  var url = 'https://api.helpscout.net/v1/mailboxes/' + mailBoxID + '/conversations.json';

  var response = UrlFetchApp.fetch(url, params); // get api endpoint
  var json = response.getContentText(); // get the response content as text
  var data = JSON.parse(json); //parse text into json
    
  for (i = 0; i < data.items.length; i++) {
    conversationList.push(data.items[i].id); 
  }

  Logger.log(conversationList); //log data to logger to check
  return conversationList;
}



function getIntervalReport() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(); //get active spreadsheet
  var sheet = ss.getSheetByName('ConvoReport'); //get sheet by name from active spreadsheet
  
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
  
  startDate.setDate(startDate.getDate()-9); 
  endDate.setDate(endDate.getDate()); 
  
  var startDateString = Utilities.formatDate(startDate, "CDT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  var endDateString = Utilities.formatDate(endDate, "CDT", "yyyy-MM-dd'T'HH:mm:ss'Z'");

  var url = 'https://api.helpscout.net/v1/reports/conversations/busy-times.json' + "?start=" + startDateString + "&end=" + endDateString + "&mailboxes=" + mailBoxID; //api endpoint as a string 
  //var url = 'https://api.helpscout.net/v1/reports/conversations/busy-times.json' + "?start=" + "2016-10-03T00:00:00Z" + "&end=" + "2016-10-10T23:59:59Z" + "&mailboxes=" + mailBoxID; //api endpoint as a string 
  
  var response = UrlFetchApp.fetch(url, params); // get api endpoint
  var json = response.getContentText(); // get the response content as text
  var data = JSON.parse(json); //parse text into json
  
  Logger.log(data); //log data to logger to check
    
  var info=[]; //create empty array to hold data points
  var i = 0;
  
  //The following lines push the parsed json into empty info array
  for (i = 0; i < data.length; i++) {
    info.push(startDate);
    info.push(endDate);
    info.push(data[i].day); 
    info.push(data[i].hour); 
    info.push(data[i].count); 
    
    sheet.appendRow(info) //append the stats array to the active sheet
    info =[];
  }
}
