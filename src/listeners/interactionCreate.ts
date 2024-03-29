import { CommandInteraction, Client, Interaction, SelectMenuInteraction, ContextMenuInteraction, ButtonInteraction, } from "discord.js";
import { Command } from "src/command";

export default (client: Client): void => {
	client.on("interactionCreate", async (interaction: Interaction) => {
		if (interaction.isCommand() || interaction.isContextMenu()) {
			await handleCommand(client, interaction);
		}

		if (interaction.isSelectMenu()) {
			await handleSelect(client, interaction);
		}

		if (interaction.isButton()) {
			await handleButton(client, interaction);
		}
	});
};

const handleButton = (client: any, interaction: ButtonInteraction): void => {
	const command: Command = client.commands.get(JSON.parse(interaction.customId).cmdN);
	if (!command) {
		// interaction.followUp({ content: "An error has occurred" });
		return;
	}

	try {
		if (command.button) command.button(interaction);
	} catch (error) {
		console.error(error);
		// interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
}

const handleSelect = (client: any, interaction: SelectMenuInteraction): void => {
	console.log(`Parsed ID: `, JSON.parse(interaction.customId))

	const command: Command = client.commands.get(JSON.parse(interaction.customId).cmdN);
	if (!command) {
		interaction.reply({ content: "An error has occurred", ephemeral: true });
		return;
	}
	try {
		if (command.select) command.select(interaction);
	} catch (error) {
		console.error(error);
		interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
};

const handleCommand = (client: any, interaction: CommandInteraction | ContextMenuInteraction): void => {
	const command = client.commands.get(interaction.commandName);
	if (!command) {
		interaction.reply({ content: "An error has occurred", ephemeral: true });
		return;
	}

	try {
		command.execute(interaction);
	} catch (error) {
		console.error(error);
		interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
};