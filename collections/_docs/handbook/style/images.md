# Figures and other images

**Key Points:** Use SVG files or crushed PNG images; use the `<figure>` element;
don't use the `height` attribute; provide alt text if appropriate; use your
site's standard image styling; provide high-resolution images when practical;
don't repeat images on the same page unless necessary.

Use images only when they provide useful visual explanations of information that
is otherwise difficult to express with words, or for screenshots of UIs that are
important to the discussion.

## Creating and saving images

- To create a diagram, use any drawing tool.
- Don't use images of text, code samples, or terminal output. Use actual text.
- Prefer SVG files because SVGs stay sharp when you zoom in on the image. If you
  don't have an SVG file, then save your image as a PNG file unless you have a
  good reason to use a different format.
- Make your screenshots of windows look like real windows, usually windows from
  a recent version of macOS unless there's a good reason to use a different
  operating system. For example, include the window's title bar in the
  screenshot. And if a given window has a drop shadow, then include the drop
  shadow in the screenshot as well.
- Don't include personally identifying information (PII) in screenshots.

  If a source screenshot includes PII, hide it with a solid-color overlay with
  100% opacity. Don't rely on blurs, mosaic effects, or similar image-processing
  effects to obscure PII; such effects can be reversed to reveal the original
  information.

  If you're exporting an image to a format that can include information on
  separate layers (for example, PDF or TIFF), flatten the image on export.

## Text associated with images

There are differences between alt text, figure captions, and figure
descriptions.

Alt text

