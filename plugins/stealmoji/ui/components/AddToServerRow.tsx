import { findByProps } from "@vendetta/metro";
import { React } from "@vendetta/metro/common";
import { showInputDialog } from "../../../../lib/ui/AlertDialog";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { Forms } from "@vendetta/ui/components";
import { showToast } from "@vendetta/ui/toasts";
import fetchImageAsDataURL from "../../lib/utils/fetchImageAsDataURL";
import { EmojiStore, Emojis, GuildIcon, GuildIconSizes, LazyActionSheet } from "../../modules";

const emojiSlotModule = findByProps("getMaxEmojiSlots");
const { FormRow, FormIcon } = Forms;

export default function AddToServerRow({ guild, emojiNode }: { guild: any; emojiNode: EmojiNode }) {
  // Helper: Extract emoji ID from URL
  function getEmojiIdFromSrc(src: string): string | null {
    const match = src.match(/\/emojis\/(\d+)\./);
    return match ? match[1] : null;
  }

  // Helper: Check if emoji is animated via EmojiStore metadata
  function isEmojiAnimated(src: string): boolean {
    const emojiId = getEmojiIdFromSrc(src);
    if (!emojiId) return false;
    const emoji = EmojiStore.getEmoji(emojiId);
    return emoji?.animated ?? false;
  }

  // Helper: Get proper emoji URL with correct extension
  function getCorrectEmojiUrl(src: string): string {
    const animated = isEmojiAnimated(src);
    const baseMatch = src.match(/(https:\/\/cdn.discordapp.com\/emojis\/\d+)\.\w+/);
    if (!baseMatch) return src;
    const baseUrl = baseMatch[1];
    const ext = animated ? "gif" : "webp";
    return `${baseUrl}.${ext}`;
  }

  const addToServerCallback = () => {
    showInputDialog({
      title: "Emoji name",
      initialValue: emojiNode.alt,
      placeholder: "Enter emoji name",
      onConfirm: async (name) => {
        const correctUrl = getCorrectEmojiUrl(emojiNode.src);
        fetchImageAsDataURL(correctUrl, (dataUrl) => {
          Emojis.uploadEmoji({
            guildId: guild.id,
            image: dataUrl,
            name,
            roles: undefined,
          })
            .then(() => {
              showToast(
                `Added ${emojiNode.alt} ${emojiNode.alt !== name ? `as ${name} ` : ""}to ${guild.name}`,
                getAssetIDByName("Check")
              );
            })
            .catch((e) => {
              showToast(e.body?.message ?? "Failed to upload emoji", getAssetIDByName("Small"));
            });
        });
      },
      confirmText: `Add to ${guild.name}`,
      cancelText: "Cancel",
    });
    LazyActionSheet.hideActionSheet();
  };

  let isSlotsUnknown = false;

  const slotsAvailable = React.useMemo(() => {
    let maxSlots = guild.getMaxEmojiSlots?.() ?? emojiSlotModule?.getMaxEmojiSlots?.(guild);
    if (!maxSlots) {
      if (!isSlotsUnknown) {
        isSlotsUnknown = true;
        showToast("Failed to check max emoji slots");
      }
      maxSlots = 250;
    }

    const guildEmojis = EmojiStore.getGuilds()[guild.id]?.emojis ?? [];
    const animated = isEmojiAnimated(emojiNode.src);

    return guildEmojis.filter((e) => e?.animated === animated).length < maxSlots;
  }, [guild.id, emojiNode.src]);

  return (
    <FormRow
      leading={<GuildIcon guild={guild} size={GuildIconSizes.MEDIUM} animate={false} />}
      disabled={!slotsAvailable}
      label={guild.name}
      subLabel={!slotsAvailable ? "No slots available" : isSlotsUnknown ? "Failed to check max emoji slots" : undefined}
      trailing={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_add_24px")} />}
      onPress={addToServerCallback}
    />
  );
}
