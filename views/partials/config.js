// Query selectors.
const $ = (query, parent) => (parent || document).getElementById(query);
const $$ = (query, parent) => (parent || document).querySelectorAll(query);
const copy = (text) => window.navigator.clipboard.writeText(text);

window.onload = () => {
    let hash = window.location.hash.split("#")?.[1];
    if (hash) $(hash).scrollIntoView({ behavior: "smooth" });
}

const support = `https://services.elara.workers.dev/support`;
const defFooter = {
    text: `By: @${data.client.tag}`,
    icon_url: data.client.icon
};
function createEmbed({
    author, title, description, color, timestamp, footer, url, image, thumbnail, fields
} = {}) {
    if (!footer) {
        footer = {};
    }
    if (!author) {
        author = {};
    }
    const s = [];
    if (author) {
        if (author.name?.length) {
            s.push(`author-name="${author.name}"`);
        }
        const exists = imageExists(author.icon_url || author.iconURL);
        if (exists?.length) {
            s.push(`author-image="${exists}"`);
        }
        if (author.url?.length) {
            s.push(`author-url="${author.url}"`);
        }
    }
    if (color) {
        s.push(`color="${color}"`);
    }
    if (url?.length) {
        s.push(`url="${url}"`);
    }
    if (thumbnail?.length) {
        s.push(`thumbnail="${imageExists(thumbnail)}"`);
    }
    if (image?.length) {
        s.push(`image="${imageExists(image)}"`);
    }

    if (title?.length) {
        s.push(`embed-title="${title}"`);
    }
    const str = [
        `<discord-embeds slot="embeds">`,
        `<discord-embed slot="embed"${s.length ? ` ${s.join(" ")}` : ""}>`,
    ];
    if (description?.length) {
        str.push(`<discord-embed-description slot="description">${description}</discord-embed-description>`);
    }
    if (fields?.length) {
        let field = [`<discord-embed-fields slot="fields">`];
        for (const f of fields) {
            field.push(`<discord-embed-field field-title="${f.name}" ${f.inline ? `inline` : ""}>${f.value}</discord-embed-field>`);
        }
        str.push(...field, `</discord-embed-fields>`);
    }
    if (footer || timestamp) {
        const foot = [
            `<discord-embed-footer slot="footer"${timestamp ? ` timestamp="${timestamp}"` : ""}${(footer.icon_url || footer.iconURL) ? ` footer-image="${imageExists(footer.icon_url || footer.iconURL)}"` : ""}>`
        ];
        if (footer.text) {
            foot.push(footer.text);
        }
        str.push(...foot, "</discord-embed-footer>")
    }
    return [...str, "</discord-embed></discord-embeds>"].join("");
}
$("bot-icon").href = data.client.icon;
$("bot-img").src = data.client.icon;
$("main_title").innerText = `${data.client.name} - Settings`;
if (data.client.name.length > 5) {
    $("bot-name").style = "font-size: 25px;";
    $("bot-name").innerText = data.client.name;
} else {
    $("bot-name").innerText = data.client.name;
}

// Nav element functionality.
$$("nav a div").forEach(element => {
    element.onclick = () => {
        $$("nav a div").forEach(element => element.classList.remove("active"));
        element.classList.add("active");
        if (element.href) $(element.href.split("#")[1]).scrollIntoView({ behavior: "smooth" });
    }
});

$('content').onscroll = () => {
    var current = "starboard";

    $$("#content > div.title").forEach((section) => {
        if ($('content').scrollTop + 100 >= section.offsetTop) {
            current = section.getAttribute("id");
        }
    });

    $$("nav a").forEach((li) => {
        li.querySelector('div').classList.remove("active");
        if (li.href.split("#")[1] === current) {
            li.querySelector('div').classList.add("active");
        }
    });
};

function getUnicodeEmoji(emoji) {
    if (!emoji) return void 0;
    const r = [];
    let [c, p, i] = [0, 0, 0];

    while (i < emoji.length) {
        c = emoji.charCodeAt(i++);
        if (p) {
            r.push(
                (0x10000 + ((p - 0xd800) << 10) + (c - 0xdc00)).toString(16),
            );
            p = 0;
        } else if (c >= 0xd800 && c <= 0xdbff) {
            p = c;
        } else {
            r.push(c.toString(16));
        }
    }
    return r.join("-");
}

function imageExists(url, showFallbackUrlOnEmpty) {
    const fallback = 'https://cdn.discordapp.com/emojis/847624594717671476.png';
    try {
        if (!url) {
            if (showFallbackUrlOnEmpty) {
                return fallback;
            }
            return "";
        }
        const http = new XMLHttpRequest();
        http.open("HEAD", url);
        http.send();
        return http.status !== 404 ? url : fallback;
    } catch {
        return fallback;
    }
}

