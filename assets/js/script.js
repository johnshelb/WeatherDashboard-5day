var weatherAPIKey = "6d20c8172b510de935853d004138473d";
var city;
//var queryURL = `api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}`

if(!localStorage.getItem("cities")){
    localStorage.setItem("cities",JSON.stringify([]))
}
createButtons()
async function getWeather(cityName){
    const cityCoords = await getCoordinates(cityName)
    getCurrent(cityCoords)
    getForecast(cityCoords)

}
async function getCoordinates(cityName){
    let lat
    let lon
    let city = cityName||document.querySelector("#city").value
    const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${weatherAPIKey}`
    await fetch(geoURL)
        .then(res=>res.json())
        .then(res=>{
            console.log(res)
            lat = res[0].lat
            lon = res[0].lon
        })
    
    return [lat,lon]
}

function getCurrent([lat,lon]){
    const currentURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherAPIKey}`
    fetch(currentURL)
        .then(res=>res.json())
        .then(res=>{
            let name = res.name
            let date = new Date().toLocaleDateString()
            let temp = res.main.temp
            let wind = res.wind.speed
            let humidity = res.main.humidity
            let icon = res.weather[0].icon

            document.querySelector("#currentCity").innerHTML = `
                <h2>${name} ${date} <img src="http://openweathermap.org/img/wn/${icon}@2x.png"> </h2>
                <p> Temp: ${temp} °F </p>
                <p> Wind: ${wind} MPH </p>
                <p> Humidity: ${humidity} % </p>
    
            `
        })



}
function createButtons(){
    const list = document.querySelector("#city-list")
    list.innerHTML = ""
    const cityArray = JSON.parse(localStorage.getItem("cities"))
    cityArray.forEach(city => {
        list.innerHTML += `
        <div class="city-button">
            <button onclick="getWeather('${city}')">${city}</button>
        </div>
        `
    });
}

