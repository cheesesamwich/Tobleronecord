import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { classNameFactory, disableStyle, enableStyle } from "@api/Styles";
import { PluginNative } from "@utils/types";
import { DataStore } from "@api/index";
import { GuildStore, ChannelStore, useState, } from "@webpack/common";
import { useAwaiter, useForceUpdater } from "@utils/react";
import style from "./style.css?managed";;
const cl = classNameFactory("vc-channelemojis");
const native = VencordNative.pluginHelpers.ChannelEmojis as PluginNative<typeof import("./native")>;
const key = "channelemojis-emojis";

async function AddKeyToDataStore(id, emoji)
{
    const data = JSON.parse(await DataStore.get(key) ?? "{}");
    data[id] = findEmoji(emoji);
    DataStore.set(key, JSON.stringify(data));
}

// failsafe against long ass "i'm sorry, but as an ai language model..." emoji names
function findEmoji(str)
{
    const emojiRegex = /([\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F700}-\u{1F77F}|\u{1F780}-\u{1F7FF}|\u{1F800}-\u{1F8FF}|\u{1F900}-\u{1F9FF}|\u{1FA00}-\u{1FA6F}|\u{1FA70}-\u{1FAFF}|\u{2600}-\u{26FF}|\u{2300}-\u{23FF}|\u{2B50}|\u{1F004}-\u{1F251}])/gu;

    const matches = str.match(emojiRegex);

    return matches ? matches[0] : null;
}

  
async function GenerateAndReturnEmoji(channel)
{   
    // console.log(`Generating for ${channel.id}`);

    const data = ChannelStore.getChannel(channel.id);

    const parameters = JSON.stringify({data: `Name: ${data.name} - Topic: ${(data.topic && data.topic?.length) ?? "Channel has no topic"} (${GuildStore.getGuild(data.guild_id).name})`});

    const response = await native.GenerateResponse(parameters);
    
    const content = response?.message?.content;
    if(content)
    {
        AddKeyToDataStore(channel.id, content);
    }
    
    return content ?? "💬";
}

let emojis = {};

function EmojiCircle(channel) {
    const [emoji, setEmoji] = useState("💬");

    const updater = useForceUpdater();

    useAwaiter(async () => 
    {
        const storedData = await DataStore.get(key);
        emojis = JSON.parse(storedData ?? "{}");
        if (emojis[channel.id]) 
        {
            setEmoji(emojis[channel.id]);
        }
        else
        {
            await GenerateAndReturnEmoji(channel);
            updater();
        }
    });

    return (
        <div className={cl("-emoji")}>
            <h1>{emoji}</h1>
        </div>
    );
}

export default definePlugin({
    name: "ChannelEmojis",
    description: "Revives the channel emojis experiment using a local ollama server (port 11434)",
    authors:
    [
        Devs.Samwich
    ],
    EmojiCircle: EmojiCircle,
    patches: [
        {
            find: ".iconContainerWithGuildIcon,",
            replacement: {
                match: /(let \i=(\i)=>{)(let{className:\i)/,
                replace: "$1return $self.EmojiCircle($2.channel);$3"
            }
        }
    ],
    start()
    {
        enableStyle(style);
    },
    stop()
    {
        disableStyle(style);
    }
});
