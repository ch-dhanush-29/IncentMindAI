def patch(filepath, replacements):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Patched:", filepath)

patch(r"d:\IncidentMind AI\frontend\src\services\api.ts", [
    ("import { Incident, InvestigationResult } from '../types/incident';", "import type { Incident, InvestigationResult } from '../types/incident';")
])

patch(r"d:\IncidentMind AI\frontend\src\App.tsx", [
    ("import React, { useState } from 'react';", "import { useState } from 'react';")
])

patch(r"d:\IncidentMind AI\frontend\src\pages\IncidentList.tsx", [
    ("import { Incident } from '../types/incident';", "import type { Incident } from '../types/incident';"),
    ("import React, { useEffect, useState } from 'react';", "import { useEffect, useState } from 'react';")
])

patch(r"d:\IncidentMind AI\frontend\src\pages\InvestigationWorkspace.tsx", [
    ("import { Incident, InvestigationResult } from '../types/incident';", "import type { Incident, InvestigationResult } from '../types/incident';"),
    ("import React, { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';")
])

patch(r"d:\IncidentMind AI\frontend\src\pages\Postmortem.tsx", [
    ("import { Incident } from '../types/incident';", "import type { Incident } from '../types/incident';"),
    ("import React, { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';"),
    ("const [incident, setIncident] = useState<Incident | null>(null);", "const [, setIncident] = useState<Incident | null>(null);")
])

patch(r"d:\IncidentMind AI\frontend\src\pages\SettingsPage.tsx", [
    ("import React, { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';"),
    ("const [health, setHealth] = useState<any>(null);", "const [, setHealth] = useState<any>(null);"),
    ("const [loading, setLoading] = useState(true);", "const [, setLoading] = useState(true);")
])

patch(r"d:\IncidentMind AI\frontend\src\pages\Dashboard.tsx", [
    ("import React, { useEffect, useState } from 'react';", "import { useEffect, useState } from 'react';")
])

patch(r"d:\IncidentMind AI\frontend\src\pages\MemoryExplorer.tsx", [
    ("import React, { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';")
])

patch(r"d:\IncidentMind AI\frontend\src\components\Sidebar.tsx", [
    ("import React from 'react';", "import type React from 'react';")
])

patch(r"d:\IncidentMind AI\frontend\src\components\Navbar.tsx", [
    ("import React from 'react';", "import type React from 'react';")
])

patch(r"d:\IncidentMind AI\frontend\src\components\CreateIncidentModal.tsx", [
    ("import React, { useState } from 'react';", "import { useState } from 'react';")
])
