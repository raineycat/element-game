import json

source = None
with open("PeriodicTableJSON.json", "rb") as f:
    source = json.load(f)

out = []
for el in source["elements"]:
    out.append({
        "name": el["name"],
        "atomic_num": el["number"],
        "symbol": el["symbol"]
    })

with open("../data.json", "w") as f:
    json.dump(out, f)

print("Done!")