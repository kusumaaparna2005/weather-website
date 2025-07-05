const weatherform = document.querySelector(".weatherForm");
const cityinput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const clearBtn = document.querySelector(".clearBtn");
const loader = document.querySelector(".loader");
const bgVideo = document.getElementById("bgVideo");
const apiKey = "43397ddadfe69fcde0d9d74c03972a7b";

weatherform.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityinput.value.trim();
    if (city) {
        showLoader();
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError(error);
        }
        hideLoader();
    } else {
        displayError("Please Enter a City");
    }
});

if (clearBtn) {
    clearBtn.addEventListener("click", () => {
        card.style.display = "none";
        card.textContent = "";
        cityinput.value = "";
        document.body.style.background = "hsl(0, 0%,95%)";
    });
}

async function getWeatherData(city){

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${ city }&appid=${apiKey}`; 

    const response = await fetch(apiUrl);

    if(!response.ok){
        throw new Error("could not fetch weather data");
    }

    return await response.json();
    
}

function displayWeatherInfo(data) {
    const { name: city, main: { temp, humidity }, weather: [{ description, id }] } = data;
    card.textContent = "";
    card.style.display = "flex";
    card.classList.remove("fadeOut");
    card.classList.add("fadeIn");
    setDynamicBackground(id, city);
    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("span");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${((temp - 273.15) * (9/5) + 32).toFixed(1)}°F`;
    humidityDisplay.textContent = `Humidity: ${humidity}`;
    descDisplay.textContent = description.charAt(0).toUpperCase() + description.slice(1);
    weatherEmoji.innerHTML = getWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji", "emoji-animate");

    card.appendChild(weatherEmoji);
    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
}

function getWeatherEmoji(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300): // Thunderstorm
            return '<span title="Thunderstorm">⛈️</span>';
        case (weatherId >= 300 && weatherId < 400): // Drizzle
            return '<span title="Drizzle">🌦️</span>';
        case (weatherId >= 500 && weatherId < 600): // Rain
            return '<span title="Rain">🌧️</span>';
        case (weatherId >= 600 && weatherId < 700): // Snow
            return '<span title="Snow">❄️</span>';
        case (weatherId >= 700 && weatherId < 800): // Atmosphere (mist, smoke, etc.)
            return '<span title="Atmosphere">🌫️</span>';
        case (weatherId === 800): // Clear sky
            return '<span title="Clear sky">☀️</span>';
        case (weatherId >= 801 && weatherId < 900): // Clouds
            return '<span title="Clouds">☁️</span>';
        default:
            return '<span title="Unknown">❓</span>';
    }
}

// Helper to get Unsplash city image
async function getCityUnsplashImage(city) {
    const url = `https://source.unsplash.com/1600x900/?${encodeURIComponent(city)},cityscape`;
    return url;
}

// Enhanced setDynamicBackground to support Unsplash city images
async function setDynamicBackground(weatherId, city) {
    const bgImageDiv = document.getElementById('bgImage');
    let bg = "hsl(0, 0%,95%)";
    let videoSrc = "default.mp4";
    let usedCityImage = false;
    if (city) {
        // Try Unsplash city image
        const unsplashUrl = await getCityUnsplashImage(city);
        if (unsplashUrl && bgImageDiv) {
            bgImageDiv.style.backgroundImage = `url('${unsplashUrl}')`;
            bgImageDiv.classList.add('active');
            if (bgVideo) {
                bgVideo.removeAttribute('src');
                bgVideo.setAttribute("data-src", "");
                bgVideo.style.display = "none";
            }
            usedCityImage = true;
        }
    }
    if (usedCityImage) return;
    // Weather-based fallback
    if (bgImageDiv) {
        bgImageDiv.style.backgroundImage = '';
        bgImageDiv.classList.remove('active');
    }
    if (weatherId >= 200 && weatherId < 300) {
        bg = "linear-gradient(120deg, #373B44 0%, #4286f4 100%)";
        videoSrc = "thunderstorm.mp4";
    } else if (weatherId >= 300 && weatherId < 400) {
        bg = "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)";
        videoSrc = "drizzle.mp4";
    } else if (weatherId >= 500 && weatherId < 600) {
        bg = "linear-gradient(120deg, #005C97 0%, #363795 100%)";
        videoSrc = "rain.mp4";
    } else if (weatherId >= 600 && weatherId < 700) {
        bg = "linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)";
        videoSrc = "snow.mp4";
    } else if (weatherId >= 700 && weatherId < 800) {
        bg = "linear-gradient(120deg, #bdc3c7 0%, #2c3e50 100%)";
        videoSrc = "atmosphere.mp4";
    } else if (weatherId === 800) {
        bg = "linear-gradient(120deg, #f7971e 0%, #ffd200 100%)";
        videoSrc = "clear.mp4";
    } else if (weatherId >= 801 && weatherId < 900) {
        bg = "linear-gradient(120deg, #757f9a 0%, #d7dde8 100%)";
        videoSrc = "clouds.mp4";
    }
    document.body.style.background = bg;
    if (bgVideo) {
        if (bgVideo.getAttribute("data-src") !== videoSrc) {
            bgVideo.src = videoSrc;
            bgVideo.setAttribute("data-src", videoSrc);
        }
        bgVideo.style.display = "block";
    }
}

function showLoader() {
    if (loader) loader.style.display = "block";
    card.style.display = "none";
}

function hideLoader() {
    if (loader) loader.style.display = "none";
}


function displayError(message) {
    card.textContent = "";
    card.style.display = "flex";
    card.classList.remove("fadeIn");
    card.classList.add("fadeOut");
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");
    card.appendChild(errorDisplay);
    setDynamicBackground(0, null); // Reset background
}