function readable(param) {
    const ones = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teen = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const bigs = ['thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion'];
    const $ = ('' + Math.floor(Math.abs(param))).split('').map(i => +i).reverse().reduce((r, e, i) => (i % 3 ? r[r.length - 1].push(e) : r.push([e])) && r, []).reverse().map(set => +set.reverse().join(''));
    for (let [i, j] = [$.length - 1, 0]; i >= 0; i--, j++) {
        const hundred = j === 0 && ('' + param).length > 3 && $[i] < 100
        if ($[i] < 10) $[i] = ones[$[i] - 1];
        else if ($[i] < 20) $[i] = teen[$[i] - 10];
        else if ($[i] < 100) $[i] = tens[Math.floor($[i] / 10) - 2] + ($[i] % 10 !== 0 ? ' ' + readable($[i] % 10) : '');
        else $[i] = ones[Math.floor($[i] / 100) - 1] + ` hundred${$[i] % 100 !== 0 ? ' and' : ''}` + ($[i] % 100 !== 0 ? ' ' + readable($[i] % 100) : '');
        $[i] = hundred ? `and ${$[i]}` : j ? `${$[i]} ${bigs[j - 1]}` : $[i];
    }
    return `${param < 0 ? 'negative ' : ''}${$.filter(set => set && !Array.isArray(set.match(/(and\s)?undefined/g))).join(' ').trim()}`
}

function timify(param, short) {
    let sec = +(param / 1000).toFixed(0);
    let min = Math.floor(sec / 60);
    let hrs = min > 59 ? Math.floor(min / 60) : 0;
    min -= hrs * 60;
    sec = Math.floor(sec % 60);
    const result = [];
    hrs ? result.push(`${hrs.toLocaleString()} ${short ? 'hr' : 'hour'}${hrs === 1 ? '' : 's'}`) : void 0;
    min ? result.push(`${min} ${short ? 'min' : 'minute'}${min === 1 ? '' : 's'}`) : void 0;
    sec ? result.push(`${(min || hrs) ? 'and ' : ''} ${sec} ${short ? 'sec' : 'second'}${sec === 1 ? '' : 's'}`.trim()) : void 0;
    return short ? (result[0] ?? '0 secs') : (result.length ? result.join(' ') : '0 seconds');
};

function mention(hex, result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)) {
    return result ? `rgba(${result.map(i => parseInt(i, 16)).slice(1).join(',')}, 0.3)` : void 0;
}

function NONE(title, text, color = "red") {
    return `<div class="channel"><h4>${title}</h4><h2 style="color:${color};">${text}</div></h2>`;
}

function Channel({ name, id, title = "channel" }, showNotSet = true) {
    if (showNotSet && !id && name === "None") {
        return `<div class="channel"><h4>${title}</h4><h2 style="color:red;">Not Set</div></h2>`;
    }
    return `<div class="channel"><h4>${title}<div class="copych" title="Copy Channel Name" onclick="copy('#${name}')"></div><div class="copyid" title="Copy Channel ID" onclick="copy('${id}')"></div></h4><h2 class="channel">${name}</h2><h4 class="id">ID: ${id}</h4></div>`;
}

// Populate data.
const fixer = '<div class="fixer"><h4><div></div></h4><h2 class="channel"></h2><h4></h4></div>';

// Guild Infomation.
$("fulfillGuildIcon").src = data.guild.icon;
$("fulfillGuildName").innerText = data.guild.name;
$("fulfillGuildId").innerText = data.guild.id;

