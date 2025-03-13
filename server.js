var pages = {
    "/"                                      :(req, res, send)=>send("/build/index.html"                            ),
    "/index.html"                                      :(req, res, send)=>send("/build/index.html"                  ),
    "/favicon.ico"                           :(req, res, send)=>send("/build/favicon.ico"                           ),
    "/logo192.png"                           :(req, res, send)=>send("/build/logo192.png"                           ),
    "/manifest.json"                         :(req, res, send)=>send("/build/manifest.json"                         ),
    "/asset-manifest.json"                   :(req, res, send)=>send("/build/asset-manifest.json"                   ),
    "/robots.txt"                            :(req, res, send)=>send("/build/robots.txt"                            ),
    "/static/js/main.2505fb7c.js"            :(req, res, send)=>send("/build/static/js/main.2505fb7c.js"            ),
    "/static/js/main.2505fb7c.js.LICENSE.txt":(req, res, send)=>send("/build/static/js/main.2505fb7c.js.LICENSE.txt"),
    "/static/js/main.2505fb7c.js.map"        :(req, res, send)=>send("/build/static/js/main.2505fb7c.js.map"        ),
    "/static/css/main.190dc70d.css"          :(req, res, send)=>send("/build/static/css/main.190dc70d.css"          ),
    "/static/css/main.190dc70d.css.map"      :(req, res, send)=>send("/build/static/css/main.190dc70d.css.map"      ),
    "/vibrate.html"      :(req, res, send)=>send()
};
var app = require("express")();
Object.keys(pages).forEach(i=>{app.get(i,(req, res)=>pages[i](req, res,page=>res.sendFile(__dirname+(page||i),"utf8")))});
app.get("*",(req, res)=>{res.redirect("/index.html");});
const PORT = 62422;
app.listen(PORT,()=>{ console.clear();console.log("Public web execution page is running at http://localhost:"+PORT) });
