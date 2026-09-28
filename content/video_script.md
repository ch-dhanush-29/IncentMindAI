# IncidentMind AI - 3-Minute Video Walkthrough Script

**Presenter**: SRE & AI Systems Engineer  
**Resolution Target**: 1080p Full HD  
**Screen Setup**: IncidentMind AI Dashboard open at `http://localhost:5173`

---

## 1. Quick Intro (0:00 - 0:30)
- **Visual Cue**: Show Executive SRE Dashboard with dark navy/cyan enterprise UI. Highlight the KPI cards showing MTTR reduction and "Verified Memories in Hindsight".
- **Voiceover**: 
  > "Hi everyone, I'm Dhanush. As SREs and backend engineers, nothing is more frustrating than solving a complex production outage at 2 AM, only for a nearly identical issue to take down production three weeks later while everyone scrambles to remember what the fix was. 
  > Today I'm demonstrating IncidentMind AI, a persistent-memory incident response platform built on top of Vectorize Hindsight and Groq."

## 2. The Problem: Amnesic AI Without Memory (0:30 - 1:00)
- **Visual Cue**: Navigate to the Incidents Feed, click into an active incident (`payment-api` connection pool starvation), and click the **"Compare vs No-Memory"** button in the AI Investigation Studio.
- **Voiceover**: 
  > "Standard AI chatbots suffer from acute amnesia. Watch what happens when we analyze this active 504 Gateway Timeout incident without memory context. 
  > On the left, the baseline LLM has no idea our team already investigated this. It offers generic guesses: check your network partition, run EXPLAIN queries, restart pods. It's guesswork."

## 3. Live Demo: Hindsight Memory Recall & Retention in Action (1:00 - 2:30)
- **Visual Cue**: Focus on the right side of the comparison panel showing **"WITH HINDSIGHT PERSISTENT MEMORY"**. Show the recalled historical incident `INC-1` and similarity match score.
- **Voiceover**: 
  > "Now look at the right side. Using Hindsight's TEMPR retrieval engine, IncidentMind AI queried our persistent memory bank and immediately recalled an identical incident from earlier this month. 
  > It links directly to the confirmed root cause: an unclosed JDBC statement in the webhook retry executor, with the exact diagnostic command to run: `pg_stat_activity` filtered by `idle in transaction`. 
  > The triage time drops from 45 minutes of guessing down to 60 seconds of verified action."

- **Visual Cue**: Navigate to the **Hindsight Memory Explorer** tab. Show the real-time Memory Operations Audit Stream (`RETAIN` and `RECALL` badges).
- **Voiceover**: 
  > "Inside the Memory Explorer, you can see the actual retained records stored in our Hindsight memory bank, complete with source incident IDs, service tags, and human verification provenance. Every retain and recall operation is tracked in real-time."

- **Visual Cue**: Click **"Resolution & Retain"**. Fill out a postmortem verification and click **"Confirm & Retain Memory"**.
- **Voiceover**: 
  > "When an incident is resolved, human approval is mandatory. An engineer verifies the fix, and with one click, IncidentMind AI calls Hindsight's retain endpoint. The institutional knowledge is preserved forever."

## 4. Key Takeaway & Conclusion (2:30 - 3:00)
- **Visual Cue**: Return to the Executive Dashboard, showing the newly retained record count updated live.
- **Voiceover**: 
  > "The biggest revelation building this was that AI agents don't just need bigger models; they need durable biomimetic memory. With Hindsight, our incident copilot gets smarter with every single postmortem our team writes. 
  > You can explore the full code on GitHub. Thanks for watching!"

---

## 5 High-Performing Video Titles
1. Stop Outage Amnesia: Building an SRE Agent That Remembers with Hindsight
2. How We Cut Incident MTTR in Half Using Hindsight Persistent Memory
3. Why Stateless LLMs Fail at Incident Response (And How Hindsight Fixes It)
4. I Built an AI Incident Copilot with Hindsight: Here is What Happened
5. From 40-Minute Outages to 60-Second Fixes: Agent Memory in Production
