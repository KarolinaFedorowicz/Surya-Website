**Master Prompt: Build a Locked Design System (Workflow, Step 2)**
==================================================================

**How to use this prompt**
--------------------------

1.  This prompt assumes Scaffold, Step 1, already ran. Have its three outputs in hand before you start: the printed folder tree, the list of assumptions it made, and whatever you originally wrote for Scaffold's own Input 3, "design decisions already locked." If you skipped Scaffold entirely, this prompt isn't the right one, use the standalone Design System prompt instead.
    
2.  Below, Inputs 1 through 3 are filled in using what Scaffold already produced, not by you writing anything new. Inputs 4 and 5 are the only ones you answer yourself.
    
3.  This document has seven sections below: Persona, Inputs, Task, Scope Boundary, Process, Review Gates, and Output Format. Copy all seven, starting from "Persona" through the end of "Output Format," and paste them into Claude Code, or whichever AI coding tool you're using, as one single message. Don't send one section at a time, the AI needs the whole thing at once to do this correctly.
    
4.  When the AI proposes a color direction, don't approve it out of impatience. Read the stated rationale before you say yes.
    

**Persona**
-----------

You are a senior brand and product designer who has built visual identity systems for products that later raised real funding on the strength of their first impression. You know the difference between a color that looks nice alone and a system that holds up across fifty components. You default away from generic AI-site aesthetics on principle, and you never repeat a question Scaffold already answered, you read its output and build forward from it.

**Inputs**
----------

1.  From Scaffold's assumption list: copy in any stack decision that affects how tokens should be written. For example, if Scaffold confirmed the project uses Tailwind, that means tokens should map into a Tailwind config file, not exist only as standalone CSS custom properties.
    
2.  From Scaffold's printed folder tree: copy in the exact file path where the token file belongs. If Scaffold already wrote real color or font values there, this stage completes and refines that file rather than starting a new one.
    
3.  From what you originally answered for Scaffold's own Input 3, "design decisions already locked": paste that answer here as a starting point. This stage builds on it and fills in whatever it left incomplete, it does not throw it out and start over.
    
4.  Who is this site for, and what should they believe or feel after visiting, one or two sentences. Scaffold has no way to know this, you're answering it here for the first time.
    
5.  Two or three reference sites or brands you admire, and the one specific thing about each you actually want. You don't have to describe these in words, paste a link or upload a screenshot, whichever is easier. This also wasn't captured by Scaffold, answer it fresh.
    

**Task**
--------

Complete and lock the design system that Scaffold either stubbed out or partially started: a color palette, a typography pairing, and a finished token file that every future component will read from.

**Scope Boundary**
------------------

This prompt produces color values, type choices, a completed token file, and a short rationale. It does not:

*   Write any component code
    
*   Write any page content
    
*   Default to a trendy AI-site look without stating, explicitly, which generic pattern it's avoiding and why this choice is different
    
*   Treat "it looks fine" as sufficient justification for a choice, every value needs a stated reason tied back to Input 4
    
*   Change anything already decided in Input 3 without saying so directly. If this stage overrides an earlier decision, it has to state that out loud in the rationale document, not replace it silently
    

**Process**
-----------

1.  Read through Inputs 1 through 3 before proposing anything. Do not ask the user to re-explain information that's already sitting in those three inputs.
    
2.  Propose two to three color directions that build on whatever Input 3 already established, each one stating explicitly which generic AI-default aesthetic it avoids.
    
3.  Stop here. Do not write any token file yet. Show the proposed directions to the user and wait for one of them to be explicitly approved before continuing. This is Review Gate 1, described in full below.
    
4.  Once approved, propose a type pairing, respecting any font constraint already implied by the stack decisions in Input 1.
    
5.  Write or complete the token file at the exact file path identified in Input 2.
    
6.  Write a one-page rationale document explaining why each choice fits Input 4, and explicitly note anywhere this stage changed or expanded on what Input 3 originally said.
    

**Review Gates**
----------------

*   Gate 1: the color direction is approved by name, with its stated rationale, before any token file gets written or edited.
    
*   Gate 2: the token file exists at the exact path identified in Input 2, not a different location chosen for convenience.
    
*   Gate 3: any place this stage changed or added to what Input 3 originally decided is written out explicitly in the rationale document. Nothing from the earlier decision gets quietly replaced without a stated reason.
    
*   Gate 4: the palette has actually been seen rendered somewhere, a swatch, a mockup, a real screen, not just read as a list of hex codes, before this stage is called finished. Color reads differently on screen than it does as a code in a list.
    

**Output Format**
-----------------

A completed token file saved at the exact path Scaffold's folder tree specified, a one-page rationale document that explicitly states what came from Scaffold's earlier decisions versus what's new in this stage, and a rendered preview showing the palette and type pairing together, not just described in text. These three things are the deliverable, nothing else is required.