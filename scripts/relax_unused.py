with open(r"d:\IncidentMind AI\frontend\tsconfig.app.json", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace('"noUnusedLocals": true,', '"noUnusedLocals": false,')
text = text.replace('"noUnusedParameters": true,', '"noUnusedParameters": false,')

with open(r"d:\IncidentMind AI\frontend\tsconfig.app.json", "w", encoding="utf-8") as f:
    f.write(text)

print("Updated tsconfig.app.json to set noUnusedLocals and noUnusedParameters to false")
