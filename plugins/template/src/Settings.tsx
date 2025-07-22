import { storage } from "@vendetta/plugin";
import { Forms } from "@vendetta/ui/components";

const { FormSwitch, FormText } = Forms;

export default () => {
  return (
    <>
      <FormText>
        Adds a 🎉 before any message containing ".gif"
      </FormText>
      <FormSwitch
        label="Enable plugin"
        value={!!storage.enabled}
        onValueChange={(value) => (storage.enabled = value)}
      />
    </>
  );
};