// Starboard Information.
$("fulfillStarboardStatus").classList.add(data.starboard.enabled ? "y" : "n");
if (!data.starboard.enabled) {
    $("wrapperStarboardCount").style.display = 'none';
    $("wrapperStarboardChannel").style.display = 'none';
    $("wrapperStarboardEmoji").style.display = 'none';
    $("fulfillStarboardIgnoredChannels").style.display = 'none';
    $("fulfillStarboardIgnoredChannelsList").style.display = 'none';
    $("fulfillStarboardIgnoredRoles").style.display = 'none';
    $("fulfillStarboardIgnoredRolesList").style.display = 'none';
    $("fulfillStarboardIgnoredUsers").style.display = 'none';
    $("fulfillStarboardIgnoredUsersList").style.display = 'none';
} else {
    $("fulfillStarboardCount").innerText = data.starboard.count ?? 'N/A';

    // Starboard Channel Information.
    $("fulfillStarboardChannel").innerText = data.starboard.channel.name ?? 'N/A';
    $("fulfillStarboardChannelCopy").onclick = () => copy(`#${data.starboard.channel.name}` ?? void 0);
    $("fulfillStarboardChannelId").innerText = `ID: ${data.starboard.channel.id ?? 'N/A'}`;
    $("fulfillStarboardChannelIdCopy").onclick = () => copy(data.starboard.channel.id ?? void 0);

    // Starboard Emoji Information.
    $("fulfillStarboardEmoji").style.background = [`url("`,
        data.starboard.emoji.id ?
            `https://cdn.discordapp.com/emojis/${data.starboard.emoji.id}.${data.starboard.emoji.animated ? "gif" : "png"}` :
            `https://cdn.jsdelivr.net/gh/twitter/twemoji@v12.1.4/assets/72x72/${getUnicodeEmoji(data.starboard.emoji.name)}.png`,
        `") no-repeat center center`].join('');

    $("fulfillStarboardEmojiCopy").onclick = () => copy(data.starboard.emoji.id ?
        (`<${data.starboard.emoji.animated ? "a" : ""}:${data.starboard.emoji.name}:${data.starboard.emoji.id}>`) :
        data.starboard.emoji.name);

    $("fulfillStarboardEmojiIdCopy").onclick = () => copy(data.starboard.emoji.id);
    $("fulfillStarboardEmojiNameCopy").onclick = () => copy(data.starboard.emoji.name);
    $("fulfillStarboardEmojiInfo").innerHTML = [
        `ID: ${data.starboard.emoji.id ?? "N/A"}`,
        `Name: ${data.starboard.emoji.name}`,
        `Animated: ${data.starboard.emoji.animated ? "Yes" : "No"}`
    ].join("<br>");

    // Starboard Ignored Channels Information.
    $("fulfillStarboardIgnoredChannels").style.display = data.starboard.ignore.channels.length ? "flex" : "none";
    $("fulfillStarboardIgnoredChannelsList").style.display = data.starboard.ignore.channels.length ? "flex" : "none";
    data.starboard.ignore.channels.forEach(c => $("fulfillStarboardIgnoredChannelsList").innerHTML += [
        `<div class="channel">`,
        `<h4>channel<div class="copych" title="Copy Channel Name" onclick="copy('#${c.name}')"></div><div class="copyid" title="Copy Channel ID" onclick="copy('${c.id}')"></div></h4>`,
        `<h2 class="channel">${c.name}</h2><h4 class="id">ID: ${c.id}</h4></div>`
    ].join(''));
    if (data.starboard.ignore.channels.length % 4 === 1) $("fulfillStarboardIgnoredChannelsList").innerHTML += fixer;

    // Starboard Ignored Roles Information.
    $("fulfillStarboardIgnoredRoles").style.display = data.starboard.ignore.roles.length ? "flex" : "none";
    $("fulfillStarboardIgnoredRolesList").style.display = data.starboard.ignore.roles.length ? "flex" : "none";
    data.starboard.ignore.roles.forEach(r => $("fulfillStarboardIgnoredRolesList").innerHTML += [
        `<div class="role">`,
        `<h4>role<div class="copyro" title="Copy Role Name" onclick="copy('@${r.name}')"></div><div class="copyid" title="Copy Role ID" onclick="copy('${r.id}')"></div></h4>`,
        `<h2 class="role" style="color: ${r.color}; background: ${mention(r.color)}">${r.name}</h2><h4 class="id">ID: ${r.id}</h4></div>`
    ].join(''));
    if (data.starboard.ignore.roles.length % 4 === 1) $("fulfillStarboardIgnoredRolesList").innerHTML += fixer;

    // Starboard Ignored Users Information.
    $("fulfillStarboardIgnoredUsers").style.display = data.starboard.ignore.users.length ? "flex" : "none";
    $("fulfillStarboardIgnoredUsersList").style.display = data.starboard.ignore.users.length ? "flex" : "none";
    data.starboard.ignore.users.forEach(u => $("fulfillStarboardIgnoredUsersList").innerHTML += [
        `<div class="user">`,
        `<h4>user<div class="copyus" title="Copy User Name" onclick="copy('@${u.name}')"></div><div class="copyid" title="Copy User ID" onclick="copy('${u.id}')"></div></h4>`,
        `<h2 class="user" style="color: ${u.color}; background: ${mention(u.color)}">${u.name}</h2><h4 class="id">ID: ${u.id}</h4></div>`
    ].join(''));
    if (data.starboard.ignore.users.length % 4 === 1) $("fulfillStarboardIgnoredUsersList").innerHTML += fixer;
}

