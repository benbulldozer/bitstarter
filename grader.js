#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var rest = require('restler');
var sys = require('util');




var assertFileExists = function(infile) {
    
    var instr = infile.toString();
    //console.log('infile '+infile);
    //console.log('infile to string '+instr);
    
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    
    return instr;
};



var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var checkUrlFile = function(url, checksfile) {
    //download the file using restler
    var urlWithFilename = url ;
    //console.log(urlWithFilename);
    //process.exit(1);
    rest.get(urlWithFilename).on('complete', function(result){
        if (result instanceof Error) {
            console.log('Error: ');
        //this.retry(5000); // try again after 5 sec
        } else {
	        
	        //fs.writeFile('C:/Users/BENJAY/Desktop/'+ '/benza.txt', result, function(err) {
	        fs.writeFile(__dirname + '/index.html', result, function(err) {   
  if (err) {
        console.log(err);
  }else{
        if(assertFileExists(HTMLFILE_DEFAULT)){
	            $ = cheerioHtmlFile(HTMLFILE_DEFAULT);
            var checks = loadChecks(checksfile).sort();
            var out = {};
            for(var ii in checks) {
                var present = $(checks[ii]).length > 0;
                out[checks[ii]] = present;
            }
              //begin output json to file
          fs.writeFile(__dirname+'/outputjson.txt', JSON.stringify(out, null, 4), function(err) {
 if(err) {
    console.log(err);
  } else {
//    console.log("JSON saved to outputjson.txt");
   }
 }); 
              //end output json to file
	        console.log(out);
	          }
  //console.log('It\'s saved!');
  }
});
          
        //    return out;
        } 
    });

};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url_to_download>', 'url to download file', HTMLFILE_DEFAULT)
        .parse(process.argv);
    //console.log(process.argv);

      var arguments = process.argv
         if(arguments[4] == '--url'){
        //console.log('url processing');
	     var checkJson = checkUrlFile(program.url, program.checks);
        var outJson = JSON.stringify(checkJson, null, 4);
	     }else if(arguments[4] == '--file'){
     //console.log("htmlfile processiing");    
    var checkJson = checkHtmlFile(program.url, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
//console.log('htmlile processing'); 
console.log(outJson); 
    }else{
      console.log('enter recognized parameter on the command line');
  }
    //console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
