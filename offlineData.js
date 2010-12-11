/*
 * 
 * Find more about this app by visiting
 * http://miniapps.co.uk/
 *
 * Copyright (c) 2010 Alex Gibson, http://miniapps.co.uk/
 * Released under MIT license
 * http://miniapps.co.uk/license/
 * 
 */

//main function to be called on submit
function processData() {

	var firstName = document.querySelector('#first-name'),
		lastName = document.querySelector('#last-name');

	var formSubmitData = {
	
		'firstName' : firstName.value,
		'lastName' : lastName.value
	};

	var dataString = JSON.stringify(formSubmitData);

	if (navigator.onLine) {
		sendDataToServer(dataString);
	}
	else {
		saveDataLocally(dataString);
	}
	
	firstName.value = '';
	lastName.value = '';
}

//called on submit if device is online from processData()
function sendDataToServer(dataString) {

	var myRequest = new XMLHttpRequest();
	
	myRequest.onreadystatechange=function() {
	
  		if (myRequest.readyState == 4 && myRequest.status == 200) {
  		
    	    console.log('Sent to server: ' + dataString + '');
    	    window.localStorage.removeItem(dataString);
    	}
    	else if (myRequest.readyState == 4 && myRequest.status != 200) {
    	
			console.log('Server request could not be completed');
			saveDataLocally(dataString);
		}
	}
	
	//myRequest.open("GET", "", true);
	//myRequest.send();
	
	window.localStorage.removeItem(dataString); //remove this line as only for example
	console.log('Sent to server: ' + dataString + ''); //remove this line as only for example
}

//called on submit if device is offline from processData()
function saveDataLocally(dataString) {

	var timeStamp = new Date();
	timeStamp.getTime();
	
	try {
		localStorage.setItem(timeStamp, dataString);
		console.log('Saved locally: ' + dataString + '');
	} catch (e) {
			
		if (e == QUOTA_EXCEEDED_ERR) {
			console.log('Quota exceeded!');
		}
	}
	
	console.log(dataString);
	
	var length = window.localStorage.length;
	document.querySelector('#local-count').innerHTML = length;
}

//called if device goes online or when app is first loaded and device is online
//only sends data to server if locally stored data exists
function sendLocalDataToServer() {

	var status = document.querySelector('#status');
	status.className = 'online';
	status.innerHTML = 'Online';
    
    var i = 0,
		length = window.localStorage.length - 1,
		dataString = '';
			
	while (i <= length) {	
		
		dataString = localStorage.key(i);
		
		if (dataString) {
			sendDataToServer(dataString);
		}
		else { i++; }
	} 
	
	length = window.localStorage.length;
	document.querySelector('#local-count').innerHTML = length;
}

//called when device goes offline
function notifyUserIsOffline() {

	var status = document.querySelector('#status');
	status.className = 'offline';
	status.innerHTML = 'Offline';
}

//called when DOM has fully loaded
function loaded() {

	if (navigator.onLine) {
		sendLocalDataToServer();
	}

	window.addEventListener('online', sendLocalDataToServer, false);
	window.addEventListener('offline', notifyUserIsOffline, false);
	
	document.querySelector('#submit').addEventListener('click', processData, false);
}

window.addEventListener('load', loaded, true);