// Events information.
let result = [];
for (const evt of data.events) {
    result.push(`<div class="subtitle"><hr /><h2>${evt.name.replace(/[A-Z]/g, (i) => ` ${i}`)} event</h2><hr /></div>`);
    result.push(`<div class="subcontent">`);
    result.push(`<div><h4>is enabled?</h4><div class="${evt.disabled ? 'n' : 'y'}"><div></div></div></div>`);
    result.push([
        `<div class="channel">`,
        `<h4>channel<div class="copych" title="Copy Channel Name" onclick="copy(#${evt.channel.name})"></div>`,
        `<div class="copyid" title="Copy Channel ID" onclick="copy(${evt.channel.id})"></div></h4>`,
        `<h2 class="channel">${evt.channel.name}</h2><h4 class="id">ID: ${evt.channel.id}</h4></div>`
    ].join(''))
    result.push(`<div><h4>color</h4><h2>${evt.color ?? "N/A"}</h2></div></div>`);
}
$("events").insertAdjacentHTML("afterend", result.join(''));

result = [];
for (const toggle of Object.keys(data.toggles)) {
    if (toggle !== 'logs') result.push(`<div><h4>${toggle} logs</h4><div class="${data.toggles[toggle] ? 'y' : 'n'}"><div></div></div></div>`);
    else {
        result.push(`<div><h4>mention logs</h4><div class="${data.toggles.logs.mention ? 'y' : 'n'}"><div></div></div></div>`);
        result.push(`<div><h4>name logs</h4><div class="${data.toggles.logs.name ? 'y' : 'n'}"><div></div></div></div>`);
    }
}

// Guild Information.
$("fulfillTogglesContent").innerHTML = result.join('');
$("fulfillGuildContentName").innerText = data.guild.name;
$("fulfillGuildContentId").innerText = data.guild.id;

const guildLogChannels = [];
const guildLogIgnoreChannels = [];
for (const set of Object.keys(data.channels)) {
    if (set === "ignore") {
        let counter = 1;
        for (const channel of data.channels[set]) {
            guildLogChannels.push(Channel({ ...channel, title: `channel ${readable(counter)}` }));
        }
        counter++;
    } else if (!data.channels[set].name) {
        for (const key of Object.keys(data.channels[set])) {
            guildLogChannels.push(Channel({ ...data.channels[set][key], title: `${set} ${key} logs` }));
        }
    } else {
        guildLogChannels.push(Channel({ ...data.channels[set], title: `${set} logs` }));
    }
}
if (guildLogIgnoreChannels.length) {
    $("fulfillLogIgnoredChannels").innerHTML = guildLogIgnoreChannels.join('');
} else {
    $("fulfillLogIgnoredChannelss").style.display = "none";
}
$("fulfillLogChannels").innerHTML = guildLogChannels.join('');

// Joins & Leaves Information.
$("fulfillJoinChannel").innerText = data.welcome?.channel.name;
$("fulfillJoinChannelCopy").onclick = () => copy(`#${data.welcome?.channel.name}`);
$("fulfillJoinChannelId").innerText = `ID: ${data.welcome?.channel.id}`;
$("fulfillJoinChannelIdCopy").onclick = () => copy(data.welcome?.channel.id);

const welcomeRoles = []
let welcomeCount = 1;
if (data.welcome.roles.bots.length) {
    data.welcome?.roles.bots.forEach(r => {
        welcomeRoles.push([
            `<div class="role">`,
            `<h4>bot role ${readable(welcomeCount)}<div class="copyro" title="Copy Role Name" onclick="copy('@${r.name}')"></div><div class="copyid" title="Copy Role ID" onclick="copy('${r.id}')"></div></h4>`,
            `<h2 class="role" style="color: ${r.color}; background: ${mention(r.color)}">${r.name}</h2><h4 class="id">ID: ${r.id}</h4></div>`
        ].join(''))
        welcomeCount++;
    });
}

welcomeCount = 1;
if (data.welcome.roles.humans.length) {
    data.welcome?.roles.humans.forEach(r => {
        welcomeRoles.push([
            `<div class="role">`,
            `<h4>user role ${readable(welcomeCount)}<div class="copyro" title="Copy Role Name" onclick="copy('@${r.name}')"></div><div class="copyid" title="Copy Role ID" onclick="copy('${r.id}')"></div></h4>`,
            `<h2 class="role" style="color: ${r.color}; background: ${mention(r.color)}">${r.name}</h2><h4 class="id">ID: ${r.id}</h4></div>`
        ].join(''))
        welcomeCount++;
    });
}

$('wrapperJoinEmbed').insertAdjacentHTML("afterend", welcomeRoles.join(''));

