//Here i created the ar to stat program with list of city, when we
// dont have same city in the main array then random city!
var listRandom = ['Alabama', 'Lincoln', 'Boston', 'New York', 'Washington']
    //Here is where i will show the list of cities!
var listCityUl = $('#listCity');
//Here i declared the id of information city!
var cityName = $('#cityName');
var tempCity = $('#tempCity');
var windCity = $('#windCity');
var humCity = $('#humCity');
var uvCity = $('#uvCity');

//City array
var listCity = []
    //Cont var, count how many time save city array!
var contCity = 0;
//Recieve data from localStorage list city array!
var storedCityList = JSON.parse(localStorage.getItem("storedCityList"));
//Recieve data from localStorage cont!
var storedContList = JSON.parse(localStorage.getItem("storedCont"));
//Cont how many time found the correct time at Forecast list!
var cont = 0;

function init() {

    listCity = storedCityList;
    contCity = storedContList;
    //Here i verification if the listCity has same information as if not i will rondom same city to start program!
    if (listCity != null) {
        //I create the contCityTest because ever time i start program cont is plus 1 
        //but i need show last city i insert at array!
        //because this i decrease 1!
        var contCityTest = contCity;
        if (contCity >= 1 && contCity <= 7) {
            contCityTest--;
        }
        //Here i sand the city to show user
        searchResultsForecast(listCity[contCityTest])
        searchResultsLatLon(listCity[contCityTest], "1")
        createElements("0")

    } else {
        //Here i just show random city to user when start program and dosent have same city!
        var random = (Math.floor(Math.random() * (4 - 0)));
        searchResultsLatLon(listRandom[random], "2")
    }

}


//Here i created list of city
function createElements(eleCont) {
    //When eleCont is "0" i create all list to show last city the user has search!
    if (eleCont === "0") {
        for (var i = 0; i < listCity.length; i++) {
            /* Here i create elemente Button where will get name and id */
            var button = $('<button>');
            button.attr('id', listCity[i]);
            button.text(listCity[i]);
            button.addClass('btn btn-primary buttonspace');
            listCityUl.append(button);
            //When i click on the button i search the city!
            button.on('click', function() {
                var idBUttonString = $(this).attr('id').toString();
                searchResultsLatLon(idBUttonString, "1")
            });
        }
    } else {
        //Here i remove all child the listCity has and i creat new elemente!
        listCityUl.empty();
        for (var i = 0; i < listCity.length; i++) {
            var button = $('<button>');
            button.attr('id', listCity[i]);
            button.text(listCity[i]);
            button.addClass('btn btn-primary buttonspace');
            listCityUl.append(button);
            //When i click on the button i search the city!
            button.on('click', function() {
                var idBUttonString = $(this).attr('id').toString();
                searchResultsLatLon(idBUttonString, "1")
            });
        }
        var inputValue = $("#inputValue");
        inputValue.val("");
    }
}
/* Here is function when user press button they will take value of input and search the city*/
search_button.addEventListener('click', function() {
        var idBUttonString = $("#inputValue").val();
        searchResultsLatLon(idBUttonString, "1")
    })
    /* Here i search the city to get same information and show the user */
