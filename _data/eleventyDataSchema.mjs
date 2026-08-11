import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
// Eleventy calls whatever a data file exports and keeps the result, so this
// has to hand back the validator rather than be it. Exporting the validator
// directly meant Eleventy ran it once over the global data and stored the
// undefined it returned, leaving every page unvalidated.
export default () => (data) => {
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
