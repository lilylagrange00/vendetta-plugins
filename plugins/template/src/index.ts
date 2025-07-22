import { logger, commands } from "@vendetta";
import Settings from "./Settings";
import { storage } from "@vendetta/plugin";

// Typed plugin storage
interface PluginStorage {
    prefix?: string;
}
const typedStorage = storage as unknown as PluginStorage;

let unregisterCommand: () => void;

export default {
    onLoad: () => {
        logger.log("Plugin loaded.");

        unregisterCommand = commands.registerCommand({
            name: "echo",
            displayName: "echo",
            description: "Replies with your message",
            displayDescription: "Replies with your message",
            options: [
                {
                    name: "text",
                    description: "Text to echo",
                    displayName: "text",
                    displayDescription: "Text to echo",
                    type: 3, // STRING
                    required: true,
                },
            ],
            applicationId: "-1",
            inputType: 1,
            type: 1,
            execute: ([text]) => ({
                content: `${typedStorage.prefix ?? "[Echo]"} ${text.value}`,
            }),
        });
    },

    onUnload: () => {
        unregisterCommand?.();
        logger.log("Plugin unloaded.");
    },

    settings: Settings,
};
