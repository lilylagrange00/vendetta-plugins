import { storage } from "@vendetta/plugin";
import { Forms } from "@vendetta/ui/components";
import { React } from "@vendetta/metro/common";

const { FormSwitch, FormText } = Forms;

export default () => {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  return (
    <>
      <FormText>
        Adds a 🎉 before any message containing ".gif"
      </FormText>
      <FormSwitch
        label="Enable plugin"
        value={!!storage.enabled}
        onValueChange={(value) => {
          storage.enabled = value;
          forceUpdate(); // 🔄 Re-render settings when value changes
        }}
      />
    </>
  );
};
