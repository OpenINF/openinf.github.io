# Filenames and file types

## Naming guidelines

**Key Point:** Use all-lowercase, and separate words with hyphens.

Make file and directory names lowercase. In general, separate words with
hyphens, not underscores. Use only standard ASCII alphanumeric characters in
file and directory names.

### Exceptions for consistency

If you're adding to a directory where everything else already uses underscores,
and it's not feasible to change everything to hyphens, it's okay to use
underscores to stay consistent.

For example, if the directory already has `lesson_1.jd`, `lesson_2.jd`, and
`lesson_3.jd`, it's okay to add your new file as `lesson_4.jd` instead of
`lesson-4.jd`. However, in all other situations, use hyphens.

Recommended: `avoiding-cliches.jd`

Sometimes OK: `avoiding_cliches.jd`

Not recommended: `avoidingcliches.jd`, `avoidingCliches.jd`,
`avoiding-clichés.jd`

### Other exceptions

It's okay to have some inconsistency in filenames if it can't otherwise be
avoided. For example, sometimes tools that generate reference documentation
produce file names based on different style requirements or based on the design
and naming conventions of the product or API itself. In those cases, it's okay
to make exceptions for those files.

## Referring to file types

**Key Point:** Use the formal file type name, not the filename extension.

When you're discussing a file type, use the formal name of the type. (The file
type name is often in all caps, because many file type names are acronyms or
initialisms.) Do not use the filename extension to refer generically to the file
type.

Recommended: a PNG file

Not recommended: a `.png` file

Recommended: a Bash file

Not recommended: an `.sh` file

The following table lists examples of filename extensions and the corresponding
file type names to use.

Extension

File type name

`.csv`

CSV file

`.exe`

executable file

`.gif`

GIF file

`.img`

disk image file

`.jar`

JAR file

`.jpg`, `.jpeg`

JPEG file

`.json`

JSON file

`.pdf`

PDF file

`.png`

PNG file

`.ps`

PowerShell file

`.py`

Python file

`.sh`

Bash file

`.sql`

SQL file

`.svg`

SVG file

`.tar`

tar file

`.txt`

text file

`.yaml`

YAML file

`.zip`

zip file

---

<small>Portions of this page are reproduced from work created and
[shared by Google](https://developers.google.com/readme/policies/) and used
according to terms described in the
[Creative Commons 4.0 Attribution License](https://creativecommons.org/licenses/by/4.0/).
For more information, refer to the
[original source page](https://developers.google.com/style/file-names).</small>
