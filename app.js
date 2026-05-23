const $ = id => document.getElementById(id), TEXT = {
    zh: ["数据目录", "搜索..."],
    en: ["Data Directory", "Search..."]
};
const {
    data,
    CATA
} = await fetch("./data.json").then(r => r.json());
let isEN = new URLSearchParams(location.search).get("lang") === "en";
const clean = s => s.replace(/^【.*?】/, ""), hl = (t, k) => k ? t.replace(new RegExp(`(${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"), '<span class="hl">$1</span>') : t, txt = v => isEN ? CATA[v] || v : v, name = i => isEN ? i["English-title"] || clean(i.title) : i.title, match = (i, k) => !k || [i.title, i["English-title"], i.cata].some(v => v?.toLowerCase().includes(k.toLowerCase()));
const render = (k = "") => {
    const map = {};
    data.forEach(i => {
        if (!match(i, k))
            return;
        (map[i.cata] ||= []).push(`<div class="item"><a href="https://www.goofish.com/item?id=${i.itemId}" target="_blank">${hl(clean(name(i)), k)}</a></div>`)
    });
    $("app").innerHTML = Object.entries(map).map(([k, v]) => `<div class="card"><div class="card-header">${hl(`${txt(k)} (${v.length})`, k)}</div><div class="grid">${v.join("")}</div></div>`).join("");
    document.querySelectorAll(".card-header").forEach(h => h.onclick = () => h.nextElementSibling.classList.toggle("hide"))
};
const erlin = () => {
    const [t, s] = TEXT[isEN ? "en" : "zh"];
    $("title").innerText = t;
    $("search").placeholder = s;
    $("langBtn").innerText = isEN ? "中文" : "EN"
};
$("search").oninput = e => render(e.target.value.trim());
$("langBtn").onclick = () => {
    isEN = !isEN;
    const u = new URL(location);
    u.searchParams.set("lang", isEN ? "en" : "zh");
    history.replaceState(null, "", u);
    erlin();
    render($("search").value)
};
erlin();
render();
