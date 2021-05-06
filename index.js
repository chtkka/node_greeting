const express = require('express');
const app = express();
const server = require('http').Server(app);
const port = 5000;
const helmet = require('helmet');
//Backtracking regex checking library 
const safe = require('safe-regex');


//CORS setup
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
    next();
});

app.options('*',function(req,res){
    res.send(200);
});

//Listen function for app
server.listen(port,(err)=>{
    if(err){
        throw err;
    }
    console.log(`Listening on port ` + port)
})

//Default route, give guide for use
app.get('/',(err,res)=>{
    res.status(200);
    res.send('Use endpoint /greeting/{name} for the greeting');
    res.end
})


app.param('name',(req,res,next,name)=>{
    //Sanitize string for HTML char before running it through any functions
    sanitized = preventCode(String(name));
    //Faciliatate proper noun grammar, but not technically necessary.
    const upper = sanitized.charAt(0).toUpperCase() + sanitized.slice(1);

    req.name = upper;
    next();
});

//Route for no specified param, thrown error
app.get('/greeting/',(req,res,err) => {
    res.send('No name specified, please specify a name for a greeting.');
});


app.get('/greeting/:name',(req,res,err)=>{
    //Extra check for null/undefined req.name
    if(req.name == null || req.name == undefined || req.name == 'null' || req.name == 'undefined' || req.name == 'Null' || req.name == 'Undefined'){
        res.send('No name specified, please specify a name for a greeting.');
    }else{
        res.send('Hello, ' + req.name + '!');
     }
});

//Function to convert html chars into formatted characters to prevent attacks
function preventCode(text) {
    var dict = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
      '/': '&#047',
      '\\': '&#092'
    };
    //Regex passed through validator, no catastrophic backtracking potential detected
    regex = text.replace(/[&<>"'/\\]/g, function(m) { return dict[m]; });

    return regex;
  }

module.exports=server;