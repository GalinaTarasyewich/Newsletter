const express = require('express');
const bodyParser =  require('body-parser');
const requests = require('request');
const https = require('https');
const app = express();

// to hide apiKey
require("dotenv").config();
const api = process.env.Mailchimp_API;

// to be able to use bodyParserand forms,post,get etc
app.use(bodyParser.urlencoded({extended:true}));


// able to use css and images files that put into "piblic" folder
app.use(express.static('public'));


// starting localhost homepage with signup.html file
app.get("/",(req,res)=>{
    res.sendFile(`${__dirname}/signup.html`)
})

// getting inpits from the form in signup page
app.post("/",(req,res)=>{
    const firstName = req.body.fName;
    const email = req.body.email;
    const lastName = req.body.lName;


// data we need to sign a person in.
    const data = {
        email_address:email,
        status:"subscribed",
        merge_fields:{
            FNAME : firstName,
            LNAME : lastName
        }
    };

    const jsonData = JSON.stringify(data);

    // audience id found in contacts mailchimp
    const audienceId = '3ee541b798';
    const options = {
        method:"POST",

        // any name plus apiKey
        auth:"galina:" + api
    }

 // mailchimp url for const request. us8 is the number from apiID prefix
    const url = `https://us8.api.mailchimp.com/3.0/lists/${audienceId}/members?skip_merge_validation=${false}`;


// taking to success or failure html after sumbitting sign up form
    const request = https.request(url, options, response=>{
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      }  else {
        res.sendFile(__dirname + "/failure.html");
      }

        response.on('data',data=>{
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
})

// redirecting to home page after "try again" button press
app.post("/failure", function(req, res){
  res.redirect("/");
})


// localhost:3000 in browser
app.listen(3000,()=>console.log('Server is runnign on port 3000'));