function searchResultsVarification(lat, lon, city, direction) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,daily&units=imperial&appid=64ed82577ced7f69cb1687f0ce536131")
        .then(response => {

            if (!response.ok) {
                throw new Error(`Please insert correct city`)
            }
            return response.json();
        })
        .catch(error => {
            alert(error.message)
        })
        .then(response => {
            if (direction === "1") {
                searchResults(city, response)
            } else {
                displayResultsCity(response, city)
                searchResultsForecast(city)
            }


        });
}
/* When i need find location of city i get the longitude and latitude to find city*/
function searchResultsLatLon(city, direction) {
    if (city != "") {

        fetch("https://api.openweathermap.org/data/2.5/weather?q=" +
                city +
                "&units=imperial&appid=64ed82577ced7f69cb1687f0ce536131")
            .then(response => {

                if (!response.ok) {
                    throw new Error(`Please insert correct city`)
                }
                return response.json();
            })
            .catch(error => {

                alert("Invalid City! Please insert correct City")
                var inputValue = $("#inputValue");
                inputValue.val("");
            })
            .then(response => {
                /* Here i send the latitude and longitude, name of city and direction to difine if is new city or just random*/
                searchResultsVarification(response.coord.lat, response.coord.lon, response.name, direction)


            });
    } else {
        alert("Please insert City")
    }
}
/* Here i get the information from day and show the results for the user. */
function searchResults(city, response) {

    /* val is just variable to check if can enter in if or not, if val= "nao" looks like the city user search is not in the array and i can 
    save at array if val="" can save the city at array! */
    var val = "";
    if (listCity != null) {
        /* Here i get all city to compare if new city has in array */
        for (var i = 0; i < listCity.length; i++) {
            /* I get the city names to upper Case to compare and see if is equal or not */
            if (listCity[i].toUpperCase() == city.toUpperCase()) {
                val = "nao";
            }
        }
    } else {
        contCity = 0;
        listCity = [];
    }

    if (val === "") {

        listCity[contCity] = city;
        /* Ever tive came here i will update te cont to save the city at array!*/
        if (contCity < 7) {
            contCity++;
        } else {
            contCity = 0;
        }
        /* if createElements = 1 they will delete and create new elemente */
        createElements("1")
        storedCity();
        displayResultsCity(response, city)
        searchResultsForecast(city)
    } else {
        createElements("1")
        displayResultsCity(response, city)
        searchResultsForecast(city)
    }
}





/* Here i get the information from next 5 days and show the results for the user. */
function searchResultsForecast(city) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" +
            city +
            "&units=imperial&appid=64ed82577ced7f69cb1687f0ce536131")
        .then(response => {

            if (!response.ok) {
                throw new Error(`http error: status ${response.status}`)
            }
            return response.json();
        })
        .catch(error => {

            alert(error.message)
        })
        .then(response => {
            list = response.list;
            /* Here i look for results has 12pm to get the information and show to the user see 5 days, if i dont do that they will show ever 3
            next hours */
            for (var i = 0; i < list.length; i++) {
                var arrayTodoText = list[i].dt_txt.split(" ");
                if (arrayTodoText[1] === "12:00:00") {
                    displayResultsListForecast(list[i].main.temp, list[i].wind.speed, list[i].main.humidity, cont, arrayTodoText[0])
                    cont++;
                }

            }
            cont = 0;
        });
}
/* Here i show the weather day! */
function displayResultsCity(weather, city) {
    var rightNow = moment().format('(MM/DD/YYYY)');
    cityName.text(city + rightNow);
    tempCity.text("Temp: " + weather.current.temp + "ºF");
    windCity.text("Wind: " + weather.current.wind_speed + " MPH");
    humCity.text("Humidity: " + weather.current.humidity + " %");
    uvCity.text("UV Index: " + weather.current.uvi);

}

/* Here i show update information to the weather for next 5 days, i get the id and set text to display*/
function displayResultsListForecast(tempText, humText, uvText, cont, date) {
    var forecastsdate = $('#forecastsdate' + cont);
    var forecasttemp = $('#forecasttemp' + cont);
    var forecastwind = $('#forecastwind' + cont);
    var forecasthum = $('#forecasthum' + cont);
    var forecastuv = $('#forecastuv' + cont);

    var date = date.split('-');
    /* Here i change the information to show weather data correct*/
    var newDate = (date[1] + "/" + date[2] + "/" + date[0])

    forecastsdate.text(newDate)
    forecasttemp.text("Temp: " + tempText + "ºF")
    forecastwind.text("Wind: " + humText + " MPH")
    forecasthum.text("Humidity: " + uvText + " %")
}
/* Here i just save the information on the local storage */
function storedCity() {
    localStorage.setItem("storedCityList", JSON.stringify(listCity));
    localStorage.setItem("storedCont", JSON.stringify(contCity));
}

init()