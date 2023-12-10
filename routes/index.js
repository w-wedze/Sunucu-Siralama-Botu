const { Intents } = require("discord.js");
const express = require('express');
const router = express.Router();
const Discord = require("discord.js");
const { Client } = require('discord.js-selfbot-v13');
const cfg = require("../cfg.json")
const client = new Client({
	fetchAllMembers: true,
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
	  32767] });
client.login(cfg.token);

router.get('/', async (req, res, next) => {
	const botGuilds = [];
    const totalGuilds = client.guilds.cache.size;

	for (const [guildID, guild] of client.guilds.cache) {
	  let totalVoiceUsers = 0;
	  let mutedVoiceUsers = 0;
  
	  guild.channels.cache.forEach((channel) => {
		if (channel.type === 'GUILD_VOICE') {
		  totalVoiceUsers += channel.members.size;
  
		  channel.members.forEach((member) => {
			const voiceState = member.voice;
			if (voiceState && voiceState.mute) {
			  mutedVoiceUsers += 1;
			}
		  });
		}
	  });
  
	  const guildData = {
		id: guild.id,
		name: guild.name,
		memberCount: guild.memberCount,
		iconURL: guild.iconURL({ format: 'png', dynamic: true, size: 4096 }) || 'https://cdn.discordapp.com/attachments/1168953173533261965/1171211029859016735/8eb17bd9-2ef8-4809-934b-09a0280c2f54.jpg?ex=655bda45&is=65496545&hm=75e4a1a496fb11290a7f453a2256f6b35267721b14fa9949313239d9743fb761&',
		voiceChannelUsers: totalVoiceUsers,
		mutedVoiceUsers: mutedVoiceUsers,
	  };
  
	  botGuilds.push(guildData);
	}
  
	return res.render('index.ejs', { botGuilds: botGuilds, totalGuilds: totalGuilds });
});

router.get('/guilds', async (req, res, next) => {
	const botGuilds = [];
	const totalGuilds = client.guilds.cache.size;

	for (const [guildID, guild] of client.guilds.cache) {
	  let totalVoiceUsers = 0;
	  let mutedVoiceUsers = 0;
  
	  guild.channels.cache.forEach((channel) => {
		if (channel.type === 'GUILD_VOICE') {
		  totalVoiceUsers += channel.members.size;
  
		  channel.members.forEach((member) => {
			const voiceState = member.voice;
			if (voiceState && voiceState.mute) {
			  mutedVoiceUsers += 1;
			}
		  });
		}
	  });
  
	  const guildData = {
		id: guild.id,
		name: guild.name,
		memberCount: guild.memberCount,
		iconURL: guild.iconURL({ format: 'png', dynamic: true, size: 4096 }) || 'https://cdn.discordapp.com/attachments/1168953173533261965/1171211029859016735/8eb17bd9-2ef8-4809-934b-09a0280c2f54.jpg?ex=655bda45&is=65496545&hm=75e4a1a496fb11290a7f453a2256f6b35267721b14fa9949313239d9743fb761&',
		bannerURL: guild.bannerURL({ format: 'png', dynamic: true, size: 4096 }) || '',
		vanityURLCode: guild.vanityURLCode,
		voiceChannelUsers: totalVoiceUsers,
		mutedVoiceUsers: mutedVoiceUsers,
		createdAt: guild.createdAt
	  };
  
	  botGuilds.push(guildData);
	}
  
	return res.render('guilds.ejs', { botGuilds: botGuilds, totalGuilds: totalGuilds });
});  
  
router.get('/guild/:id', async (req, res, next) => {
	const guildId = req.params.id;
	const guild = client.guilds.cache.get(guildId);
	

	if (!guild) {
		return res.redirect('/400')
	}

	const channelCount = guild.channels.cache.size;
	const roleCount = guild.roles.cache.size;
	const emojiCount = guild.emojis.cache.size;

	let totalVoiceUsers = 0;
	let mutedVoiceUsers = 0;

	guild.channels.cache.forEach((channel) => {
		if (channel.type === 'GUILD_VOICE') {
			totalVoiceUsers += channel.members.size;

			channel.members.forEach((member) => {
				const voiceState = member.voice;
				if (voiceState && voiceState.mute) {
					mutedVoiceUsers += 1;
				}
			});
		}
	});

	const guildData = {
		id: guild.id,
		name: guild.name,
		memberCount: guild.memberCount,
		iconURL: guild.iconURL({ format: 'png', dynamic: true, size: 4096 }) || 'https://cdn.discordapp.com/attachments/1168953173533261965/1171211029859016735/8eb17bd9-2ef8-4809-934b-09a0280c2f54.jpg?ex=655bda45&is=65496545&hm=75e4a1a496fb11290a7f453a2256f6b35267721b14fa9949313239d9743fb761&',
		bannerURL: guild.bannerURL({ format: 'png', dynamic: true, size: 4096 }) || '',
		vanityURLCode: guild.vanityURLCode,
		voiceChannelUsers: totalVoiceUsers,
		mutedVoiceUsers: mutedVoiceUsers,
		createdAt: guild.createdAt,
		channelCount: channelCount,
		roleCount: roleCount,
		emojiCount: emojiCount
	};

	return res.render('guildProfile.ejs', { guildData: guildData });
});


router.get('/404', (req, res, next) => {
res.render('404.ejs');
});
router.get('/400', (req, res, next) => {
	res.render('400.ejs');
	});


module.exports = router;