A concise description of the image that can replace the image in situations
where the image isn't visible, such as people using screen readers, people using
text-only browsers, or people who have a low-bandwidth internet connection. For
more information, see [alt attribute](https://wikipedia.org/wiki/Alt_attribute).

Figure caption

A description of the image that provides more information about the image.

Figure description

A textual representation of the figure. In other words, the information that is
conveyed in the image is captured in the text. A figure description allows a
person who can't view the displayed image to understand what the image is trying
to convey.

To include an image in your document, wrap your `<img>` element in a
`<[figure](https://html.spec.whatwg.org/multipage/semantics.md#the-figure-element)>`
element, with a
`<[figcaption](https://html.spec.whatwg.org/multipage/semantics.md#the-figcaption-element)>`,
figure description, and alt-text, if appropriate. The following example assumes
the figure description is on the same page as the figure.

Recommended (HTML version):

<figure id="emu-foot">
  <img src="/assets/images/emu-foot.svg"
    width="120"
    alt="An emu foot has three toes."
    longdescr="#descr-1">
  <figcaption><b>Figure 1.</b> Diagram of an emu's
leg with each bone labelled.</figcaption>
</figure>
<div id="descr-1">
<p>In figure 1, the following bones are labeled: femur, fibula, tibiotarsus, tarsometatarsus, and
phalanges.
</p>
</div>

Recommended (Markdown version):

!\[An emu foot has three toes.](/assets/images/emu-foot.svg){: width="120"}

\*\*Figure 1.\*\* Diagram of an emu's leg with each bone labeled.

In figure 1, the following bones are labeled: femur, fibula, tibiotarsus,
tarsometatarsus, and phalanges.

### Alt text

As shown in the preceding example, use an
`[alt](https://html.spec.whatwg.org/multipage/embedded-content.md#alt)`
attribute to provide a text alternative for the image, which is used by
assistive technologies, such as screen readers, and might appear if the image
cannot load. However, if the image is decorative (not informative) or it's
provided only as a visual aid for information that is already expressed in text,
then provide empty alternative text (`alt=""`) so it will be ignored by
assistive technologies. (If you exclude the `alt` attribute completely, then
screen readers might instead read the filename aloud.)

As per the
[HTML specification](https://html.spec.whatwg.org/dev/images.md#general-guidelines),
"the most general rule to consider when writing alternative text is the
following: the intent is that replacing every image with the text of its `alt`
attribute not change the meaning of the page." So if the alternative text is
redundant with surrounding text or it's not useful to visually impaired readers,
use the empty tag.

Consider the following when writing alt text:

- Don't include phrases like _Image of_ or _Photo of_.
- Include punctuation. When screen readers encounter punctuation, they pause
  before continuing.
- Use consistent alt text for repeated instances of an image, such as controls,
  status indicators, or icons that appear multiple times in your document.
- When possible, avoid using all-caps in alt text. Some screen readers read
  capital letters as each letter individually.
- Introduce diagrams in the text, not in the alt text.
- Don't use figure captions to replace alt text.
- Use full sentences.

### Figure captions

Figure captions are concise and comprehensive summaries of a figure or image.

- Use the form "<b>Figure number.</b> Description".
- Use punctuation in figure captions.
- When you refer to a figure, don't use spatial descriptions such as "the image
  below." Instead, mention it by number. For example: "... as shown in figure
  1." Don't capitalize the word _figure_ in a reference to a figure, except at
  the start of a sentence.
- Don't include the figure caption in a sentence referencing the figure.

### Figure descriptions

A figure description is a text alternative that presents the same information as
the figure. This description can accompany the figure or be included as a link
to a separate page that contains the description.

- Create a text alternative that conveys the same information as the figure.
- Use when a figure capture doesn't convey the purpose or complete information
  of the figure.
- Use punctuation in figure descriptions.

### Text in figures

In most cases, avoid embedding explanatory text in screenshot graphics; text
that's incorporated into a graphic hurts accessibility and searchability, and
increases localization costs if figures are localized. If you must embed text in
an image, then be sure to also provide the same information in a form that
people with visual disabilities can use, such as a figure description.

When you must include text in figures and images, use the following guidelines:

- Keep text brief. Avoid complete sentences and punctuation when possible.
- Don't embed figure descriptions or captions in the figure or image. Instead,
  put figure descriptions and captions in text following the figure.
- Don't create new abbreviations to condense text.
- Use sentence case. Follow guidelines for
  [capitalization for titles and headings](capitalization#capitalization-in-titles-and-headings_1.md).
- Use numbered callouts in figures to help you write a figure description, but
  don't use callouts for detailed annotations.
- Use full trademarked product names.

## High-resolution images

Modern browsers can use high-resolution images if they are available; this makes
the images look better on high-resolution displays.

To provide a high-resolution image, use the `<img>` element's `srcset` attribute
in addition to the standard `src` attribute. The `srcset` attribute lets you
specify different image assets for different screen resolutions. It accepts a
comma-delimited set of image URLs, with the target screen resolution specified
by a size qualifier: `1x` meaning the "standard" resolution, `2x` meaning
"double" the resolution, and so on.

If a web browser supports the `srcset` attribute, it selects an image from the
specified images that's an appropriate resolution for the current display. If
the browser doesn't support the `srcset` attribute, it uses the image in the
`src` attribute. Consequently, you must always still include the `src`
attribute.

For example, to provide both a standard resolution image and a double-resolution
image, add a `srcset` attribute and specify both `1x` and `2x` image assets:

&lt;img src="/assets/images/skateboard.png"
**srcset="/assets/images/skateboard.png 1x, /assets/images/skateboard_2x.png
2x"** width="375" alt="" />

- The `width` attribute matches the CSS pixel size used for the page dimensions.
  (The height is automatically calculated based on the width and the image's
  proportions; _don't_ state it explicitly.)
- Set the `src` attribute to point to the standard-resolution (`1x`) image,
  _not_ the `2x` version. (Almost everyone who has a high-resolution screen also
  has a modern browser that can recognize the `srcset` attribute. The `src`
  attribute is mainly used by older browsers on low-resolution devices, which
  should download the smaller, low-resolution image.) Even if your original
  image is the higher-resolution image, set the `src` attribute to use the
  standard-resolution version; don't force a reader using a low-resolution
  screen to download a graphic that's higher-resolution than they can view.
- The filename for the double-resolution image (in this case,
  `skateboard_2x.png`) can be anything—it's the "`2x`" value following the
  filename that informs the browser which resolution the file is. But it's a
  good idea to use a filename of the form `basename_2x.extension` to make clear
  to human readers that it's a double-resolution version of
  `basename.extension`.
- The double-resolution image must be exactly twice the width and height of the
  standard image, give or take a pixel. (For example, it's okay for the
  double-resolution image to be 875x500 and the standard size to be 438x250.)
- Don't scale up an existing `1x` image to make the `2x` version. If all you
  have is the `1x` version, then use it alone. But if you're starting with a
  high-resolution image (at `2x` resolution or better), then you can scale it
  down to appropriate dimensions for `1x` and `2x`.
- Currently, only an additional `2x` image is necessary, but someday screen PPI
  may increase further. So the `srcset` attribute supports further alternative
  sizes, each specified by the appropriate multiplier, such as `3x` or `4x`.
- A browser that supports the `srcset` attribute uses only the images provided
  in that attribute—it ignores the `src` attribute. So specify all available
  image resolutions in the `srcset` attribute.

**Note:** If you frequently revise an image, then you can use the `2x` image for
both the `src` and `srcset` attributes, rather than maintaining multiple sizes
of the image. If things stabilize and you no longer need to revise the image,
then you can add a `1x` version.

For more information, see the HTML specification for the
`<[img](https://html.spec.whatwg.org/multipage/embedded-content.md#the-img-element)>`
element.

## Laying out images on a page

- Don't try to place an image manually; for example, don't use a `style`
  attribute or other workarounds to control the image's left/right justification
  or the margins around the image.

- Don't make your image too small. It's fine for an image to take up the full
  width of a page.

- Consider how the image will look when printed out.

- In general, don't use an image that's wider than the column it appears in. On
  [developers.android.com](https://developers.android.com), for example, the
  main-body column is 856px wide, so use images that are no wider than that. In
  that context, the high-resolution 2x version of the image should be no wider
  than 1712px.

  - Screenshots at full resolution often take up too much space on the page, so
    you may have to resize them.
  - If the graphics were created by someone else (for example, a designer on the
    team you're supporting), it may be fairly trivial for them to provide you
    with images at the appropriate size. If the images they provide are wider
    than 856px, ask the designer if they can provide the relevant graphics as
    856px/1712px pairs.

- Don't link to the figure from within the same page unless it's a very long
  page and you're linking to it from quite far away on the page.

- Don't center the image on the page.

- Don't put the `<img>` inside a `<p>`.

To place the image inline (align left):

<figure id="descriptive-id" class="attempt-left">
<img src="" alt="" width="XXX" />
<figcaption>
  <b>Figure 1.</b> Description of figure
</figcaption>
</figure>

To align right:

<figure id="descriptive-id" class="attempt-right">
  <img src="" alt="" width="XXX" />
  <figcaption>
    <b>Figure 2.</b> Description of figure
  </figcaption>
</figure>

---

<small>Portions of this page are reproduced from work created and
[shared by Google](https://developers.google.com/readme/policies/) and used
according to terms described in the
[Creative Commons 4.0 Attribution License](https://creativecommons.org/licenses/by/4.0/).
For more information, refer to the
[original source page](https://developers.google.com/style/images).</small>
