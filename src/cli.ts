import chalk from "chalk";
import { styles } from "./core/style.js";

const log = console.log;

function logError(message: string): void {
    log(chalk.bgHex(styles.error.bg).hex(styles.error.fg)(message));
}

function logWarning(message: string): void {
    log(chalk.bgHex(styles.warning.bg).hex(styles.warning.fg)(message));
}

function logSuccess(message: string): void {
    log(chalk.bgHex(styles.success.bg).hex(styles.success.fg)(message));
}

function logInfo(message: string): void {
    log(chalk.bgHex(styles.info.bg).hex(styles.info.fg)(message));
}

function logChatMessage(message: string): void {
    log(chalk.bgHex(styles.chatMessage.bg).hex(styles.chatMessage.fg)(message));
}

import WebSocket from "websocket";
const { client: WebSocketClient } = WebSocket;

const client = new WebSocketClient();

client.on("connectFailed", (error: Error) => {
    logError(`Connect Error: ${error.toString()}`);
});

client.on("connect", (connection: WebSocket.connection) => {
    logSuccess("WebSocket Client Connected");
    connection.on("error", (error: Error) => {
        logError(`Connection Error: ${error.toString()}`);
    });
    connection.on("close", () => {
        logWarning("WebSocket Client Closed");
    });
    connection.on("message", (message: WebSocket.Message) => {
        if (message.type === "utf8") {
            logChatMessage(message.utf8Data);
        }
    });

    const sendMessage = (message: string) => {
        if (connection.connected) {
            connection.sendUTF(message);
        }
    };
    setInterval(() => {
        sendMessage(`Hello! ${(Math.random() * 10000).toFixed(2)} ${Date.now().toString()}`);
    }, 2400);
});

logInfo("Connecting to WebSocket Server...");
client.connect("ws://localhost:8080/", "echo-protocol");