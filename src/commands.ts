import discord from "discord.js";
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

commands.push({
	discord: new discord.SlashCommandBuilder()
		.setName("js")
		.setDescription("Search in js references.")
		.addStringOption(input => input.setRequired(true)
			.setName("label")
			.setDescription("Set the lalebl to search.")
		)
		.addStringOption(input => input.setRequired(false) // Default to MainPage
			.setName("page")
			.setDescription("Page to search in.")
			.addChoices(...Object.keys(ReferencePages.JS).map(k => {return {name: k, value: ReferencePages.JS[k as keyof typeof ReferencePages.JS]}}))
		)
		.toJSON(),
	executor: async (scraper, inter) => {
		if(!inter.isCommand()) throw new Error("Something went wrong.");

		let pageURL: typeof ReferencePages.JS[keyof typeof ReferencePages.JS];
		const pageOption = inter.options.get("page", false);
		if(!pageOption || !pageOption.value) pageURL = ReferencePages.JS.MainPage;
		else pageURL = pageOption.value.toString() as typeof ReferencePages.JS[keyof typeof ReferencePages.JS];

		let label: string;
		const labelOption = inter.options.get("label", true);
		if(!labelOption || !labelOption.value?.toString()) throw new Error("Label option is either not provided or not a string.");
		label = labelOption.value.toString();

		await inter.deferReply();
		await inter.editReply(`Scraping from <${pageURL}>`);

		await scraper.goto(pageURL);
		const buffer = await scraper.screenshot(label);
		await inter.editReply({files: [new discord.AttachmentBuilder(buffer, {name: `${pageOption?.name}.png`})]})
	}
} satisfies CommandBase);

export default commands;
