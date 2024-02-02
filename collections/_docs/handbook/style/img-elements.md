# URLs for images

**Key Point:** Use a site-root-relative URL for images served from the same
domain as your page.

When you're including an image that's served from the same domain as your page,
use a site-root-relative URL (starting with "/"). Use this URL format (starting
from the site root) even if the image is in the same directory as the page that
includes it.

### HTML

Insert the URL in the `src` attribute of your `<img>` element:

<img src="/shared/images/arrow-24.png" />

### Markdown

Insert the URL in parentheses after the image's alt text:

!\[Alt text description of arrow image](/shared/images/arrow-24.png)

**Note:** There are many valid linking styles. This guideline isn't a general
statement about best practices for URLs in all contexts—it's just our house
style.

---

<small>Portions of this page are reproduced from work created and
[shared by Google](https://developers.google.com/readme/policies/) and used
according to terms described in the
[Creative Commons 4.0 Attribution License](https://creativecommons.org/licenses/by/4.0/).
For more information, refer to the
[original source page](https://developers.google.com/style/img-elements).</small>
