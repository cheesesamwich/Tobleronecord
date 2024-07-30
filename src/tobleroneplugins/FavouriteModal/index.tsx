import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { ModalCloseButton, ModalContent, ModalHeader, ModalProps, ModalRoot, ModalSize, openModal } from "@utils/modal";
import { Text, UserSettingsActionCreators, useState } from "@webpack/common";
import { classNameFactory, disableStyle, enableStyle } from "@api/Styles";
import style from "./style.css?managed";
import { insertTextIntoChatInputBox } from "@utils/discord";
import { definePluginSettings } from "@api/Settings";

const cl = classNameFactory("vc-favouritemodal-");


const settings = definePluginSettings(
{
    sliceCount: {
        type: OptionType.NUMBER,
        description: "How many gifs to display on one page",
        restartNeeded: false,
        default: 10
    }
});

interface Gif {
    format: any;
    height: number;
    order: number;
    src: string;
    width: number;
    null: boolean;
}

function splitArray<T>(array: T[], chunkSize: number): T[][] {
    const result: T[][] = [];
    
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    
    return result;
}

function ScrollButtons({ page, setPage, pages }) {
    return (
        <>
            {pages.map((_, index) => (
                <div key={index} className={`${cl("scroll")} ${index === page ? cl("scrollcurrent") : ""}`} onClick={() => setPage(index)}>
                    <Text color="header-primary" variant="text-md/normal" tag="h1">
                        {index}
                    </Text>
                </div>
            ))}
        </>
    );
}

function GifModal(props: ModalProps) {
    const initialGifs = Object.values(UserSettingsActionCreators.FrecencyUserSettingsActionCreators.getCurrentValue().favoriteGifs.gifs) as Gif[];
    const [gifs, setGifs] = useState<Gif[]>(initialGifs.filter(gif => !gif.null));

    const gifPages = splitArray(gifs, settings.store.sliceCount);
    const [page, setPage] = useState(0);

    const handleImageError = (src: string) => {
        setGifs(prevGifs => {
            return prevGifs.filter(gif => gif.src !== src);
        });
    };

    return (
        <ModalRoot {...props} size={ModalSize.LARGE}>
            <ModalHeader separator={false}>
                <div className={cl("header")}>
                    <Text color="header-primary" variant="heading-lg/semibold" tag="h1" style={{ flexGrow: 1, textAlign: "center" }}>
                        Gifs
                    </Text>
                    <div className={cl("scrollbuttons")}>
                        <ScrollButtons page={page} setPage={setPage} pages={gifPages} />
                    </div>
                </div>
            </ModalHeader>
            <ModalContent>
                <div className={cl("gifs")}>
                    {gifPages[page].map(e => (
                        <img 
                            onClick={() => 
                            {
                                insertTextIntoChatInputBox(e.src);
                                props.onClose();
                            }}
                            key={e.src} 
                            src={e.src} 
                            onError={() => handleImageError(e.src)} 
                            alt="GIF" 
                        />
                    ))}
                </div>
            </ModalContent>
        </ModalRoot>
    );
}

export default definePlugin({
    name: "FavouriteModal",
    description: "Changes the gif menu to a modal, and reworks several other things in it",
    authors: [
        Devs.Samwich
    ],
    settings,
    start() {
        enableStyle(style);
    },
    stop() {
        disableStyle(style);
    },
    onButtonClick() {
        openModal(props => <GifModal {...props} />); 
    },
    patches: [
        {
            find: ".CHAT_INPUT_BUTTON_NOTIFICATION,",
            replacement: {
                match: /(]:\i}\),onClick:)(\i),/,
                replace: "$1arguments[0][\"aria-label\"] == \"Open GIF picker\" ? $self.onButtonClick : $2,"
            }
        },
        //Messages.EXPRESSION_PICKER_CATEGORIES_A11Y_LABEL,children: [eE ? (0,
        {
            find: "Messages.EXPRESSION_PICKER_CATEGORIES_A11Y_LABEL,c",
            replacement: 
            {
                match: /(A11Y_LABEL,children:\[)\i(\?\(0,)/,
                replace: "$1false$2"
            }
        }
    ]
});
