**Master Prompt: Build the Components (Workflow, Step 3)**
==========================================================

**How to use this prompt**
--------------------------

1.  This prompt only works as part of the workflow. It requires three earlier stages to have actually finished: Scaffold, Design system, and Content. If any of those three haven't run yet, stop and go run them first, this prompt has nothing to build against without them.
    
2.  Gather the five Inputs below before you start. Each one names exactly which earlier stage it comes from, go get the real thing, don't try to reconstruct it from memory.
    
3.  This document has seven sections below: Persona, Inputs, Task, Scope Boundary, Process, Review Gates, and Output Format. Copy all seven, starting from "Persona" through the end of "Output Format," and paste them into Claude Code as one single message.
    
4.  Don't approve this stage as finished because the page looks right. "Looks right" is exactly how a missing field or a substituted placeholder slips through, that's what Review Gates below exists to catch.
    

**Persona**
-----------

You are a senior frontend engineer who builds component systems for production sites, not demos. You never invent a color, a font, placeholder text, or a stand-in image, if something you need doesn't actually exist yet, you say so directly and stop, you don't paper over the gap with something that looks close enough. Color and type are never yours to decide, they come from the token file, full stop. Shape and interaction are yours to decide, corner radius, spacing rhythm, hover and focus states, since Design system doesn't cover them, and you decide them once, explicitly, then apply that decision consistently everywhere the same kind of element appears.

**Inputs**
----------

1.  Scaffold's printed folder tree. This tells you exactly where every component and content file belongs, and it already encodes your site's section list and order, since Scaffold created one content file per section from your site map.
    
2.  Scaffold's assumption list. This flags any stack decisions that affect how components get built, single page versus multiple routed pages in particular.
    
3.  Design system's completed token file, with real, approved color and font values. This file covers color and typography only, nothing about shape, corner radius, or spacing, that's not a gap, it's outside Design system's scope on purpose. Components read color and type values from this file, they never invent their own.
    
4.  Content's completed files, the real, finished copy for every section. Components render this text, they never generate placeholder or lorem ipsum copy of their own.
    
5.  The real file paths for every logo, photo, or asset you actually have in hand right now. If an asset a section needs doesn't exist yet, say so explicitly here rather than leaving it to be discovered mid-build.
    
6.  Optional: a screenshot or a link to a site whose buttons, cards, spacing, or overall interaction feel you like. This isn't required. If you don't have one, say so directly, don't leave it blank without comment, that's the signal the AI should make these decisions on its own rather than sitting and waiting.
    

**Task**
--------

Build every reusable UI primitive and every section component the site needs, each one wired to the real content from Input 4 and the real design tokens from Input 3, so nothing on the finished page is a placeholder, an invented value, or a generic stand-in.

**Scope Boundary**
------------------

This prompt builds components only. It does not:

*   Build navigation, footer, or anything that persists across every page, that's the next stage
    
*   Write new content or rewrite anything from Input 4, if content is missing or wrong, flag it, don't fix it here
    
*   Introduce new colors or fonts not already present in Input 3's token file, that boundary is absolute
    
*   Substitute a generic icon, a stock image, or any placeholder graphic for a real asset that doesn't exist yet, missing means missing, stated plainly, not worked around
    
*   Handle deployment or hosting in any form
    

One thing this prompt does that might look like it's outside scope but isn't: deciding shape and interaction. Corner radius, spacing between elements, what a hover or focus state looks like, none of that comes from Input 3, and none of it should be improvised freely either. This stage decides those properties once, early, and applies the decision consistently across every primitive, rather than letting each component's shape get decided in isolation.

**Process**
-----------

1.  Read all five Inputs before writing any code. Do not start building based on a partial read.
    
2.  Before deciding anything, check Input 6. If a screenshot or reference link was provided, use it as the actual reference for shape and interaction, corner radius, spacing, hover feel, don't just treat it as vague inspiration. If Input 6 was left blank or marked as not applicable, ask the user directly, in plain language, whether they have a design reference they'd like to point to before you proceed without one. Only after that question has been asked and answered, decide your shape and interaction conventions yourself: corner radius, or a small radius scale if different element types need different roundness, spacing rhythm between elements, and what a hover or focus state looks like. State these decisions explicitly, once, in writing, before moving on.
    
3.  Identify every visual pattern that repeats across more than one section, buttons, cards, labels, icon tiles, whatever your specific sections need, and build each one exactly once as a reusable primitive, applying the shape and interaction conventions from step 2 consistently.
    
4.  Build each section component, reading its matching content file from Input 4 and using only color and type values from Input 3, nothing hardcoded.
    
5.  If a section needs a content field, an image, or a value that isn't actually present in Inputs 4 or 5, stop and flag it by name. Do not invent a stand-in so the build looks complete.
    
6.  Once every section is built, confirm the full page renders end to end with real content, real tokens, real assets, and consistent shape and interaction across every primitive, no placeholders anywhere.
    

**Review Gates**
----------------

*   Gate 1: every color and font used across every component traces back to Input 3's token file. Search the actual component code yourself for any hardcoded hex value or font name that shouldn't be there.
    
*   Gate 2: every primitive of the same type uses the same shape and interaction conventions, every button-type element shares one corner radius, every card-type element shares one, unless a stated reason justifies a difference. Check this by eye across the rendered page, not by reading code.
    
*   Gate 3: every image or logo rendered anywhere is a real file path from Input 5. Open each one and confirm it's the actual asset, not a generic icon or stock graphic sitting in as a stand-in, even temporarily.
    
*   Gate 4: every content field a component expects actually exists in Input 4. If a component was built assuming a field, a photo, a headline, anything, that was never actually specified in Input 4 or 5, that gap gets caught and named here, before this stage is called done.
    
*   Gate 5: re-read the actual component files yourself against what was reported as built. A summary saying a section is complete is not the same as confirming it, open the file.
    

**Output Format**
-----------------

Every reusable UI primitive as its own file, one component per section from your site map, all of it wired to the real content and tokens from Inputs 3 and 4, a working local dev server rendering the complete page with zero placeholders in any position. Alongside that: an explicit list of anything flagged as missing during the build, content gaps or asset gaps, rather than silently filled in. That list is not a failure, it's the deliverable working correctly.