$("fulfillJoinEmbedAfter").insertAdjacentHTML("afterend", createEmbed({
    image: data.leaves?.image,
    author: {
        name: "Example User#0000",
        icon_url: "https://cdn.discordapp.com/emojis/860931214232125450.png",
        url: support
    },
    description: data.welcome?.message || `Welcome to the ${data.guild?.name}!\n**Example User**`,
    timestamp: new Date(),
    color: "#00ff11",
    footer: defFooter
}))

$("fulfillLeaveChannel").innerText = data.leaves?.channel.name;
$("fulfillLeaveChannelCopy").onclick = () => copy(`#${data.leaves?.channel.name}`);
$("fulfillLeaveChannelId").innerText = `ID: ${data.leaves?.channel.id}`;
$("fulfillLeaveChannelIdCopy").onclick = () => copy(data.leaves?.channel.id);
$("fulfillLeaveEmbedAfter").insertAdjacentHTML("afterend", createEmbed({
    image: data.leaves?.image,
    author: {
        name: "Example User#0000",
        icon_url: "https://cdn.discordapp.com/emojis/860931214232125450.png",
        url: support
    },
    description: data.leaves?.message || `Goodbye **Example User**, ${data.guild.name} will miss you! 🙁`,
    timestamp: new Date(),
    color: "#FF0000",
    footer: defFooter
}))

// Other Information.
$("fulfillOtherDays").innerText = `${data.misc?.days} day${data.misc?.days === 1 ? 'y' : 's'}`;
$("fulfillOtherSuggestions").innerText = `${data.misc?.suggestions} suggestion${data.misc?.suggestions === 1 ? '' : 's'}`;
if (data.misc.webhook?.username) {
    $("fulfillOtherMessageAfter").insertAdjacentHTML("afterend", `<discord-messages><discord-message bot="true" avatar="${imageExists(data.misc.webhook?.avatar_url, true)}" author="${data.misc.webhook.username}">Hello There!</discord-message></discord-messages>`);
} else {
    $('wrapperOtherWebhook').style.display = 'none';
}

// Sticky Messages Information.
if (data.stickyMessages.length) {
    const result = [];
    let i = 1;

    for (const set of data.stickyMessages) {
        let counter = 0;
        result.push(`<div class="subtitle"><hr /><h2>case ${readable(i)}</h2><hr /></div>`);
        result.push(`<div class="subcontent">`);
        result.push(`<div><h4>is enabled?</h4><div class="${set.enabled ? 'y' : 'n'}"><div></div></div></div>`);
        counter++;
        result.push([
            `<div class="channel"><h4>channel<div class="copych" title="Copy Channel Name" onclick="copy('${set.channel.name}')"></div>`,
            `<div class="copyid" title="Copy Channel ID" onclick="copy('${set.channel.id}')"></div></h4>`,
            `<h2 class="channel">${set.channel.name}</h2><h4 class="id">ID: ${set.channel.id}</h4></div>`
        ].join(''))
        counter++;

        if (set.message.content) {
            result.push(`<div><h4>message content</h4><discord-messages><discord-message author="Pinned Msg" bot="true" avatar="https://cdn.discordapp.com/emojis/658538493202530336.png">${set.message.content}</discord-message></discord-messages></div>`);
            counter++;
        }

        if (set.message.components.length) {
            let j = 1;
            for (const subcomponent of set.message.components) {
                for (const subsubcomponent of subcomponent.components) {
                    result.push(`<div class="component">`);
                    result.push(`<h4>component ${readable(j)}<div class="copyur" title="Copy URL" onclick="copy('${subsubcomponent.url}')"></div></h4>`);
                    result.push(`<discord-action-row>
                    <discord-button
                      url="${subsubcomponent.url}"
                      emoji-name="${subsubcomponent.emoji.name}"
                      emoji="${subsubcomponent.emoji.id ?
                            `https://cdn.discordapp.com/emojis/${subsubcomponent.emoji.id}.${subsubcomponent.emoji.animated ? "gif" : "png"}` :
                            `https://cdn.jsdelivr.net/gh/twitter/twemoji@v12.1.4/assets/72x72/${getUnicodeEmoji(subsubcomponent.emoji.name)}.png`}"
                      >Link</discord-button></discord-action-row>`)
                    result.push(`<h4 class="url">URL:<a href="${subsubcomponent.url}" target="_blank">${subsubcomponent.url}</a></h4></div>`);
                    j++;
                    counter++;
                }
            }
        }

        if (set.message.embeds.length) {
            let j = 1;
            for (const embed of set.message.embeds) {
                result.push(`<div class="embed">`);
                result.push(`<h4>embed ${readable(j)}<div class="copybd" title="Copy Embed JSON" onclick="copy('${JSON.stringify(embed).replace(/"/g, '&quot;')}')"></div></h4>`);
                result.push(createEmbed({
                    thumbnail: embed.thumbnail?.url,
                    image: embed.image?.url,
                    author: embed.author ? { name: embed.author.name, icon_url: embed.author.icon_url || embed.author.iconURL, url: embed.author.url } : null,
                    title: embed.title,
                    color: embed.color ? `#${embed.color.toString(16)}` : null,
                    url: embed.url,
                    description: embed.description,
                    footer: embed.footer,
                    timestamp: embed.timestamp,
                    fields: embed.fields || []
                }));

                result.push(`</div>`);
                j++;
                counter++;
            }
        }



        if (counter % 4 === 1) result.push(fixer);
        result.push('</div>');
        i++;
    }

    $("sm").insertAdjacentHTML("afterend", result.join(''));
}

