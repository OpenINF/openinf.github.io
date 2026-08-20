---
title: Here We Are
author: DerekNonGeneric
category: meta
excerpt:
  That work has a name and a date now. The OpenINF SDK arrives in Q4 2026, ten
  small TypeScript packages for the unglamorous middle of Node.js work.
---

Hello everyone! I'm passionate about building tools that empower the open-source
community, and this is where I'll be sharing what comes of that. Updates about
the journey, from the inception of OpenINF to the exciting tools and projects
taking shape along the way.

OpenINF started with an idea: **How can we help open-source developers
aggregate, curate, disseminate, and apply information more effectively?** As I
explored that question, I realized the tools I envisioned weren't readily
available, so I set out to create them myself.

That work has a name and a date now. The **OpenINF SDK** &mdash; ten small
TypeScript packages inspired by the modular and extensible principles of
[Brendan Eich's ideas for JavaScript][] &mdash; arrives in Q4 2026.

What they cover is the unglamorous middle of Node.js work: type guards and
argument validation, structured errors, object and array helpers, text that
behaves itself in a terminal, and a couple of things that fit nowhere else. None
of it is the interesting part of your program. All of it is the part you end up
writing again on every project.

It is not starting from nothing, either. Six of these packages have lived on npm
since April 2022, already written in TypeScript, with type declarations from day
one. What they had not done since then is change. Several leaned on small
third-party modules nobody was maintaining, so I wrote replacements, checked
each against the original, and dropped the dependency. Nine of the ten now carry
no third-party runtime dependency at all, and what remains depends only on a
core that depends on nothing. Four packages that have never been published are
joining the six.

Like any ambitious project, OpenINF has its challenges. I'm balancing
development with my day job and managing everything on a shoestring budget. But
I'm genuinely excited about this project's potential to make a difference in the
open-source world.

This blog, like OpenINF itself, is a work in progress. You might notice the
occasional rough edge &mdash; code that needs updating, or a half-finished page
&mdash; but that's all part of the journey.

Thank you for joining me on this adventure. Your feedback along the way will be
invaluable, so stay tuned, and please feel free to reach out. I'd love to hear
from you.

<!-- prettier-ignore-start -->
<!-- LINK LABEL DEFINITIONS - START -->

[Brendan Eich's ideas for JavaScript]: https://brendaneich.com/2011/01/harmony-of-my-dreams/

<!-- LINK LABEL DEFINITIONS - END -->
<!-- prettier-ignore-end -->
