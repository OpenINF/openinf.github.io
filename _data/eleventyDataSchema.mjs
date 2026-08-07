import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
export default function (data) {
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
}
