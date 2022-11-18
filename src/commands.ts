import discord, { AttachmentBuilder } from "discord.js";
import ReferencePages from "./mdnpages/ReferencePages";
import scraperInit from "./scraper";
interface CommandBase {
	discord: discord.RESTPostAPIChatInputApplicationCommandsJSONBody
	executor: (scraper: Awaited<ReturnType<typeof scraperInit>>, inter: discord.CommandInteraction) => Promise<void>;
}

export async function register(client: discord.Client<true>, data: CommandBase["discord"] | CommandBase["discord"][]) {
	if(!Array.isArray(data)) {
		client.application.commands.create(data);
		console.log(`Registered command ${data.name}.`);
	}
	else {
		await client.application.commands.set(data);
		console.log(`Registered ${data.length} commands successfully.`);
	}
}

const commands: CommandBase[] = [];
const JSPageChoices = Object.keys(ReferencePages.JS).map(k => {return {name: k, value: ReferencePages.JS[k as keyof typeof ReferencePages.JS]}});

commands.push({
	discord: new discord.SlashCommandBuilder()
		.setName("js")
		.setDescription("Search in js references.")
		.addStringOption(input => input.setRequired(true) // defaults to MainPage anyways
			.setName("page")
			.setDescription("Page to search in.")
			.addChoices(...JSPageChoices)
		)
		.addStringOption(input => input.setRequired(true)
			.setName("label")
			.setDescription("Set the label to search.")
		)
		.toJSON(),
	executor: async (scraper, inter) => {
		if(!inter.isCommand()) throw new Error("Something went wrong.");

		let pageURL: typeof ReferencePages.JS[keyof typeof ReferencePages.JS];
		const pageOption = inter.options.get("page", true);
		if(!pageOption || !pageOption.value) pageURL = ReferencePages.JS.MainPage;
		else pageURL = pageOption.value.toString() as typeof ReferencePages.JS[keyof typeof ReferencePages.JS];

		let label: string;
		const labelOption = inter.options.get("label", true);
		if(!labelOption || !labelOption.value?.toString()) throw new Error("Label option is either not provided or not a string.");
		label = labelOption.value.toString();

		await inter.deferReply();

		await scraper.goto(`${pageURL}#${label}`);
		const buffer = await scraper.screenshot(label);
		const attachments = buffer.map(b => {
			if(!b) return;
			return new AttachmentBuilder(b, {name: `${pageOption.name}.jpeg`});
		}).filter(b => !!b) as discord.AttachmentBuilder[];
		await inter.editReply({files: attachments})
	}
} satisfies CommandBase);

commands.push({
	discord: new discord.SlashCommandBuilder()
		.setName("search")
		.setDescription("Search for a specific section")
		.addSubcommand(input => input
			.setName("js")
			.setDescription("Search for a section in JS")
			.addStringOption(input => input.setRequired(true)
				.setName("page")
				.setDescription("Page to search in.")
				.setChoices(...JSPageChoices)
			)
			.addStringOption(input => input.setRequired(true)
				.setName("label")
				.setDescription("Label to search for.")
			)
		)
		.toJSON(),
		executor: async (scraper, inter) => {

		},
} satisfies CommandBase)

export default commands;
