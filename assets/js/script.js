var weatherAPIKey = "6d20c8172b510de935853d004138473d";
var city;
var message = "Hi Nicole, I got a message from Wyzant that your account is locked"

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
    storeCity(city)
    const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${weatherAPIKey}`
    await fetch(geoURL)
        .then(res=>res.json())
        .then(res=>{
            //console.log(res)
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
            <div id="border">
                <h2>${name} ${date} <img src="http://openweathermap.org/img/wn/${icon}@2x.png"> </h2>
                <p> Temp: ${temp} °F </p>
                <p> Wind: ${wind} MPH </p>
                <p> Humidity: ${humidity} % </p>
            </div>
            <h3>5-Day Forecast:</h3>
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

function storeCity (city){
    let cityArray = JSON.parse(localStorage.getItem("cities"))
    if(!cityArray.includes(city)){
        cityArray.push(city)
    }
    localStorage.setItem("cities",JSON.stringify(cityArray))
    createButtons()
}

function getForecast ([lat,lon]){
    
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherAPIKey}`
    var windSpeed 
    var temperature
    var humidity
    var icon
    var dateText
    var forecast = document.getElementById("forecast")
    forecast.innerHTML = ""
    //console.log(forecast)
    fetch (queryURL)
        .then (res=>res.json())
        .then(res=>{
            for (let i=5;i<=37;i+=8){
                windSpeed=res.list[i].wind.speed
                temperature=res.list[i].main.temp
                humidity=res.list[i].main.humidity
                icon=res.list[i].weather[0].icon
                dateText=res.list[i]["dt_txt"]
                forecast.innerHTML+=`
                    <div class="card">
                        <div class="date"> ${new Date(dateText).toLocaleDateString()}</div>
                        <img class="icon" src="http://openweathermap.org/img/wn/${icon}@2x.png">
                        <p class= "temp"> Temp: ${temperature} °F </p>
                        <p class= "humidity"> Humidity: ${humidity} % </p>
                        <p class= "wind"> WindSpeed: ${windSpeed} MPH </p>
                    </div>
            

          `
        }
        })
        
}
