const express = require("express"),
    fetch = require("@elara-services/fetch"),
    app = express(),
    { urlencoded, json } = require("body-parser"),
    port = 4000;

app
    .set('port', port)
    .set("views", require('path').join(__dirname, "views"))
    .set("view engine", "ejs")
    .use(json({ limit: "100mb", extended: true }))
    .use(urlencoded({ limit: "100mb", extended: true }))

app.get("/", async (req, res) => {
    let url = req.query?.url ?? "";
    if (typeof url !== "string" || !url?.match?.(/https?:\/\/cdn.discordapp.com\/attachments\//gi)) return res.json({
        status: false,
        message: `Invalid attachment url`
    });
    let r = await fetch(url).send();
    let text = r.text?.() ?? "";
    if (r.statusCode !== 200 || !text) return res.json({
        status: false,
        message: `No response from the request.`
    });
    return res
        .type("text/html")
        .render("index", { messages: text })
})

app.post("/discord", async (req, res) => {
    const { content } = req.body;
    if (!content) return res.json({
        status: false,
        message: `There was nothing to show?`
    });
    return res
        .type("text/html")
        .render("index", { messages: content });
})
async function fetchBin(id) {
    if (!process.env.DB_APIKEY) {
        return null;
    }
    const res = await fetch(`http://api.superchiefyt.xyz:5050/servers/b/v/${id}?key=${process.env.DB_APIKEY}`).send().catch((e) => e);
    if (res instanceof Error || res.statusCode !== 200) {
        return null;
    }
    const json2 = await res.json();
    if (!json2.status) {
        return null;
    }
    return json2.data;
}
app.post("/settings", async (req, res) => {
    const { data } = req.body;
    if (!data) {
        return res.json({
            status: false,
            message: `You failed to provide the data.`
        })
    }
    return res
        .type("text/html")
        .render("settings", { data, newData: JSON.parse(data) });
});


app.post("/settings/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.json({
            status: false,
            message: `You failed to provide the id.`
        })
    }
    const r = await fetchBin(id);
    if (!r) {
        return res.json({ status: false, message: `Unable to fetch the data.` });
    }
    let data = {};
    try {
        data = JSON.parse(JSON.stringify(r.content));
    } catch { }
    if (!Object.keys(data).length) {
        return res.json({ status: false, message: `Unable to fetch the data from the paste.` });
    }
    return res
        .type("text/html")
        .render("settings", { data, newData: JSON.parse(data) });
});

app.post("/bin", async (req, res) => {
    const { content } = req.body;
    if (!content) return res.json({
        status: false,
        message: `There was nothing to show?`
    });
    req.body.id = req.body.key;
    req.body.lang = "js";
    return res
        .type("text/html")
        .render(`bin${req.query.raw === "true" ? "-raw" : ""}`, req.body);
})

app.listen(port, () => console.log(`[WEBSITE]: LOADED`));