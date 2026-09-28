import glob

def clean_file(path):
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    changed = False
    if '\"' in text or '\"' in text:
        text = text.replace('\"', '"')
        changed = True
    if '\\"' in text:
        text = text.replace('\\"', '"')
        changed = True
    if changed:
        with open(path, "w", encoding="utf-8") as f:
            f.write(text)
        print("Cleaned:", path)

for p in glob.glob(r"d:\IncidentMind AI\frontend\src\**\*.tsx", recursive=True):
    clean_file(p)
print("Finished cleaning .tsx files")
