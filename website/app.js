const personalKey = '217fef93887a6a85195d57d535bad282';
const baseURL1 = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const baseURL2 = ',us&units=imperial&appid=';

const createWeatherURL = ( zipCode ) => {

	return baseURL1 + zipCode + baseURL2 + personalKey;

};

//get weather data from OpenWeatherMap API
const getWeatherInfo = async ( zipCode ) => {

	const weatherURL = createWeatherURL( zipCode ); 
	const response = await fetch( weatherURL ); 

	try{

		const weatherData = await response.json(); 
		weatherData.zipCode = zipCode; 
		
		
		if( weatherData.cod == 404 ){

			return Promise.reject( weatherData.message );

		}

		return weatherData;

	}catch( error ){

		console.log( error );

	}

};

const postAppData = async ( weatherData ) => {

	const feelings = document.querySelector( '#feelings' ).value;

	const date = new Date();
	const entryID = date.getTime();
	const dateString = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;

	const appData = {
		'entryID': entryID,
		'date': dateString,
		'zipCode': weatherData.zipCode,
		'name': weatherData.name,
		'temp': weatherData.main.temp,
		'feelings': feelings
		};

	try{
		const response = await fetch( '/upload', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify( appData )
			});

		const returnData = await response.json();
		return returnData.entryID;

	}catch( error ){

		console.log( error );

	}

};

//getting app data from the server
const getAppData = async () => {

	const response = await fetch( '/all' );

	try{

		const appData = await response.json(); // Convert response to JSON 
		return appData;

	}catch( error ){

		console.log( error );

	}

};

// Update app UI with the app data
const updateUI = async ( appData ) => {

	let allEntries = "";

	for( const entry of appData.reverse() ){

		const journalEntry = `
		<div class="journalEntry">
			<div id="date">${entry.date}</div>
			<div id="city">${entry.name}</div>
			<div id="temp">${entry.temp}°F</div>
			<div id="content">${entry.feelings}</div>
		</div>
		`;

		allEntries += journalEntry;

	}
	
	if( allEntries != "" ){

		document.querySelector( '#entryHolder' ).innerHTML = allEntries;

	}else{

		document.querySelector( '#entryHolder' ).innerHTML = "Your journal is currently empty.";

	}

};


const addJournalEntry = () => {

	
	const zipCode = document.querySelector( '#zip' ).value;
	const feelings = document.querySelector( '#feelings' ).value;

	if( zipCode.length == 5 && !isNaN( zipCode ) ){

		if( feelings.length > 0 ){

			getWeatherInfo( zpCode )
				.then( ( weatherData ) => { return postAppData( weatherData ); } )
				.then( () => { return getAppData(); } )
				.then( ( appData ) => { updateUI( appData );} )
				.catch( ( error ) => { alert( error ); } );

		}else{

			alert( "Please enter your feelings." );
			document.querySelector( '#feelings' ).focus();

		}
	
	}else{

		alert( 'Please enter a valid 5 digit zip code.' );
		document.querySelector( '#zip' ).focus();

	}

};

// Add event listeners when the page is ready
document.addEventListener( 'DOMContentLoaded', () => {

	// Add functionality to 'Generate' button via click event listener
	document.querySelector( '#generate' ).addEventListener( 'click', addJournalEntry );
	getAppData()
		.then( ( appData ) => { updateUI( appData ); } );

});