// Moderation Information.
$('fulfillModerationMute').innerText = data.messages?.mute;
$('fulfillModerationMuteCopy').onclick = () => copy(data.messages?.mute);
$('fulfillModerationUnmute').innerText = data.messages?.unmute;
$('fulfillModerationUnmuteCopy').onclick = () => copy(data.messages?.unmute);
$('fulfillModerationKick').innerText = data.messages?.kick;
$('fulfillModerationKickCopy').onclick = () => copy(data.messages?.kick);
$('fulfillModerationBan').innerText = data.messages?.ban;
$('fulfillModerationBanCopy').onclick = () => copy(data.messages?.ban);
$('fulfillModerationUnban').innerText = data.messages?.unban;
$('fulfillModerationUnbanCopy').onclick = () => copy(data.messages?.unban);
$('fulfillModerationSoftban').innerText = data.messages?.softban;
$('fulfillModerationSoftbanCopy').onclick = () => copy(data.messages?.softban);

if (data.actions?.length) {
    const result = [];
    let i = 1;
    let counter = 0;
    for (const action of data.actions) {
        result.push(`<div class="subtitle"><hr /><h2>action ${readable(i)}</h2><hr /></div>`);
        result.push(`<div class="subcontent">`);
        result.push(`<div><h4>action name</h4><h2>${action.name}</h2></div>`);
        counter++;
        result.push(`<div><h4>action type</h4><h2>${action.action}</h2></div>`);
        counter++;
        result.push(`<div><h4>warnings needed</h4><h2>${action.warningsNeeded}</h2></div>`);
        counter++;
        if (action.timeout) {
            result.push(`<div><h4>timeout</h4><h2>${timify(parseInt(action.timeout))}</h2></div>`);
            counter++;
        }
        result.push([
            `<div class="role">`,
            `<h4>role<div class="copyro" title="Copy Role Name" onclick="copy('@${action.role.name}')"></div><div class="copyid" title="Copy Role ID" onclick="copy('${action.role.id}')"></div></h4>`,
            `<h2 class="role" style="color: ${action.role.color}; background: ${mention(action.role.color)}">${action.role.name}</h2><h4 class="id">ID: ${action.role.id}</h4></div>`
        ].join(''));
        counter++;
        result.push(`</div>`);
        if (counter % 4 === 1) result.push(fixer);
        i++;
    }
    $("fulfillModerationCSS").insertAdjacentHTML("afterend", result.join(''));
}


$('fulfillGuildContentAppeal').innerHTML = data.messages?.appeal ? `<a style="color: var(--blue);" href="https://discord.gg/${data.messages?.appeal}">${data.messages?.appeal}</a>` : `<a style="color:red;">Not Set</a>`;
$("fulfillBoostAddStatus").classList.add(data.boosts?.add.enabled ? "y" : "n");
$("fulfillBoostAddChannel").innerText = data.boosts?.add.channel.name;
$("fulfillBoostAddChannelCopy").onclick = () => copy(`#${data.boosts?.add.channel.name}`);
$("fulfillBoostAddChannelId").innerText = `ID: ${data.boosts?.add.channel.id}`;
$("fulfillBoostAddChannelIdCopy").onclick = () => copy(data.boosts?.add.channel.id);

const boostEmbed = (boost, add = true) => createEmbed({
    image: boost.image,
    color: add ? "#b28dff" : "#ff8300",
    description: boost.message || add ? `Hey Example User, thanks for the boost!\n> We now have **3** boosts and tier **1**!` : `Oh it looks like Example User#0000 stopped boosting. 😦\n> We now have **1** boosts and tier **0**`,
    timestamp: new Date(),
    title: `Boosting`,
    thumbnail: `https://cdn.discordapp.com/emojis/762159344091267102.gif`,
    author: {
        name: data.client.tag,
        icon_url: data.client.icon,
        url: support,
    }
});

