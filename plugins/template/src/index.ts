import { before } from "@vendetta/patcher";
import { findByProps } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";
import Settings from "./Settings";

let unpatch: () => void;

export default {
    onLoad() {
    const MessageSender = findByProps("sendMessage", "receiveMessage");

    unpatch = before("sendMessage", MessageSender, ([channelId, msg]) => {
      if (!storage.enabled) return;
      if (!msg.content.includes(".gif")) return;

      msg.content = `🎉 ${msg.content}`;
    });
  },

  onUnload() {
    unpatch?.();
  },

  settings: Settings,
};
