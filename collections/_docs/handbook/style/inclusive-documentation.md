# Writing inclusive documentation

**Key Point:** Write using inclusive language, word choice, and examples.

We write our developer documentation with inclusivity and diversity in mind.
This page is not an exhaustive reference, but describes some general guidelines
and examples that illustrate some best practices to follow.

## Avoid ableist language

When trying to achieve a [friendly and conversational tone](tone.md),
problematic ableist language may slip in. This can come in the form of figures
of speech and other turns of phrase. Be sensitive to your word choice,
especially when aiming for an informal tone. Ableist language includes words or
phrases such as _crazy_, _insane_, _blind to_ or _blind eye to_, _cripple_,
_dumb_, and others. Choose alternative words depending on the context. For
example:

| Not recommended                                                                                          | Recommended                                                                       |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Before launch, give everything a final sanity-check.                                                     | Before launch, give everything a final check for completeness and clarity.        |
| There are some crazy outliers in the data.                                                               | There are some baffling outliers in the data.                                     |
| It cripples the service, causing a poor user experience until the queue clears.                          | It slows down the service, causing a poor user experience until the queue clears. |
| Replace the [dummy variable](word-list.md#dummy-variable) in this example with the appropriate variable. | Replace the placeholder variable in this example with the appropriate variable.   |

## Avoid unnecessarily gendered language

In addition to being mindful of the
[pronouns](pronouns.md#gender-neutral-pronouns) used in narrative examples, be
sensitive to other possible sources of gendered language.

| Not recommended                                                                           | Recommended                                                                                |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Equipment installation and setup takes around 16 man-hours to complete.                   | Equipment installation takes around 16 person-hours to complete.                           |
| This API might be just what your globally conscious company needs to help all of mankind. | This API might be just what your globally conscious company needs to help all of humanity. |

## Write diverse and inclusive examples

Use diverse names, genders, ages, and locations in examples. Keep the following
advice in mind:

- Follow our [gender-neutral pronoun](pronouns.md#gender-neutral-pronouns)
  guidance.
- Avoid being too culturally specific to the US. Be mindful when referring to
  specific holidays, cultural practices, sports, figures of speech, etc. Being
  sensitive here also supports
  [writing for a global audience](translation.md#culturally-specific).
- Take care to [choose a diverse set of names](examples.md#names) to help
  examples reflect the real world diversity of our audience.
- When writing about older adults, avoid terms and figures of speech such as
  _the elderly_, _the aged_, _seniors_, _senior citizens_, _80 years young_.
  Instead, use terms such as _older adults_, _aging population_, or mention the
  person's relative age or relationship to the other people in your example when
  those details are relevant.

## Write about features and users in inclusive ways

**Avoid** referring to people in divisive ways. For example, instead of
referring to people as "native speakers" or "non-native speakers" of English,
consider whether or not your document needs to discuss this at all, and revise
in order to discuss the feature in terms that are relevant to anyone regardless
of what languages they know.

**Avoid** using socially-charged terms for technical concepts where possible.
For example, avoid terms such as [blacklist](word-list.md#blacklist) and
[first-class citizen](https://en.wikipedia.org/wiki/First-class_citizen), even
though these terms may still be widely used. Instead of _first-class_, consider
other terms such as: _core feature_, _built-in_, _top-level_. Choose the best
term for your context.

**Avoid** graphically violent or harmful terms. For example, avoid using the
term _[STONITH](word-list.md#stonith)_; instead, describe the process used to
stop an errant node in context using more specific terms.

If it's unavoidable and you must mention a violent or harmful term such as
_STONITH_, mention it once when you first explain the relevant feature, but
phrase it in a way that de-emphasizes the term. For example:

**Recommended:** This might require you to fence failed nodes.

**Sometimes okay:** This might require you to fence failed nodes (sometimes
referred to as STONITH).

## Avoid bias and harm when discussing disability and accessibility

Many developers create products with accessibility and disability in mind. When
documenting these features, and when writing about people with disabilities or
about accessibility, work to eliminate unintentional bias and harm. Take the
time to educate yourself about the ways the communities you're writing about
prefer to be identified and described before writing about them in your
documentation.

A general guideline in this area is to **use people-first language, while also
following person-centered language best practices.**

### People-first language

The concept of _people-first language_ includes the value that people are people
first, followed by other characteristics such as their disability. Examples of
using _people-first language_ include "a boy with autism," "a person who is
blind or visually impaired," or "a woman who is Deaf."

The APA Style norms (American Psychological Association) recommends:

- **Do** put people first, not their disability.
- **Don't** label people for their disability.

The AMA (American Medical Association) Style Manual recommends:

- **Avoid** labeling (and thus matching) people according to their disabilities
  or diseases (e.g., blind, schizophrenic, epileptic). Instead, put the person
  first.
- **Avoid** describing the person as a victim or with other emotional terms that
  suggest helplessness (afflicted with, suffering from, hit with, cripple).
- **Avoid** euphemistic descriptions such as physical disability or special.

The Google Developer Documentation Style Guide recommends:

- **Avoid** terms that reflect or project feelings and judgements about a
  person's disability, such as: _victim of_, _suffering from_,
  _wheelchair-bound_. Instead, use neutral terms such as: _experiencing_,
  _living with_, _uses a wheelchair_.
- **Avoid** euphemisms or patronizing terms such as: _physically challenged_,
  _special_, _differently-abled_, _handi-capable_.
- **Don't** describe people without disabilities as "normal" or "healthy". This
  contributes to othering and alienation of people with disabilities by implying
  they are abnormal or sick. Instead, use terms such as: _nondisabled person_,
  _sighted person_, _hearing person_, _person without disabilities_,
  _neurotypical person_.
- **Research** the ways the people in the communities you're writing about
  prefer to be identified and use the terms they prefer. \[More on this in the
  [Person-centered language section](#person-centered-language).]

#### Terminology tips

In all cases, avoid terms that remove personhood, or that define people by their
disability. For example, avoid terms such as: _the disabled_, _a quadriplegic_.
Instead, use terms such as: _people with disabilities_; _a quadriplegic person_.

- Say "person with a disability" rather than "disabled person."
- Say "people with disabilities" rather than "the disabled."
- Say "person who uses a wheelchair" rather than "confined to a wheelchair" or
  "wheelchair-bound."

### Person-centered language

For specific disabilities, saying "person with Tourette syndrome" or "person who
has cerebral palsy" is usually a safe bet. However, many members of some
communities of people who are on the Autism spectrum, blind or visually
impaired, or Deaf or hard of hearing have a preference about using their
disability as a primary identifier — _identity-first language_. For example, "an
Autistic," "a blind person," or "Deaf woman" (note the capital D).

Capitalization of identities also may vary. (For example, visit
[Identity First Autistic](https://www.identityfirstautistic.org/) and
[Self-Identification in the Deaf Community](https://www.verywellhealth.com/deaf-culture-big-d-small-d-1046233)
for some perspectives.) Whenever possible, research and choose terms that
respect the ways people in the communities identify.

#### Best practices

- **Be clear:** Sometimes, we use broad language when more specific words would
  be better, and vice versa. For example, if your context is
  wheelchair-accessible ramps, you can say "people with limited mobility" rather
  than "disabled people."
- **Be creative:** You don’t need to find a single word or term. You can say
  things like "autistic people and people with autism" and explain why you are
  doing so.
- **Be humble:** If you feel reactive, defensive, or anxious, explore your
  feelings and consider how you can work to fully respect folks who use
  different language than you do.
- **Be respectful:** Remember that the point is to care about the people you are
  referring to and honor their personhood and agency.
- **Be curious:** Consult different sources, particularly groups and
  organizations led by the folks you’re referring to, to see what language they
  use and why.

There is no one "correct" answer. The invitation of person-centered language is
to value a caring and complicated approach rather than searching for a pat
solution.

---

<small>\* Kapitan, Alex (2017).
["On "Person-First Language": It's Time to Actually Put the Person First"](https://radicalcopyeditor.com/2017/07/03/person-centered-language/).</small>

<small>Portions of this page are modifications based on work created and
[shared by Google](https://developers.google.com/readme/policies/) and used
according to terms described in the
[Creative Commons 4.0 Attribution License](https://creativecommons.org/licenses/by/4.0/).
For more information, refer to the
[original source page](https://developers.google.com/style/accessibility).</small>
