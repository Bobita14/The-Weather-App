const mymap = L.map('map').setView([0, 0], 0);

// load tiles from street map
const tile_url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

const tiles = L.tileLayer(tile_url);

tiles.addTo(mymap);

getData();
async function getData(){
    const response = await fetch('/api');
    const data = await response.json();

    for (item of data){
        const root = document.createElement('div');
        const geolocation = document.createElement('div');
        const location = document.createElement('div');
        const date = document.createElement('div');

        geolocation.textContent = `Latitude: ${item.lat}°, Longitude: ${item.lon}°`;

        location.textContent = item.weather.location.name;

        const dateString = new Date(item.timestamp).toLocaleString();
        date.textContent = `Time: ${dateString}`;

        //set a marker from each data position
        const marker = L.marker([item.lat, item.lon]).addTo(mymap);

        let text = `The weather here in ${item.weather.location.name},  is: ${item.weather.current.condition.text}, with a temperature of: ${item.weather.current.temp_c}°C.`

        if (item.air.value < 0){
            text += ' No Air Quality Reading.'
        }
        else{
            text += `The concentration of particle matter is ${item.air.value} ${item.air.unit} last recorded on ${item.air.lastUpdated}.`
        }

        marker.bindPopup(text).openPopup();

        root.append(geolocation, location, date);
        root.setAttribute("id", "root");
        document.body.append(root);
    }
    mymap.setView([0,0], 0);
    console.log(data)
}