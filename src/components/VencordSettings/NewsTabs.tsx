/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
import { Button, Card, Forms, React, Select, Switch } from "@webpack/common";
import { SettingsTab, wrapTab } from "./shared";
import { findComponentByCodeLazy } from "@webpack";
import { useState } from "@webpack/common";
import { useAwaiter } from "@utils/react";

const PerkDiscoverabilityCard = findComponentByCodeLazy<SpecialShopPerks>(".CARD_CAROUSEL_THIRD_ROW", "onCtaClick");

interface SpecialShopPerks 
{
    description?: string;
    descriptionCta?: string;
    forceShadow?: boolean;
    name?: string;
    onCtaClick?: () => void;
    perkImage?: string;
    subtitle?: string;
    title?: string;
}
  
const news : SpecialShopPerks[] = 
[
    {
      title: "There is news here now. ",
      perkImage: "https://i.pinimg.com/564x/ee/44/50/ee44504e91fef175f47b0c26b0fdeba7.jpg",
      subtitle: "Will i use it? Nope"
    },
    {
        title: "Go use server pruner",
        perkImage: "https://i.pinimg.com/736x/fc/bf/57/fcbf5787b306751368df85553598e16a.jpg",
        subtitle: "Good plugin"
    }
].reverse();

function NewsTab() {
    return (
        <SettingsTab title="News">
            <div className="vc-toblerone-news">
                {news.map(e => (
                    <PerkDiscoverabilityCard 
                        {...(e as object)}
                    />
                ))}
            </div>
        </SettingsTab>
    );
    
}

export default wrapTab(NewsTab, "News");
