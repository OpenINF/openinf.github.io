# Dates and times

**Key Point:** In general, express months as words and use the format
day-of-week, month day, year (example: Wednesday, January 31, 1993). Express
time with a 12-hour clock, capitalize AM and PM, and always include the timezone
for real times.

Expressing dates and times in a clear and unambiguous way helps support
[writing for a global audience](translation.md) and reduces confusion.

## Expressing times

In general, use the following guidelines to format expressions of time:

- When describing real events at real times, always include the timezone.
- Use the 12-hour clock, except if required to use a 24-hour time, such as when
  documenting features that use 24-hour time.
- Use hyphens in time ranges. Don't add spaces before or after the hyphens.<br>
  Recommended: 5-10 minutes ago.
- Capitalize AM and PM, and leave one space between it and the time.<br>
  Recommended: 3:45 PM.
- Remove the minutes from round hours.<br> Recommended: 3 PM.

## Expressing dates

In general, spell out the names of months and days of the week in full. Give the
full four-digit year, not a two-digit abbreviation. If including the day of the
week, add it before the month as follows: day-of-week, month day, year.

#### Example

Recommended: January 19, 2017

### Partial dates and abbreviations

When giving only the month and year, don't use a comma.

#### Example

Recommended: She was hired in January 2017.

In most cases, don't abbreviate the day of the week or the month. However, when
conserving space, such as in a heading or table, it's okay to abbreviate the
month and the day of the week to their three-letter abbreviations. Capitalize
the first letter and do not add a period at the end of the abbreviation.

If you abbreviate, do so for the entire date. Don't mix written-out forms with
abbreviated forms in the same date.

Be consistent in where you apply abbreviations throughout your docset. For
example, if you choose to abbreviate in table cells, do so in all table cells.

Not Recommended: Mon, September 3, 2018

Recommended: Mon, Sep 3, 2018

### Dates in the middle of a sentence

When a month day, year date appears in the middle of a sentence, add a comma
after the year.

However, if the date in the middle of the sentence consists of the month and
year only, don't use a comma.

#### Examples

Recommended: The January 19, 2017, release of ...

Recommended: The January 2017 release of ...

### Why we prefer dates written out

In general, don't express months as numbers unless you don't have the option (in
which case, see
[numeric-only date format](dates-times.md#numeric-only-date-format)). Different
regions of the world put parts of the date in a different order for numeric
dates. For example, a date written as 04/05/09 means different things in
different regions. For example:

- In the UK, 04/05/09 means May 4, 2009, where the order is usually day, month,
  and then year.
- In the USA, 04/05/09 means April 5, 2009, where the order is usually month,
  day, and then year.
- In some other parts of the world, 04/05/09 means May 9, 2004. Some regions
  write the year first, followed by the month and day.

For this reason, we recommend always using words to express dates. Expressing
dates in numbers only (using slashes, periods, or hyphens as separators) can be
confusing.

#### Examples

Not recommended: 02.12.2017

Not recommended: 12/02/2017

Recommended: February 12, 2017

Recommended: Sunday, February 12, 2017

### Numeric-only date format

If you must express a date in numerical date format, use the format yyyy-mm-dd,
and separate the elements using hyphens. This conforms to
[ISO 8601 international standards](https://en.wikipedia.org/wiki/ISO_8601) for
numerical date format.

Additionally, if you have a choice of what date to write (such as in a fictional
example), then chose a calendar day greater than 12 to differentiate it from the
month.

#### Examples

Not recommended: 04/06/2017

Recommended: 2017-04-15

---

<small>Portions of this page are reproduced from work created and
[shared by Google](https://developers.google.com/readme/policies/) and used
according to terms described in the
[Creative Commons 4.0 Attribution License](https://creativecommons.org/licenses/by/4.0/).
For more information, refer to the
[original source page](https://developers.google.com/style/dates-times).</small>
