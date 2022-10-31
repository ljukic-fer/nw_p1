"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;

var tablica = require("./tablica.json");
var kola = require("./kola.json");
var models = require("./models");
var sequelize = require("sequelize");
var async = require("async");
var express_1 = __importDefault(require("express"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var https_1 = __importDefault(require("https"));
var express_openid_connect_1 = require("express-openid-connect");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1["default"].config();
var app = (0, express_1["default"])();
app.set("views", path_1["default"].join(__dirname, "views"));
app.set('view engine', 'pug');
var port = 4080;
var config = {
    authRequired: false,
    idpLogout: true,
    secret: process.env.SECRET,
    baseURL: "https://localhost:".concat(port),
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: 'https://dev-hr4bydmi.eu.auth0.com',
    clientSecret: process.env.CLIENT_SECRET,
    authorizationParams: {
        response_type: 'code'
    }
};
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use((0, express_openid_connect_1.auth)(config));
app.get('/', function (req, res) {
    var _a, _b, _c;
    var username;
    if (req.oidc.isAuthenticated()) {
        username = (_b = (_a = req.oidc.user) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : (_c = req.oidc.user) === null || _c === void 0 ? void 0 : _c.sub;
    }
    res.render('index', { username: username, tablica, kola });
});
app.get('/private', (0, express_openid_connect_1.requiresAuth)(), function (req, res) {
    var user = JSON.stringify(req.oidc.user);
    res.render('private', { user: user, tablica, kola });
});
app.get("/sign-up", function (req, res) {
    res.oidc.login({
        returnTo: '/',
        authorizationParams: {
            screen_hint: "signup"
        }
    });
});


app.get("/jsontest", function (req, res) {
    var json = [{ id: 1, name: "foo", }, { id: 2, name: "foooo" }];
    res.render('jsontest', { title: 'title', json });



    models.Comm.findAll({
        order: sequelize.literal("createdAt DESC")
      }).then(comms => {
        let commData = [];
    
        async.eachSeries(comms, (comm, callback) => {
          comm = comm.get({ plain: true });
          auth.client.getUser(comm.authorId).then(user => {
            commData.push({
              body: comm.body,
              createdAt: comm.createdAt,
              authorName: req.oidc.user,
              date: new Date()
            });
            callback();
          }).catch(err => {
            commData.push({
              body: comm.body,
              createdAt: comm.createdAt,
              date: comm.date
            });
            callback();
          });
        }, err => {
          return res.render("index", { comms: commData });
        });
      });




});



https_1["default"].createServer({
    key: fs_1["default"].readFileSync('server.key'),
    cert: fs_1["default"].readFileSync('server.cert')
}, app)
    .listen(port, function () {
        console.log("Server running at https://localhost:".concat(port, "/"));
    });
