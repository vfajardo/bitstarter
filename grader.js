#!/usr/bin/env node
var fs =require('fs');
var program=require('commander');
var cheerio=require('cheerio');
var rest=require('restler');
var sys = require('util');
var HTMLFILE_DEFAULT ="index.html";
var CHECKSFILE_DEFAULT = "checks.json";


var assertFileExists = function(infile){
     var instr = infile.toString();
     if(!fs.existsSync(instr)){
         console.log("%a does not exist. Exiting.", instr);
          process.exit(1); // http:
       }
       return instr;
};

var cheerioHtmlFile = function(htmlfile){
     return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile){
     return JSON.parse(fs.readFileSync(checksfile));
};





var checkHtmlFile = function(htmlfile,checksfile){
      $ =cheerioHtmlFile(htmlfile);
      var checks =loadChecks(checksfile).sort();
      var out={};
      for(var ii in checks) {
          var present = $(checks[ii]).length >0;
          out[checks[ii]]=present;
      }
      return out;
};


var checkUrlFile = function(result,checksfile){
      $ =cheerio.load(result);
      var checks =loadChecks(checksfile).sort();
      var out={};
      for(var ii in checks) {
          var present = $(checks[ii]).length >0;
          out[checks[ii]]=present;
      }
      return out;
};



var clone = function(fn){
       // Workarounf for commander.js
       // http://stackoverflow.com/a/6772648
        return fn.bind({});
};

if(require.main==module){
    program
        .option('-c, --checks <check_file>', 'Path to checks.json',clone(assertFileExists),CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <html_file>','url to index.html')
        .parse(process.argv);

    if (program.url){
       console.log('Detectec url');
       var fichero;
       rest.get(program.url).on('complete',function(result) {
           if(result instanceof Error){
              sys.puts('Error: '+result.message);
            } else{ //sys.puts(result); 
                     fichero=result;}

       });
       var  checkJson =checkUrlFile(fichero,program.checks);
            var outJson =JSON.stringify(checkJson,null,4);
            console.log(outJson);         
            

            
    }else {
            var  checkJson =checkHtmlFile(program.file,program.checks);
            var outJson =JSON.stringify(checkJson,null,4);
            console.log(outJson);         
             
         }
} else {
      exports.checkHtmlFile = checkHtmlFile;
}
    
