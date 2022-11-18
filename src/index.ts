import discord from "discord.js";
import { argv } from "process";

import commands, { register } from "./commands";
import initialize from "./scraper";

console.log(`token: ${argv[2]}`);
new discord.Client({intents: [
	"MessageContent", "Guilds"
]}).once("ready", async client => {
	console.log(`Up running @ ${client.user.username}#${client.user.discriminator}`);

	register(client, commands.map(c => c.discord));
	const scraper = await initialize();

	client.on("interactionCreate", async e => {
		if(e.isCommand()) {
			const cmd = commands.find(c => c.discord.name === e.commandName)
			if(!cmd) {
				await e.reply("Unknown command");
				return;
			}
			try {
				await cmd.executor(scraper, e);
			} catch(err) {(e.deferred || e.replied) ? await e.editReply(`\`${err}\``) : await e.reply(`\`${err}\``)}
		}
	});
}).login(argv[2]);
