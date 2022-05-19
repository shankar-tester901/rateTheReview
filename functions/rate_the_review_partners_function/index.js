const express = require('express')
const app = express()
const axios = require('axios');
const formData = require('form-data');
const catalyst = require("zcatalyst-sdk-node");
var iconv = require('iconv-lite');


app.use(express.json());
app.use(function(req, res, next) {
    console.log('URL:  ', req.url)
    next()
})



app.post('/getSentimentReview', (req, res) => {
    const catalystApp = catalyst.initialize(req);
    console.log('Received Term is  ' + req.body.rate_sentence);
    // let form = new formdata();

    var recommendForTerm = req.body.rate_sentence;

    //Starts

    var connector = catalystApp.connection({
        ConnectorName: {
            client_id: '8YWUA6K2LNL5LH',
            client_secret: 'c321be901c8d41c30d53b0784d36d',
            auth_url: 'https://accounts.zoho.com/oauth/v2/auth',
            refresh_url: 'https://accounts.zoho.com/oauth/v2/token',
            refresh_token: '11a1f1776a5605b9b2.619b0a5593591ad3442caf6edfcf7c9d'
        }
    }).getConnector('ConnectorName');


    connector.getAccessToken().then((accessToken) => {
        //    console.log('AccessToken is ' + accessToken);
        var url = 'https://ml.zoho.com/api/v2/nlp/sentiment?queryValue=' + recommendForTerm;
        //  console.log('url to be called is ' + url);

        var headers = {
            'Authorization': 'Bearer ' + accessToken
        };
        axios({
            headers: headers,
            url: url,
            method: 'GET',
            responseType: 'stream'
        }).then(resp => {
            resp.data.pipe(res);
        }).catch(err => {
            console.log('' + err);
            res.send(err)
        })

    }).catch(err => {
        console.log(err);
    });



})





module.exports = app;
