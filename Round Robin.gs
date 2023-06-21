//API GET request to the a list of folders from HelpScout and check queue sizes
function roundRobin() {
  var apiKey = '{{insert API key}}'; //apiKey for HelpScout
  var password = 'X';
  var mailBoxID = "30677";
  var unassignedFolderID = "325682";
  
  //Online team IDs
  var ss = SpreadsheetApp.getActiveSpreadsheet(); //get active spreadsheet
  var sheet = ss.getSheetByName('Online Team'); //get sheet by name from active spreadsheet
  
  var headers = {
    "Authorization" : "Basic " + Utilities.base64Encode(apiKey + ':' + password)
  };
  
  var params = {
    "method":"GET",
    "headers":headers
  };
  
  var pageNum = 1;
  //Get a list of unassigned emails to be assigned
  var url = 'https://api.helpscout.net/v1/mailboxes/' + mailBoxID + '/folders/' + unassignedFolderID + '/conversations.json?status=active&page=' + pageNum;
  try {
    var response = UrlFetchApp.fetch(url, params); // get api endpoint
    var json = response.getContentText(); // get the response content as text
    var conversationData = JSON.parse(json); //parse text into json
    pageNum = conversationData.pages; //Get the last page number from the response
    
    //Get the last page of conversations; start with oldest to newest
    url = 'https://api.helpscout.net/v1/mailboxes/' + mailBoxID + '/folders/' + unassignedFolderID + '/conversations.json?status=active&page=' + pageNum;
    response = UrlFetchApp.fetch(url, params); // get api endpoint
    json = response.getContentText(); // get the response content as text
    conversationData = JSON.parse(json); //parse text into json
    
  } catch(e) {
       Logger.log("Error in unassigned emails GET API request");    
  }
   
  var conversations = []; //List of unassigned conversation IDs
  
  try {
    for (i = 0; i < conversationData.items.length && conversationData.items.length > 0; i++) { //Get all unassigned conversation IDs from the unassigned queue
      conversations.push(conversationData.items[i].id);
    }  
    conversations = conversations.sort() //sort unassigned emails oldest to newest
  } catch (e) {
    Logger.log("Error with conversation data");
    }
  
  //Add owners to unassigned emails 
  var j = 0;
  var i = 0;
  var specialistList = [];
  
  for (i = 0; i < conversations.length && conversations[i] != 0; i++) { 
    specialistList = getSpecialistList();  //Build list of specialists that need emails assigned; refresh each loop
    
    if (specialistList.length == 0 || specialistList == 'undefined' || specialistList[i] == 'undefined' || specialistList[j][0] == 'undefined') {
      break;
    };
        
    var ownerAssignments = {
      "owner": { "id" : specialistList[j][0]}
    };

    var payload = JSON.stringify(ownerAssignments);

    var params = {
      "contentType" : "application/json",
      "method":"PUT",
      "headers":headers,
      "payload":payload
    };
    
    var url = 'https://api.helpscout.net/v1/conversations/' + conversations[i] + '.json' + "?mailbox=" + mailBoxID + "&status=active" + "&reload=true"; //api endpoint as a string 
    try {
      var response = UrlFetchApp.fetch(url, params); // get api endpoint
      var json = response.getContentText(); // get the response content as text
      var data = JSON.parse(json); //parse text into json
      //Logger.log(data);
    } catch (e) {
      Logger.log("Error in PUT API request");
    }
    
    if (j == specialistList.length-1 && specialistList.length > 0) {
      j = 0;
    } else {
      j++;
    }
  }

}



  //API GET request to the a list of specialists from HelpScout and check queue sizes
function getSpecialistList() {
  var apiKey = '{{insert API key}}'; //apiKey for HelpScout
  var password = 'X';
  var mailBoxID = "30677";
  
  //Online team IDs
  var ownerIDArray = getActiveSpecialists();
  
  var headers = {
    "Authorization" : "Basic " + Utilities.base64Encode(apiKey + ':' + password)
  };
  
  var params = {
    "method":"GET",
    "headers":headers
  };
  
  var specialistList = [];
  
  for (i = 0; i < ownerIDArray.length; i++) {
    var url = 'https://api.helpscout.net/v1/mailboxes/' + mailBoxID + '/users/' + ownerIDArray[i] + "/conversations.json?status=active";
    try {
      var response = UrlFetchApp.fetch(url, params); // get api endpoint
      var json = response.getContentText(); // get the response content as text
      var data = JSON.parse(json); //parse text into json
      
      if (data.count <= 5) { //Count # of assigned conversations
        specialistList.push(ownerIDArray[i]); //Add owner to array
      }
    } catch(e) {
      Logger.log("Error in max 5 assigned emails API GET request");
    }
  }
  return specialistList;
}


//Get active specialist from schedule sheet
function getActiveSpecialists() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(); //get active spreadsheet
  var sheet = ss.getSheetByName('Online Team'); //get sheet by name from active spreadsheet
  var activeOwnerArray = [];
  var ownerIDArray = sheet.getRange(2,1,sheet.getLastRow()).getValues();
  var ownerChannelArray = sheet.getRange(2,7,sheet.getLastRow()).getValues();
  var ownerScheduleArray = sheet.getRange(2,8,sheet.getLastRow()).getValues();
  
  for (i = 0; i < ownerIDArray.length; i++) {
    if (ownerChannelArray[i][0] == "Email") {
      if (ownerScheduleArray[i][0] == "ON") {
        activeOwnerArray.push(ownerIDArray[i]);
      }
    }
  }
  
  return activeOwnerArray;
}
