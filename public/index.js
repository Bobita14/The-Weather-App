if ('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(async position => {
        let lat, lon, weather, air;
        try{ //try to execute code
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            document.getElementById('lat').textContent = lon.toFixed(3);
            document.getElementById('lon').textContent = lat.toFixed(3);

            const api_url = `/weather/${lat},${lon}`;
            const response_api = await fetch(api_url);
            const json_api = await response_api.json();
            weather = json_api.weather;
            document.getElementById('city').textContent = weather.location.name;
            document.getElementById('country').textContent = weather.location.country;
            document.getElementById('summary').textContent = weather.current.condition.text;
            document.getElementById('temperature').textContent = weather.current.temp_c;
            air = json_api.airquality.results[0].measurements[0];
            document.getElementById('aq_parameter').textContent = air.parameter;
            document.getElementById('aq_value').textContent = air.value;
            document.getElementById('aq_units').textContent = air.unit;
            document.getElementById('aq_date').textContent = air.lastUpdated;
            console.log(json_api);

        }
        catch(error){ //but if error
            console.log('Something went wrong')
            air={value: -1}
        }
        document.getElementById('checkin').addEventListener('click', async event => {

            const data = {lat, lon, weather, air};
            console.log(data);
            const options ={
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            }
            const response = await fetch('/api', options);
            const json = await response.json()
            console.log(json);
            alert('Success your location was saved!');
        });

    });

}
else{
    alert('Geolocation not available');
}
