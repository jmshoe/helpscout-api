//Get specific cell
function assignments() {
  var apiKey = '{{insert API key}}'; //apiKey for HelpScout
  var password = 'X';
  var mailBoxID = "30677";
  
  var headers = {
    "Authorization" : "Basic " + Utilities.base64Encode(apiKey + ':' + password)
  };
  
  var params = {
    "method":"GET",
    "headers":headers
  };
  
  var ss = SpreadsheetApp.getActiveSpreadsheet(); //get active spreadsheet
  var sheet = ss.getSheetByName('Online Team'); //get sheet by name from active spreadsheet
  var row = 2;
  var column = 11;
  
  var cell = sheet.getRange(row,column);
  
  var ownerIDArray = sheet.getRange(2,1,sheet.getLastRow()).getValues();
  var assignments = [];
  
  for (i = 0; i < ownerIDArray.length; i++) {
    var url = 'https://api.helpscout.net/v1/mailboxes/' + mailBoxID + '/users/' + ownerIDArray[i] + "/conversations.json?status=active";
    try {
      var response = UrlFetchApp.fetch(url, params); // get api endpoint
      var json = response.getContentText(); // get the response content as text
      var data = JSON.parse(json); //parse text into json
    
      assignments.push(data.count);
    
      cell.setValue(data.count);
     } catch(e) {
         Logger.log("Error in max 5 assigned emails API GET request");
     }
     row++;
    cell = sheet.getRange(row,column);

  }
}
