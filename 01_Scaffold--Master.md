**Master Prompt: Scaffold a Production-Ready Website Structure**
================================================================

**How to use this prompt**
--------------------------

1.  If you don't already have a clear section list for your site, run the Step 0 site-mapping prompt first, it's built specifically to produce Input 2 below. If you already know your sections some other way, that's fine too, this prompt doesn't require Step 0, it just accepts its output cleanly if you have it.
    
2.  Fill in all five Inputs below with your own answers before you do anything else. A blank Input isn't a shortcut, it's a guess the AI will make for you, and you won't know which guesses it made.
    
3.  Paste this entire document into Claude Code, or whichever AI coding tool you're using, as one single message. Don't split it into pieces or run it section by section, the sections depend on each other.
    
4.  When it finishes, don't take "done" at face value. Work through every item in Review Gates yourself before you consider this stage finished.
    
5.  Only move on to the next master prompt in the sequence, Design system, once every Review Gate has actually passed, not once it looks like it probably did.
    

**Persona**
-----------

You are a senior frontend architect who has scaffolded hundreds of production Next.js projects for paying clients. Your structures survive months of active development without needing a rebuild, because you separate concerns correctly on day one: content never lives inside components, design decisions never live inside content, and nothing gets built before its dependencies exist. You never guess at a stack decision silently. If something isn't specified, you state the assumption plainly and proceed, you don't stall waiting for permission on defaults that don't matter.

**Inputs**
----------

Before running this prompt, gather these five things. If you don't have all five yet, stop and get them first, a scaffold built on guesses gets rebuilt later.

1.  The site's purpose in one sentence, what it needs to do for whoever visits it.
    
2.  The full list of sections or pages the site will eventually have, even if the content for them doesn't exist yet. If you already ran the Step 0 site-mapping prompt, this is exactly what it produced, paste that list in as-is, don't redo the work here.
    
3.  Any design decisions already locked, color palette, typography, visual style, even in rough form.
    
4.  Whether this is a single page, multiple pages, or a mix, and which pages need their own route.
    
5.  Any assets you already have in hand, logos, photos, documents, so the folder structure has a real home for them.
    

**Task**
--------

Scaffold a complete, empty-but-functional Next.js project structure: folders, stub files, and placeholder content contracts, ready for design tokens, real content, and real components to be layered in afterward without any restructuring.

**Scope Boundary**
------------------

This prompt builds structure only. It explicitly does not:

*   Write final section copy or content, placeholder markers only
    
*   Build real component markup or styling logic, empty component shells only
    
*   Make design decisions, colors and fonts get one exception below, everything else waits for the next stage
    
*   Skip straight to a finished-looking page, a scaffold that already looks done hides the fact that nothing real has been built yet
    

The one exception: if your color palette and typography are already locked from Input 3, write those real values into a single design tokens file now. Everything else stays a stub. Don't let "it's just a small addition" excuses creep the scope past this line, that's how scaffolds turn into half-finished builds.

**Process**
-----------

1.  Initialize the project: Next.js, TypeScript, Tailwind CSS, unless you have a specific reason to deviate, this stack has the least friction for an AI coding agent to work in correctly.
    
2.  Create the folder structure: a public/assets directory with subfolders matching your actual asset types (logos, illustrations, photos, documents), a content directory with one file per section or page from Input 2, a src/app directory following Next.js routing conventions for every page from Input 4, and a src/components directory split into layout, sections, and ui, so reusable pieces are never mixed in with one-off pieces.
    
3.  Stub every content file with a placeholder comment naming what belongs there, don't write real copy yet.
    
4.  Stub every component file as an empty function component, name and file location only, no markup.
    
5.  If Input 3 gave you real design values, write them into one tokens file now, CSS custom properties, not scattered hardcoded values.
    
6.  Confirm the project boots locally before reporting anything as complete.
    

**Review Gates**
----------------

Do not proceed to the next stage, real content and design tokens, until all four of these are true:

*   Before anything else is marked complete, the AI has explained the folder structure back to you in plain, non-technical terms, what each top-level folder is for and why it exists, and you've explicitly approved it. If you don't understand the explanation, that's a signal to ask again, not to nod along.
    
*   The project actually boots locally with zero errors, not "should work," verified.
    
*   The printed folder tree matches every section and page from your Inputs, nothing missing, nothing extra invented.
    
*   You've personally opened at least three of the stub files and confirmed they're actually empty shells, not partially-written components the AI decided to get ahead on.
    

If any of these four aren't true, stop and fix them before moving forward. A scaffold stage that "mostly" passed review isn't passed.

**Output Format**
-----------------

Deliver: a working local dev server, a full printed folder tree, and a short list of every assumption made filling gaps the Inputs didn't cover. No walls of explanation, the tree and the assumption list are the deliverable, not a narrative description of what a folder structure is.

Content is not part of this stage and doesn't have to follow it directly. It only depends on the same site map you used for Input 2, not on anything this scaffold produced, so it can be written before this stage, after it, or at the same time, whichever fits how you work. The one real requirement: real content needs to exist before Components, since that's the stage that actually reads it.