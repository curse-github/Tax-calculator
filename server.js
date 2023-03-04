"use strict";
var pages = {
    "/":                                       function (req, res, send) { send("/build/index.html"                            ); },
    "/favicon.ico":                            function (req, res, send) { send("/build/favicon.ico"                           ); },
    "/logo192.png":                            function (req, res, send) { send("/build/logo192.png"                           ); },
    "/manifest.json":                          function (req, res, send) { send("/build/manifest.json"                         ); },
    "/asset-manifest.json":                    function (req, res, send) { send("/build/asset-manifest.json"                   ); },
    "/robots.txt":                             function (req, res, send) { send("/build/robots.txt"                            ); },
    "/static/js/main.0caa902a.js":             function (req, res, send) { send("/build/static/js/main.0caa902a.js"            ); },
    "/static/js/main.0caa902a.js.LICENSE.txt": function (req, res, send) { send("/build/static/js/main.0caa902a.js.LICENSE.txt"); },
    "/static/js/main.0caa902a.js.map":         function (req, res, send) { send("/build/static/js/main.0caa902a.js.map"        ); },
    "/static/css/main.190dc70d.css":           function (req, res, send) { send("/build/static/css/main.190dc70d.css"          ); },
    "/static/css/main.190dc70d.css.map":       function (req, res, send) { send("/build/static/css/main.190dc70d.css.map"      ); }
};
var app = require("express")();
Object.keys(pages).forEach(i=>{app.get(i,(req, res)=>pages[i](req, res,page=>res.sendFile(__dirname+(page||i),"utf8")))});
app.get("*",(req, res)=>{res.redirect("/index.html");});
const PORT = 62422;
app.listen(PORT,()=>{ console.clear();console.log("Public web execution page is running at http://localhost:"+PORT) });