$("fulfillBoostAddEmbedAfter").insertAdjacentHTML("afterend", boostEmbed(data.boosts.add))
$("fulfillBoostRemoveStatus").classList.add(data.boosts?.remove.enabled ? "y" : "n");
$("fulfillBoostRemoveChannel").innerText = data.boosts?.remove.channel.name;
$("fulfillBoostRemoveChannelCopy").onclick = () => copy(`#${data.boosts?.remove.channel.name}`);
$("fulfillBoostRemoveChannelId").innerText = `ID: ${data.boosts?.remove.channel.id}`;
$("fulfillBoostRemoveChannelIdCopy").onclick = () => copy(data.boosts?.remove.channel.id);
$("fulfillBoostRemoveEmbedAfter").insertAdjacentHTML("afterend", boostEmbed(data.boosts.remove, false))

let embedStart = 1100;
$$('.embed').forEach((embed) => {
    embed.style.zIndex = embedStart;
    embedStart--;
});

const ignoredList = [];
let ignoredCounter = 1;

if (data.ignore?.commands.length) {
    ignoredList.push(`<div class="subtitle"><hr /><h2>commands disabled for all</h2><hr /></div>`);
    ignoredList.push(`<div class="subcontent">`);
    for (const command of data.ignore.commands) {
        ignoredList.push([
            `<div class="role">`,
            `<h4>role ${readable(ignoredCounter)}<div class="copyro" title="Copy Role Name" onclick="copy('@${command.name}')"></div><div class="copyid" title="Copy Role ID" onclick="copy('${command.id}')"></div></h4>`,
            `<h2 class="role" style="color: ${command.color}; background: ${mention(command.color)}">${command.name}</h2><h4 class="id">ID: ${command.id}</h4></div>`
        ].join(''));
        ignoredCounter++;
    }
    ignoredList.push(`</div>`);
}

if (data.ignore?.logs.all.length) {
    ignoredList.push(`<div class="subtitle"><hr /><h2>logs disabled for all</h2><hr /></div>`);
    ignoredCounter = 1;
    ignoredList.push(`<div class="subcontent">`);
    for (const log of data.ignore.logs.all) {
        if (log.name === "None") {
            continue;
        }
        ignoredList.push([
            `<div class="role">`,
            `<h4>log ${readable(ignoredCounter)}<div class="copyro" title="Copy Role Name" onclick="copy('${log.name}')"></div><div class="copyid" title="Copy Role ID" onclick="copy('${log.id}')"></div></h4>`,
            `<h2 class="role" style="color: ${log.color}; background: ${mention(log.color)}">${log.name}</h2><h4 class="id">ID: ${log.id}</h4></div>`
        ].join(''));
        ignoredCounter++;
    }
    ignoredList.push(`</div>`);
}

if (data.ignore?.logs.messages.length) {
    ignoredList.push(`<div class="subtitle"><hr /><h2>logs disabled for messages in</h2><hr /></div>`);
    ignoredCounter = 1;
    ignoredList.push(`<div class="subcontent">`);
    for (const log of data.ignore.logs.messages) {
        if (log.name === "None") {
            continue;
        }
        ignoredList.push([
            `<div class="channel">`,
            `<h4>channel ${readable(ignoredCounter)}<div class="copych" title="Copy Channel Name" onclick="copy('#${log.name}')"></div><div class="copyid" title="Copy Channel ID" onclick="copy('${log.id}')"></div></h4>`,
            `<h2 class="channel">${log.name}</h2><h4 class="id">ID: ${log.id}</h4></div>`
        ].join(''));
        ignoredCounter++;
    }
    ignoredList.push(`</div>`);
}

if (data.ignore?.logs.users.length) {
    ignoredList.push(`<div class="subtitle"><hr /><h2>logs disabled for messages by</h2><hr /></div>`);
    ignoredCounter = 1;
    ignoredList.push(`<div class="subcontent">`);
    for (const log of data.ignore.logs.users) {
        if (log.name === "None") {
            continue;
        }
        ignoredList.push([
            `<div class="user">`,
            `<h4>user ${readable(ignoredCounter)}<div class="copyus" title="Copy User Name" onclick="copy('@${log.name}')"></div><div class="copyid" title="Copy User ID" onclick="copy('${log.id}')"></div></h4>`,
            `<h2 class="user" style="color: ${log.color}; background: ${mention(log.color)}">${log.name}</h2><h4 class="id">ID: ${log.id}</h4></div>`
        ].join(''));
        ignoredCounter++;
    }
    ignoredList.push(`</div>`);
}

