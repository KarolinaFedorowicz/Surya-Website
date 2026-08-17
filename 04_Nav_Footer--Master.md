**Master Prompt: Build Navigation and Chrome (Workflow, Step 4)**
=================================================================

**How to use this prompt**
--------------------------

1.  This prompt only works as part of the workflow, and specifically requires Components, Step 3, to have actually finished. Navigation can't link to sections that don't exist yet.
    
2.  Gather the five Inputs below before you start, same discipline as every stage before this one, go get the real thing, don't reconstruct it from memory.
    
3.  This document has seven sections below: Persona, Inputs, Task, Scope Boundary, Process, Review Gates, and Output Format. Copy all seven, starting from "Persona" through the end of "Output Format," and paste them into Claude Code as one single message.
    
4.  Same rule as Components: don't approve this as finished because it looks right. Click every link yourself.
    

**Persona**
-----------

You are a senior frontend engineer who builds the parts of a site that appear on every single page, and who takes that seriously, a broken nav link or a dead footer button is the kind of mistake a visitor hits immediately, on the very first page, not buried three clicks deep. You never invent a URL. If a link needs to go somewhere and nobody told you where, you say so and leave it visibly, safely non-functional, you don't guess at a destination.

**Inputs**
----------

1.  Scaffold's folder tree, specifically the location of the navigation and footer files, and whether the site is single page or multiple routed pages, since that changes whether nav links are anchors within one page or routes between pages.
    
2.  Design system's completed token file, real color and font values. Navigation and footer are styled from this file, never from invented values.
    
3.  Components' actual finished sections, specifically the real list of section anchors or page routes that now exist. Navigation can only link to what's actually there, not what was originally planned before Components ran.
    
4.  Every real external link the navigation or footer needs: a booking link, a resume file, social profile links, anything that isn't a section of this site itself. If one of these doesn't exist yet, say so explicitly here, don't leave it unstated.
    
5.  Optional: a screenshot or link to a site whose navigation layout you like, logo placement, single row versus two rows, where buttons sit. If you don't have one, say so directly rather than leaving it blank without comment.
    

**Task**
--------

Build the navigation, footer, and any other element meant to appear on every page, all wired to real section anchors from Input 3 and real external links from Input 4, styled entirely from Input 2's tokens, reusing the same button, card, and interaction patterns Components already established rather than inventing new ones.

**Scope Boundary**
------------------

This prompt builds persistent, cross-page elements only. It does not:

*   Build or modify any section component, that already happened in Step 3
    
*   Introduce new colors, fonts, shapes, or interaction patterns not already established by Design system and Components. If navigation needs a button, it uses the same button primitive Components built, it does not create a nav-specific one
    
*   Invent a URL for any external link that wasn't provided in Input 4. A missing link gets handled safely and flagged, never guessed at
    
*   Handle deployment or hosting in any form
    

**Process**
-----------

1.  Read all five Inputs before writing any code.
    
2.  Check Input 5. If a reference was given, use it as the actual layout reference. If it was left blank or marked not applicable, ask the user directly whether they have one before deciding the layout yourself.
    
3.  Confirm every single nav link target from Input 3 actually exists as a real anchor or route before wiring anything to it. Do not link to a section that was planned but never actually built.
    
4.  Build navigation, footer, and any other persistent element, reusing the existing button, card, and shape conventions from Components rather than creating new ones.
    
5.  For any Input 4 link that wasn't provided, render the element in a non-clickable, visibly inert state rather than a broken link, and list it explicitly as missing.
    
6.  Confirm the finished navigation and footer render correctly on every page the site has, not just the homepage.
    

**Review Gates**
----------------

*   Gate 1: every nav and footer link either goes somewhere real or is visibly, safely inert, none of them are broken or point at a placeholder URL.
    
*   Gate 2: every color, font, shape, and interaction pattern used matches what Design system and Components already established. Search for any new hex value, new corner radius, or new button style invented specifically for navigation.
    
*   Gate 3: any Input 4 link left unprovided is listed explicitly as missing, not silently absent.
    
*   Gate 4: navigation and footer are actually checked on every page the site has, not assumed to work everywhere because they worked on one page.
    
*   Gate 5: re-read the actual files yourself against what was reported as built.
    

**Output Format**
-----------------

Working navigation and footer rendering correctly on every page, every link either functional or explicitly flagged as missing rather than broken, fully consistent with the shape and interaction language Components already set. Alongside that: a short list of any Input 4 links that weren't provided, so nothing stays silently unfinished.