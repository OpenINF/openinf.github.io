import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

/**
 * Checks one page's data, and is handed every page's in turn by Eleventy.
 * @param {object} data The data cascade for a single template.
 */
const validate = (data) => {
  // Draft content, validate `draft` front matter
  const result = z
    .object({
      // `.optional()` rather than `.or(z.undefined())`: as of zod 4 a union
      // with `undefined` no longer makes the key itself optional, so pages
      // without `draft` front matter were rejected as "expected nonoptional".
      draft: z.boolean().optional(),
    })
    .safeParse(data);

  if (result.error) {
    throw fromZodError(result.error);
  }
};

// A file in `_data/` is named after the key it provides, and Eleventy calls
// whatever it exports to find the value. So this exports a function that
// returns the validator; exporting the validator itself made Eleventy run it
// once, against the global data, and store the undefined that came back.
export default () => validate;
