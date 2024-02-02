# Writing for a global audience

**Key Point:** Write in US English, but write with translation and a global
audience in mind.

We write our developer documentation in US English, but some of it is translated
into languages other than English or is read by developers for whom English is
not their primary language.

Write with localization, translation, and internationalization in mind. The
following list defines these terms:

- Localization: Adapting a product and its associated documentation for a
  specific country. This process involves more than translation, for example,
  using local currencies or units of measurement.
- Translation: Translating one language to another language. This process might
  involve localization, but the two terms aren't synonomous with one another.
- Internationalization: Designing a product and its associated documentation to
  mimimize the localization effort. For example, placing all UI strings in a
  separate file to simplify translation.

For more information, see
[Language localization](https://wikipedia.org/wiki/Language_localisation).

## General dos and don'ts

- Use [present tense](tense.md).
- Write [dates and times](dates-times.md) in unambiguous and clear ways.
- Use screenshots and text in figures sparingly. For more information, see
  [Figures and other images](images.md).
- Use qualifying nouns for technical keywords. For example, when referring to a
  file called `example.yaml`, call it the _`example.yaml` file_ and not
  _`example.yaml`_ by itself. For more information, see
  [Keywords](code-in-text.md#keywords_1).
- Provide context. Don't assume the reader already knows what you're talking
  about.
- Avoid negative constructions when possible. Consider whether it’s necessary to
  tell the user what they can’t do instead of what they can.
- Avoid directional language (for example, _above_ or _below_) in procedural
  documentation. For more information, see
  [UI elements and interaction](ui-elements.md).

## Write short, clear, and precise sentences

The shorter the sentence, the easier it is to translate. English sentences can
be shorter in length than other languages, so an English sentence of average
length might result in a long sentence when translated. Longer sentences can
impair understanding, cause rendering issues on the page or product interface,
lengthen translation time, and increase translation and review costs.

- Use active voice. The subject of the sentence is the person or thing
  performing the action. With passive voice, it's often hard for readers to
  figure out who's supposed to do something. For more information, see
  [Active voice](voice.md).

- Address the reader directly. Use _you_, instead of _the user_ or _they_. For
  more information, see [Second person and first person](person.md).

- Use simple verbs. For example, don't use words like _utilize_ when the simpler
  word _use_ conveys the same information.

- Avoid phrasal verbs when possible. A phrasal verb combines multiple words to
  form a single verb phrase. These verbs are also known as compound verbs. Try
  to substitute a simpler verb first. There might not be a better verb; for
  example, a few exceptions to this rule include _set up_, _log in_, and _sign
  in_.

  Not recommended: This document makes use of the following terms:

  Recommended: This document uses the following terms:

- Define abbreviations. Abbreviations can be confusing out of context, and they
  don't translate well. Spell things out whenever possible, at least the first
  time you use a given term. For more information, see
  [Abbreviations](abbreviations.md).

- Don't use too many modifiers. In particular, don't use more than two nouns as
  modifiers of another noun.

  Not recommended: A hybrid cloud-native DevSecOps pipeline

  Recommended: A cloud-native DevSecOps pipeline in a hybrid environment

- Don't misplace modifiers. For example, place a word like _only_ immediately
  before the noun or verb it relates to.

  Not recommended: Developers only need to apply for one token.

  Recommended: Developers need to apply for only one token.

- Don't omit relative pronouns. To provide clarity and to avoid ambiguity, use
  relative pronouns such as _that_ and _who_. For more information see
  [Optional pronouns](pronouns.md#optional-pronouns).

  Not recommended: Running in a hybrid environment means some of your processing
  happens on INF Use and other processing remains on-premises.

  Recommended: Running in a hybrid environment means that some of your
  processing happens on INF Use and other processing remains on-premises.

- Clarify antecedents. Using pronouns can get tricky when translators are
  working with small, unconnected strings of text. Help them out by making
  things as clear as possible. For example, if a pronoun is ambiguous, then
  replace it with the appropriate noun.

  Not recommended: If you use the term _green beer_ in an ad, then make sure
  it's targeted.

  Recommended: If you use the term _green beer_ in an ad, then make sure the ad
  is targeted.

- Use helper words. Helper words, such as _if_, _then_, and _of_, are frequently
  left out of conversational English. Use these words to avoid ambiguity.

## Be consistent

If you use a particular term for a particular concept in one place, then use
that exact same term elsewhere, including the same capitalization. If you use
different names for the same thing, translators might think you're referring to
different concepts, and thus might use different translations. Inconsistency in
terminology and phrasing can greatly increase translation costs, particularly
when translation memory and machine translations are used as first steps in
translation.

- Don't use the same word to mean different things. In particular, avoid using
  the same word as both a noun and a verb in close proximity. For examples of
  the multiple-meanings issue, see the word list entries for
  [once](word-list.md#once) and [since](word-list.md#since).
- Use standardized phrases for frequently used sentences, introductory phrases,
  and other common tasks. For examples, see [introducing links](link-text.md),
  [introducing output](code-samples.md#introducing-output), and
  [reviewing code samples](code-samples.md#reviewing-code-samples).
- Use standard English word order. Sentences follow the _subject + verb +
  object_ order.
- Use the conditional clause first. If you want to tell the audience to do
  something in a particular circumstance, mention the circumstance before you
  provide the instruction. For more information, see
  [Clause order](clause-order.md).
- Make list items consistent. Make list items parallel in structure. Be
  consistent in your capitalization and punctuation. For more information, see
  [lists](lists.md).
- Use consistent typographic formats. Use bold and italics consistently. Don't
  switch from using italics for emphasis to underlining. For more information,
  see [Typographic conventions](typographic-conventions.md).

## Be inclusive

You're not writing for your culture. Write with inclusivity in mind. For more
information, see [Writing inclusive documentation](inclusive-documentation.md).

- Don't be too culturally specific. In particular, don't refer to specific
  holidays, cultural practices, or sports unless you're certain they're known
  worldwide.
- Use a diverse set of example names. If you need to use people's names (for
  example, as email addresses), use a diverse set of names. For more
  information, see [Example domains and names](examples#names.md).
- Avoid colloquialisms, idioms, or slang. Phrases like _ballpark figure_, _back
  burner_ or _hang in there_ can be confusing and difficult to translate.
- Avoid culturally specific humor.

---

<small>Portions of this page are reproduced from work created and
[shared by Google](https://developers.google.com/readme/policies/) and used
according to terms described in the
[Creative Commons 4.0 Attribution License](https://creativecommons.org/licenses/by/4.0/).
For more information, refer to the
[original source page](https://developers.google.com/style/translation).</small>
