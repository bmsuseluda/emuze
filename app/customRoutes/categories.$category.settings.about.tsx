import {ListActionBarLayout} from "../components/layouts/ListActionBarLayout/index.js";
import {IconChildrenWrapper} from "../components/IconChildrenWrapper/index.js";
import {SettingsIcon} from "../components/SettingsIcon/index.js";
import {FaDiscord, FaGithub} from "react-icons/fa";
import {CgNotes} from "react-icons/cg";
import {Typography} from "../components/Typography/index.js";
import {styled} from "../../styled-system/jsx/index.js";
import {Logo} from "../components/Logo/index.js";
import {Link} from "../components/Link/index.js";
import {useInputBack, useInputConfirmation,} from "../hooks/useDirectionalInput/index.js";
import type {ElementRef} from "react";
import {useCallback} from "react";
import {useFocus} from "../hooks/useFocus/index.js";
import type {FocusElement} from "../types/focusElement.js";
import type {Result} from "../hooks/useGamepadsOnGrid/index.js";
import {useGamepadsOnGrid} from "../hooks/useGamepadsOnGrid/index.js";
import { getVersion} from '../server/packagejson.server.js';
import type {IconType} from "react-icons";
import {useLoaderData} from "react-router";

export const loader = () => {
    return {version: getVersion()};
};

export const ErrorBoundary = ({error}: { error: Error }) => {
    console.error(error);
    return (
        <>
            <h2>Error!</h2>
            <p>{error.message}</p>
        </>
    );
};

export const Wrapper = styled("div", {
    base: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "start",
        flexWrap: "wrap",
        gap: "1",
    },
});

export const List = styled("div", {
    base: {
        width: "50%",
        minWidth: "fit-content",
        display: "flex",
        flexDirection: "column",
        gap: "2",
    },
});

export const Properties = styled("div", {
    base: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        rowGap: "0.2rem",
        columnGap: "1rem",
    },
});

interface Link {
    to: string;
    href: string;
    icon: IconType;
}

const linkConfig: Link[] = [
    {href: "https://github.com/bmsuseluda/emuze", to: "GitHub", icon: FaGithub},
    {
        href: "https://github.com/bmsuseluda/emuze/releases",
        to: "Changelog",
        icon: CgNotes,
    },
    {href: "https://discord.gg/tCzK7kc6Y4", to: "Discord", icon: FaDiscord},
];

export const Links = styled("ul", {
    base: {
        display: "flex",
        flexDirection: "column",
        gap: "1",
    },
});

const focus: FocusElement = "settingsMain";

export default function About() {
    const {version} = useLoaderData<typeof loader>();
    const {isInFocus, switchFocusBack} = useFocus<FocusElement>(focus);

    const selectEntry = useCallback((entry: ElementRef<"a">) => {
        entry.focus();
    }, []);

    const goBack = useCallback(
        (resetSelected: () => void) => {
            resetSelected();
            switchFocusBack();
        },
        [switchFocusBack],
    );

    const onLeftOverTheEdge = useCallback(
        ({resetSelected}: Result<ElementRef<"a">>) => {
            goBack(resetSelected);
        },
        [goBack],
    );

    const {entryListRef, entriesRefCallback, selectedEntry, resetSelected} =
        useGamepadsOnGrid({
            onSelectEntry: selectEntry,
            isInFocus,
            onLeftOverTheEdge,
        });

    const onConfirmation = useCallback(() => {
        if (isInFocus) {
            selectedEntry.current?.click();
        }
    }, [isInFocus, selectedEntry]);

    const onBack = useCallback(() => {
        if (isInFocus) {
            goBack(resetSelected);
        }
    }, [isInFocus, resetSelected, goBack]);

    useInputConfirmation(onConfirmation);
    useInputBack(onBack);

    return (
        <>
            <ListActionBarLayout
                headline={
                    <IconChildrenWrapper>
                        <SettingsIcon id="about"/>
                        <Typography ellipsis>About</Typography>
                    </IconChildrenWrapper>
                }
            >
                <ListActionBarLayout.ListActionBarContainer
                    list={
                        <Wrapper>
                            <List>
                                <Properties>
                                    <p>Version:</p>
                                    <p>{version}</p>

                                    <p>Copyright: </p>
                                    <p>2022 - {new Date().getFullYear()}</p>

                                    <p>Author:</p>
                                    <p>bmsuseluda</p>

                                    <p>Licence:</p>
                                    <p>GPL-3.0</p>
                                </Properties>
                                <Links ref={entryListRef}>
                                    {linkConfig.map(({href, to, icon}, index) => (
                                        <li key={to}>
                                            <Link
                                                href={href}
                                                icon={icon}
                                                ref={entriesRefCallback(index)}
                                            >
                                                {to}
                                            </Link>
                                        </li>
                                    ))}
                                </Links>
                            </List>
                            <Logo/>
                        </Wrapper>
                    }
                />
            </ListActionBarLayout>
        </>
    );
}
