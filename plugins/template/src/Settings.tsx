import { storage } from "@vendetta/plugin";
import { Forms } from "@vendetta/ui/components";
import { useProxy } from "@vendetta/storage";

const { FormInput, FormText } = Forms;

// Typed plugin storage
interface PluginStorage {
    prefix?: string;
}
const typedStorage = storage as unknown as PluginStorage;

export default () => {
    useProxy(storage);

    return (
        <>
            <FormText>Prefix for /echo command</FormText>
            <FormInput
                title="Prefix"
                value={typedStorage.prefix ?? "[Echo]"}
                onChange={(val) => {
                    typedStorage.prefix = val;
                }}
                placeholder="[Echo]"
            />
        </>
    );
};
