const projectData = [];
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 8080;

app.use(cors);
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json());
app.use(express.static("website"))
app.listen(port,portInfo);

function portInfo() {
    console.log(`Port is running on ${port}`)
}

// Add POST route
app.post( '/upload', postData );

// Function that handles POST requests
function postData( request, response ){

	projectData.push( request.body );
	console.log( 'postData()' );
	console.log( request.body );
	response.send( request.body );

}

// Add GET route
app.get( '/all', getData );

// Function that handles GET requests
function getData( request, response ){

	console.log( 'getData()' );
	console.log( projectData );
	response.send( projectData );

}