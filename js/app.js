
var app = angular.module("App", ["ngRoute", "firebase", "ngFileUpload"]);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'templates/home.html',
        controller: 'FirstController',
    })
        .when('/sign-up', {
            templateUrl: 'templates/sign-up.html',
            controller: 'SignUpController'
        })
        .when('/login', {
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        });
});



mapboxgl.accessToken = 'pk.eyJ1IjoiaWtobGFxIiwiYSI6ImNqZ2c4emh5MTJhYXQyeHBmcjN4aTA2aWsifQ.pH0lUBflmYrwPT_-4Y7DKA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [12.6974978, 56.0483045],
    maxZoom: 16,
    minZoom: 9,
    zoom: 9.68
});

var title = document.getElementById('location-title');
var description = document.getElementById('location-description');

var locations = [{
    "id": "2",
    "title": "Sofiero slott",
    "description": "Sofiero är ett slott med en 15 hektar stor parkträdgård i Helsingborgs socken i Helsingborgs.",
    "camera": {
        center: [12.6575198, 56.0841041],
        zoom: 50,
        pitch: 50
    }
}, {
    "id": "3",
    "title": "Väla centrum",
    "description": "Väla är Sveriges bästa shopping - 200 butiker Helsingborg Skåne Öppet Vardagar 10-20 Helger 10-18 Alltid gratis parkering..",
    "camera": {
        center: [12.7622641, 56.093351],
        bearing: -8.9,
        zoom: 30
    }
}, {
    "id": "1",
    "title": "Fredriksdal",
    "description": "Fredriksdal museer och trädgårdar är ett friluftsmuseum på 36 hektar i Helsingborg.",
    "camera": {
        center: [12.7109241, 56.0573553],
        bearing: 25.3,
        zoom: 30
    }
}, {
    "id": "4",
    "title": "Olympia",
    "description": "Olympia är en fotbollsarena i Helsingborg. Idrottsplatsen är hemmaplan åt Helsingborgs IF och ägs av Helsingborgs stad.",
    "camera": {
        center: [12.7048071, 56.0498063],
        bearing: 36,
        zoom: 20
    }
}, {
    "id": "5",
    "title": "knutpunkten",
    "description": "Knutpunkten är Helsingborgs största järnvägsstation .",
    "camera": {
        center: [12.6927689, 56.0437601],
        bearing: 28.4,
        zoom: 30
    }
}, {
    "title": "Helsingborg",
    "description": "En av Nordens äldsta och Sveriges renaste städer.",
    "camera": {
        center: [12.6974978, 56.0483045],
        zoom: 12,
        bearing: 0,
        pitch: 0
    }
}];

function highlightBorough(code) {
    // Only show the polygon feature that cooresponds to `borocode` in the data
    map.setFilter('highlight', ["==", "borocode", code]);
}

function playback(index) {
    title.textContent = locations[index].title;
    description.textContent = locations[index].description;

    highlightBorough(locations[index].id ? locations[index].id : '');

    // Animate the map position based on camera properties
    map.flyTo(locations[index].camera);

    map.once('moveend', function () {
        // Duration the slide is on screen after interaction
        window.setTimeout(function () {
            // Increment index
            index = (index + 1 === locations.length) ? 0 : index + 1;
            playback(index);
        }, 3000); // After callback, show the location for 3 seconds.
    });
}

// Display the last title/description first
title.textContent = locations[locations.length - 1].title;
description.textContent = locations[locations.length - 1].description;

map.on('load', function () {

    map.addLayer({
        "id": "highlight",
        "type": "fill",
        "source": {
            "type": "vector",
            "url": "mapbox://mapbox.8ibmsn6u"
        },
        "source-layer": "original",
        "paint": {
            "fill-color": "#fd6b50",
            "fill-opacity": 0.25
        },
        "filter": ["==", "borocode", ""]
    }, 'neighborhood_small_label'); // Place polygon under the neighborhood labels.

    // Start the playback animation for each borough
    playback(0);
});				
