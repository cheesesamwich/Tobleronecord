/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
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

import { existsSync } from "fs";

/**
 * @param {string} filePath
 * @returns {string | null}
 */



function mapProcessPlatform(platform) 
{
    switch (platform) {
        case 'linux':
            return UserPlatform.linux;
        case 'darwin':
            return UserPlatform.macos;
        case 'win32':
            return UserPlatform.windows;
        default:
            return UserPlatform.web;
    }
}

export function getPluginTarget(path, web) {
    if(path.includes("_")) { return true; }
    if(!existsSync(path))
    {
        return false;
    }
    let plugin = import(path);
    if(!Object.hasOwn(plugin, "platform"))
    {
        return true;
    }
    return plugin.platform(web ? UserPlatform.web : mapProcessPlatform(process.platform));
}
