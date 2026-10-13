"""Zet de productcatalogus (xlsx) om naar src/data/products.json.

Gebruik: python3 scripts/build-catalog.py pad/naar/productcatalogus.xlsx
Normaliseert categorieën, kleuren en prijzen (zie CLAUDE.md, datahygiëne).
"""
import json, re, sys
import openpyxl

CATS = {  # bron-productsoort (lowercase) -> (slug, groep)
    "goedkope laarzen": ("laarzen", "schoenen"),
    "goedkope sneakers": ("sneakers", "schoenen"),
    "goedkope air sneakers": ("sneakers", "schoenen"),
    "boots festival": ("boots-festival", "schoenen"),
    "goedkope boots": ("laarzen", "schoenen"),
    "goedkope pantoffels /sloffen": ("pantoffels", "schoenen"),
    "goedkope instappers": ("pantoffels", "schoenen"),
    "slippers & sandalen": ("overig-schoenen", "schoenen"),
    "goedkope klompen": ("overig-schoenen", "schoenen"),
    "goedkope kinderschoenen": ("overig-schoenen", "schoenen"),
    "telefoontasjes / schoudertasjes": ("schoudertasjes", "tassen"),
    "middel / grote tassen": ("grote-tassen", "tassen"),
    "sale tassen": ("grote-tassen", "tassen"),
    "portemonnees / pasjeshouders": ("portemonnees", "accessoires"),
    "sierraden": ("sieraden", "accessoires"),
}
SIZE_RE = re.compile(r"^\d{2}(, \d{2})*$")

def infer(title, sizes):
    t = title.lower()
    if re.search(r"portemonnee|pasjes", t): return "portemonnees", "accessoires"
    if re.search(r"ketting|armband|oorbel|sieraad", t): return "sieraden", "accessoires"
    if not sizes:
        return ("schoudertasjes", "tassen") if re.search(r"telefoon|schouder|crossbody", t) else ("grote-tassen", "tassen")
    if re.search(r"laars|laarz|boots|enkellaars", t): return "laarzen", "schoenen"
    if re.search(r"sneaker", t) and not re.search(r"instap", t): return "sneakers", "schoenen"
    if re.search(r"pantoffel|sloffen|instapper|instap slipper", t): return "pantoffels", "schoenen"
    return "overig-schoenen", "schoenen"

def main(path):
    ws = openpyxl.load_workbook(path)["Producten"]
    rows = list(ws.iter_rows(values_only=True))[1:]
    out = []
    for r in rows:
        handle, title, soort, _v, price, was, _sale, stock, colors, sizes, img, _url, added = r
        if not handle or not title or not img or price is None:
            continue
        key = (soort or "").strip().lower()
        cat, group = CATS.get(key, ("sale", None))
        if cat == "sale":  # Sale is een prijsstatus, geen echte categorie: afleiden uit titel
            cat, group = infer(title, sizes)
        # kleuren/maten kunnen in de bron verwisseld zijn
        if colors and SIZE_RE.match(colors.strip()):
            sizes = sizes or colors
            colors = None
        cols = sorted({c.strip().capitalize() for c in (colors or "").split(",") if c.strip()})
        szs = [s.strip() for s in (sizes or "").split(",") if s.strip()]
        was = float(was) if was else None
        price = float(price)
        out.append({
            "h": handle, "t": title.strip(), "c": cat, "g": group,
            "p": price, "w": was if was and was > price else None,
            "s": stock == "Ja", "k": cols, "m": szs,
            "i": img, "a": (added or "")[:10],
        })
    json.dump(out, open("src/data/products.json", "w"), ensure_ascii=False, separators=(",", ":"))
    print(len(out), "producten")

main(sys.argv[1])
