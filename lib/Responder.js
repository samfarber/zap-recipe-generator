"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('request');
function requestPromise(url, method = "GET", headers = -1, data = -1) {
    var trans = {
        method: method,
        url: url,
    };
    if (headers != -1)
        trans.headers = headers;
    if (data != -1) {
        trans.data = data;
        trans.json = true;
    }
    return new Promise((resolve, reject) => {
        request(trans, (err, response, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}
async function getResponse(query, params) {
    let paramValues = "";
    for (let param of params) {
        paramValues += param + ",";
    }
    paramValues = paramValues.slice(0, -1); // Cuts off last comma
    // Spoonacular API
    const apiKey = 'c941d1e0b2msh9eb575f1272b3d0p1b96d5jsnb8cc7f387d4d';
    var url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=5&ranking=1&ignorePantry=false&ingredients=" + paramValues;
    var body = await requestPromise(url, "GET", { "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com", "X-RapidAPI-KEY": apiKey });
    const json = JSON.parse(body);
    // console.log("JSON", json);
    // 5 recipe titles based on the inputted ingredients
    let titles = "";
    for (let title of json) {
        titles += title.title + ', ';
    }
    titles = titles.slice(0, -2);
    return [titles];
}
exports.getResponse = getResponse;