$("fulfillOtherAfter").insertAdjacentHTML('afterend', ignoredList.join(''));


if (data.suggestions.ignore.command.name !== "None") {
    $("fulfillSuggestRole").innerText = data.suggestions?.ignore.command.name;
    $("fulfillSuggestRole").style.color = data.suggestions?.ignore.command.color;
    $("fulfillSuggestRole").style.background = mention(data.suggestions?.ignore.command.color);
    $("fulfillSuggestRoleCopy").onclick = () => copy(`@${data.suggestions?.ignore.command.name}`);
    $("fulfillSuggestRoleId").innerText = `ID: ${data.suggestions?.ignore.command.id}`;
    $("fulfillSuggestRoleIdCopy").onclick = () => copy(data.suggestions?.ignore.command.id);
} else {
    $("fulfillSuggestAfter").innerHTML = Channel({ name: "None", id: null, title: "ignored role" });
}


const suggestIgnoredList = [];
ignoredCounter = 1;

if (data.suggestions?.ignore.auto.length) {
    suggestIgnoredList.push(`<div class="subtitle"><hr /><h2>suggestions channels</h2><hr /></div>`);
    suggestIgnoredList.push(`<div class="subcontent">`);
    for (const role of data.suggestions.ignore.auto) {
        if (role.name === "None") {
            continue;
        }
        suggestIgnoredList.push([
            `<div class="role">`,
            `<h4>role ${readable(ignoredCounter)}<div class="copyro" title="Copy Role Name" onclick="copy('@${role.name}')"></div><div class="copyid" title="Copy Role ID" onclick="copy('${role.id}')"></div></h4>`,
            `<h2 class="role" style="color: ${role.color}; background: ${mention(role.color)}">${role.name}</h2><h4 class="id">ID: ${role.id}</h4></div>`
        ].join(''));
        ignoredCounter++;
    }
    suggestIgnoredList.push(`</div>`);
}

if (data.suggestions?.channels.length) {
    ignoredCounter = 1;
    for (const channel of data.suggestions.channels) {
        let subCounter = 1;
        suggestIgnoredList.push(`<div class="subtitle"><hr /><h2>suggestion channel ${readable(ignoredCounter)}</h2><hr /></div>`);
        suggestIgnoredList.push(`<div class="subcontent">`);
        suggestIgnoredList.push(`<div><h4>use proxy messages?</h4><div class="${channel.proxy ? 'y' : 'n'}"><div></div></div></div>`);
        suggestIgnoredList.push(`<div><h4>use anonymous user?</h4><div class="${channel.anonymous ? 'y' : 'n'}"><div></div></div></div>`);
        suggestIgnoredList.push(`<div><h4>use threads?</h4><div class="${channel.threads ? 'y' : 'n'}"><div></div></div></div>`);
        suggestIgnoredList.push(Channel({ ...channel.channel, title: "channel" }));
        suggestIgnoredList.push(`<div><h4>tags</h4><h2>${channel.tags.join(", ")}</h2></div>`);

        subCounter = 1;
        for (const emoji of channel.emojis) {
            suggestIgnoredList.push([
                `<div><h4>emoji ${readable(subCounter)}`,
                `<div class="copyem" title="Copy Emoji" onclick="copy('${emoji.id ?
                    (`<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`) :
                    emoji.name}')"></div>`,
                `<div class="copyid" title="Copy Emoji ID" onclick="copy('${emoji.id}')"></div>`,
                `<div class="copyna" title="Copy Emoji Name" onclick="copy('${emoji.name}')"></div></h4>`,
                `<div class="emoji" title="${emoji.name || "None"}" style="background: ${[`url('`,
                    emoji.id ?
                        `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}` :
                        `https://cdn.jsdelivr.net/gh/twitter/twemoji@v12.1.4/assets/72x72/${getUnicodeEmoji(emoji.name)}.png`,
                    `') no-repeat center center`].join('')}"></div>
                <h4 class="id">Name: ${emoji.name || "None"}<br/>ID: ${emoji.id ?? 'N/A'}</h4>
            </div>`
            ].join(''));
            subCounter++;
        }

        for (const log of Object.keys(channel.log)) {
            if (!("name" in channel.log[log])) {
                continue;
            }
            suggestIgnoredList.push(Channel({ ...channel.log[log], title: `${log} Logs` }));
        }

        suggestIgnoredList.push(`</div>`);
        ignoredCounter++;
    }
}
$("fulfillSuggestAfter").insertAdjacentHTML("afterend", suggestIgnoredList.join(''));