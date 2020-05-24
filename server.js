const express = require('express');
const app = express();
const fetch = require('node-fetch')
require('dotenv').config() //for environment variables

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening at ${port}`));

app.use(express.static('public'));
app.use(express.json({limit: '50mb'}));

const Datastore = require('nedb');
const database = new Datastore('database.db');
database.loadDatabase();

//sending geolocation the data
app.get('/api', (request, response) => {
    database.loadDatabase();
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    })
});

//sending weather data
app.get('/weather/:latlon', async (request, response) => {
    //getting lat and lon from the parameters sent from client side
    const latlon = request.params.latlon.split(','); //splits it in an array of lat and lon
    const lat = latlon[0];
    const lon = latlon[1];

    const api_key = process.env.API_KEY;
    const weather_url = `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${lat},${lon}`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    const airquality_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    const airquality_response = await fetch(airquality_url);
    const airquality_data = await airquality_response.json();

    const data = {
        weather: weather_data,
        airquality: airquality_data
    }
    
    response.json(data);
});

//receiving geolocation data
app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
});


