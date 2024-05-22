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

/**
 * @param {string} filePath
 * @returns {string | null}
 */

export async function getPluginTarget(filePath, fullFilePrefix) 
{
    console.log(`PLEASE KILL ME (also ${fullFilePrefix})`)
    if(fullFilePrefix.includes("_")) return true;
    console.log(fullFilePrefix);
    console.log(filePath);

    console.log(`/${fullFilePrefix}`);
    let plugin = await import(`../src/${fullFilePrefix}/index.tsx`);
    if(plugin.hasOwnProperty("platform"))
    {
        return plugin.platform(mapProcessPlatform());
    }
    else
    {
        console.log("Plugin does not have platform object, returning true");
    }
}

function mapProcessPlatform() 
{
    let platform = process.platform;
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