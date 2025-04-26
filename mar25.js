function start() {
    const searchItem = document.querySelector("#searchInput").value.trim();
    const url = `https://restcountries.com/v3.1/name/${searchItem}`;

    fetch(url)
        .then(res => res.json())
        .then(data => newprocess(data))
        .catch(err => {
            console.error('Error:', err);
            document.querySelector("#countryContainer").innerHTML = `<p style="color:red;">Country not found.</p>`;
        });
}

function newprocess(data) {
    const countryContainer = document.querySelector("#countryContainer"); // Use a more descriptive name
    countryContainer.textContent = "";

    for (let i = 0; i < data.length; i++) {
        const country = data[i];

        const newDiv = document.createElement("div");
        newDiv.classList.add("country-card");

        newDiv.innerHTML = `
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <button class="more-btn">More Details</button>
            <div class="more-info" style="display:none; margin-top:1rem;">
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Area:</strong> ${country.area} km²</p>
                <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
                <p><strong>Currency:</strong> ${country.currencies ? Object.values(country.currencies).map(c => c.name).join(', ') : 'N/A'}</p>
                <p><strong>Timezone(s):</strong> ${country.timezones.join(', ')}</p>
                <div class="weather-info" style="margin-top:1rem;"></div>
            </div>
        `;

        const moreBtn = newDiv.querySelector(".more-btn");
        const moreInfo = newDiv.querySelector(".more-info");
        const weatherInfo = newDiv.querySelector(".weather-info");

        moreBtn.addEventListener("click", () => {
            if (moreInfo.style.display === "none") {
                moreInfo.style.display = "block";

                // Fetch Weather Info without API key
                if (country.capital) {
                    const weatherUrl = `https://wttr.in/${country.capital[0]}?format=j1`;

                    fetch(weatherUrl)
                        .then(res => res.json())
                        .then(weatherData => {
                            if (weatherData && weatherData.current_condition && weatherData.current_condition.length > 0) {
                                const current = weatherData.current_condition[0];
                                weatherInfo.innerHTML = `
                                    <h3>Weather in ${country.capital[0]}:</h3>
                                    <p><strong>Temperature:</strong> ${current.temp_C}°C</p>
                                    <p><strong>Weather:</strong> ${current.weatherDesc && current.weatherDesc.length > 0 ? current.weatherDesc[0].value : 'N/A'}</p>
                                    <p><strong>Humidity:</strong> ${current.humidity}%</p>
                                    <p><strong>Wind Speed:</strong> ${current.windspeedKmph} km/h</p>
                                `;
                            } else {
                                weatherInfo.innerHTML = `<p style="color:red;">Weather info not available for ${country.capital[0]}.</p>`;
                            }
                        })
                        .catch(err => {
                            console.error('Weather Fetch Error:', err);
                            weatherInfo.innerHTML = `<p style="color:red;">Weather info not available.</p>`;
                        });
                } else {
                    weatherInfo.innerHTML = `<p>No Capital City to Fetch Weather.</p>`;
                }
            } else {
                moreInfo.style.display = "none";
            }
        });

        countryContainer.appendChild(newDiv); // Append to the correctly named variable
    }
}

// Search button click
document.querySelector("#searchBtn").addEventListener("click", start);

// Search on Enter key press
document.querySelector("#searchInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        start();
    }
});