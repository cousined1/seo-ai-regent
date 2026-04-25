# AI Scrubbing

Remove AI watermarks and patterns from content to make it appear naturally human-written.

## What to Remove

### Em-Dash Overuse
AI uses em-dashes (—) far more than humans. Replace with:
- Commas for parenthetical phrases
- Semicolons for related clauses
- Periods to split into two sentences
- Colons before lists/explanations

**Before:** "The tool is fast — faster than anything else — and reliable."
**After:** "The tool is fast, faster than anything else, and reliable."

### AI Filler Phrases (remove or rewrite)
- "It's worth noting that..."
- "In today's landscape..."
- "Delve into"
- "Navigate the complexities of"
- "Leverage" (when "use" works)
- "Unlock the power of"
- "Seamlessly"
- "Robust" (when not describing software)
- "Comprehensive" (when not actually comprehensive)
- "Cutting-edge"
- "Game-changing"
- "Revolutionize"
- "Pave the way"
- "Foster" (when not about children)
- "Facilitate" (when "help" works)
- "Empower" (when "enable" or "let" works)
- "Paradigm shift"
- "Synergy"
- "Holistic"
- "Ecosystem" (when not biological)

### Passive Voice Clusters
AI overuses passive voice. Convert to active:
- "is designed to" → "designed to" or just describe what it does
- "can be utilized" → "you can use"
- "has been shown to" → cite the study directly

### Robotic Transitions
- "Furthermore," → remove or use "And" / "Also"
- "Moreover," → remove
- "Additionally," → "Also," or just start the next point
- "It is important to note" → delete entirely
- "As mentioned previously" → just repeat the info naturally

### Unicode Watermarks
Some AI tools embed invisible characters:
- Zero-width spaces (U+200B, U+200C, U+200D)
- Zero-width joiners
- Byte order marks (U+FEFF)
- Format control characters
- Non-breaking spaces used excessively

### Sentence Length Monotony
AI produces uniform sentence lengths. Vary rhythm:
- Mix 5-10 word sentences with 15-25 word ones
- Occasional very short sentences for emphasis. Like this.
- Don't start every sentence with the same structure

## Scrubbing Process

1. Scan for and remove invisible Unicode characters
2. Replace em-dashes with contextually appropriate punctuation
3. Find and rewrite AI filler phrases
4. Convert passive voice clusters to active voice
5. Vary sentence rhythm and length
6. Add contractions (don't, it's, you'll, can't) if missing
7. Remove exclamation point overuse (max 1-2 per 1000 words)
8. Verify no meaning was lost

## Verification

After scrubbing, check:
- Em-dash count: should be ≤2-3 per 1000 words
- No filler phrases remaining
- Contractions present naturally
- Sentence length varies (standard deviation >5 words)
- Reads like a human wrote it, not a machine polished it