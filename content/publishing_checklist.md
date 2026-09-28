# Content Publishing & Launch Checklist

Use this checklist before sharing and submitting your IncidentMind AI project.

---

### 1. Pre-Submission Rule Verification
- [x] **Zero Prohibited Terms**: Confirm that the word "h-a-c-k-a-t-h-o-n" is completely absent from all article titles, article bodies, social media copy, video titles, and hashtags.
- [x] **Authentic Technical Positioning**: Position IncidentMind AI as a real, production-grade DevOps/SRE intelligence system.
- [x] **Verified Links Embedded**:
  - Hindsight GitHub: `https://github.com/vectorize-io/hindsight`
  - Hindsight Docs: `https://hindsight.vectorize.io/`
  - Vectorize Agent Memory: `https://vectorize.io/what-is-agent-memory`

---

### 2. Article Deliverable (`content/article.md`)
- [ ] Choose your preferred title from `content/article_titles.md`.
- [ ] Publish the Markdown to one of the recommended platforms:
  - **Medium**
  - **Dev.to**
  - **Hashnode**
  - **Substack**
- [ ] Verify that code snippets, mermaid diagrams, and external links render cleanly.
- [ ] Share the published article as a Link Post on Reddit:
  - `r/llmdevs`
  - `r/sideproject`
  - `r/aiagents`
  - `r/aimemory`

---

### 3. Social Media Post (`content/linkedin_post.md`)
- [ ] Copy the post draft from `content/linkedin_post.md` (<800 characters).
- [ ] Replace `https://github.com/dhanush/incidentmind-ai` with your actual public repository URL.
- [ ] Tag **Code.in** on LinkedIn.
- [ ] Publish the post.
- [ ] **First Comment**: Add the link to your published article.
- [ ] **Second Comment**: Add the link to the Hindsight GitHub repo (`https://github.com/vectorize-io/hindsight`).

---

### 4. Video Walkthrough Deliverable (`content/video_script.md`)
- [ ] Record a 2–3 minute screen walkthrough following `content/video_script.md` using OBS Studio, Loom, or Filmora in 1080p.
- [ ] Generate the 16:9 thumbnail using the prompt in `content/video_thumbnail_prompt.md` via Google Nano Banana or Gemini image generation.
- [ ] Upload the video publicly to YouTube with one of the 5 high-performing titles from the script.
- [ ] Ensure the video description links to your GitHub repository and Hindsight.

---

### 5. Repository Final Audit
- [x] Backend tests passing cleanly (`pytest tests -v`).
- [x] Frontend builds with zero TypeScript errors (`npm run build`).
- [x] `.env.example` provided with clean placeholders (no secrets committed).
- [x] Clean Dockerfile and docker-compose configurations.
- [x] Comprehensive README with system diagrams and quickstart steps.
