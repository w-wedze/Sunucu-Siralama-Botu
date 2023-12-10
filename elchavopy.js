const { Intents } = require("discord.js");
const express = require('express');
const Discord = require("discord.js");
const ejs = require('ejs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const { Client } = require('discord.js-selfbot-v13');
const cfg = require("./cfg.json")
const client = new Client({fetchAllMembers: true,
  intents: [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_BANS,
  Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
  Intents.FLAGS.GUILD_INTEGRATIONS,
  Intents.FLAGS.GUILD_VOICE_STATES,
  Intents.FLAGS.GUILD_PRESENCES,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_INVITES,
  Intents.FLAGS.GUILD_MESSAGE_TYPING,
  32767]});
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));
app.use('/assets', express.static(path.join(__dirname, './views/dist')));

const index = require('./routes/index');
const { error } = require('console');
app.use('/', index);

app.use((req, res, next) => {
  const err = new Error(':(');
  err.status = 404;
  next(err);
});


app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(443, () => {
  console.log('443 Portunda Başlatıldı.');
});

client.login(cfg.token)
.catch(err => console.log("npc misin tokene bak piç"))
