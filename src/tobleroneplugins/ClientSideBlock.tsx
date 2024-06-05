import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { RelationshipStore } from "@webpack/common";
import { Text } from "@webpack/common";

const settings = definePluginSettings(
{
    usersToBlock: {
        type: OptionType.STRING,
        description: "IDs seperated by a comma and a space",
        default: "",
        restartNeeded: true
    },
    hideBlockedUsers: {
        type: OptionType.BOOLEAN,
        description: "If blocked users should also be fully hidden",
        default: true,
        restartNeeded: true
    },
    hideBlockedMessages: {
        type: OptionType.BOOLEAN,
        description: "If messages from blocked users should be hidden fully (same as the old noblockedmessages plugin)",
        default: true,
        restartNeeded: true
    }
});

//I KNOW THE NAMING IS WRONG BUT I CANT CHANGE IT NOW
function shouldShowUser(id)
{
    //hide the user if the user is blocked and the hide blocked users setting is enabled
    if(RelationshipStore.isBlocked(id) && settings.store.hideBlockedUsers)
    {
        return true;
    }
    //failsafe that is needed for some reason
    if(settings.store.usersToBlock.length == 0)
    {
        return false;
    }
    //hide the user if the id is in the users to block setting
    return settings.store.usersToBlock.split(", ").includes(id);
}

function hiddenReplyComponent()
{
    return(
        <Text tag="p" selectable={false} variant="text-sm/normal"><i>↓ Replying to blocked message</i></Text>
    )
}

export default definePlugin({
    name: "ClientSideBlock",
    description: "Allows you to locally hide almost all content from any user (messages (including repies), friends list objects, dm buttons, member list objects)",
    tags: ["blocked", "block", "hide", "hidden", "noblockedmessages"],
    authors:
    [
        Devs.Samwich
    ],
    settings,
    shouldShowUser: shouldShowUser,
    hiddenReplyComponent: hiddenReplyComponent,
    patches: [
        // messages
        {
            find: ".messageListItem",
            replacement: {
                match: /renderContentOnly:\i}=\i;/,
                replace: "$&if($self.shouldShowUser(arguments[0].message.author.id)) return null; "
            }
        },
        //friends list (should work with all tabs)
        {
            find: "peopleListItemRef.current.componentWillLeave",
            replacement: {
                match: /\i}=this.state;/,
                replace: "$&if($self.shouldShowUser(this.props.user.id)) return null; "
            }
        },
        //member list
        {
            find: "this.props.isGuildEligibleForRecentlyOnline",
            replacement: {
                match: /new Date\(\i\):null;/,
                replace: "$&if($self.shouldShowUser(this.props.user.id)) return null; "
            }
        },
        //replies
        {
            find: ".MessageFlags.IS_VOICE_MESSAGE)",
            replacement: {
                match: /new Date\(\i\):null;/,
                replace: "$&if($self.shouldShowUser(this.props.user.id)) return null; "
            }
        },
        //Hide blocked messages
        {
            find: ".MessageTypes.GUILD_APPLICATION_PREMIUM_SUBSCRIPTION||",
            replacement: [
                {
                    match: /let \i;let\{repliedAuthor:/,
                    replace: "if($self.shouldShowUser(arguments[0].referencedMessage.message.author.id)){return $self.hiddenReplyComponent();} $&"
                }
            ]
        },
        //got to work on this, arguments[0] returns a module instead of the actual arguments. i may be stupid ;-;
        /*
        {
            find: "PrivateChannel.renderAvatar",
            replacement: 
            {
                match: /,\[\i,\i,\i\]\);/,
                replace: "$&if($self.shouldShowUser(arguments[0].channel.rawRecipients[0].id)) return null;"
            }
        }
        */
    ]
});
