
import { addPreSendListener, removePreSendListener } from "@api/MessageEvents";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { Alerts, Forms } from "@webpack/common";

function warning() {
    return new Promise<boolean>(resolve => {
        Alerts.show({
            title: "Hold on!",
            body:
            <Forms.FormText>
                Are you sure you want to send a message?
            </Forms.FormText>,
            confirmText: "Send",
            cancelText: "Cancel",
            onConfirm: () => resolve(true),
            onCloseCallback: () => resolve(false),
        });
    });
}

async function presendObject ()
{
    return (
        {
            cancel: await warning()
        }
    )
};

export default definePlugin({
    name: "MessageConfirm",
    description: "Sends a confirmation prompt before you send a message",
    authors: [ Devs.Samwich ],
    dependencies: ["MessageEventsAPI"],
    start()
    {
        addPreSendListener(presendObject);
    },
    stop()
    {
        removePreSendListener(presendObject);
    }
});