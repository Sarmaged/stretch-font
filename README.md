<h3 align="center">
  <img width="300" alt="stretch-font logo" src="https://lh3.googleusercontent.com/drive-viewer/AFGJ81r-pDRRmxLwqLVLWFXtdhL9B0bgj1YHe6otqqMJhc3gwexSm9TfPz8owrTSzPlkMFmW_zZewHzDJYp43QBhHtsYa1X6iA=s2560" />
</h3>

# stretch-font
The **Utility Dynamically** 🤩 adjusts the **font size** depending on the width of the parent element.

<hr>

This plugin was created in order not to write CSS [Media query] rules for each screen when you have many languages and you can switch them dynamically.

### Support
- 🤩 Watches when elements are added
- 🔥 Hot text replacement (i18n)
- 🖥 Any change in the width of the parent element
- 🔄 Rotate
- 📝 Multiline
- ✅ CSS Animation
- ✅ CSS Transition

<hr>

## Installation
```bash
npm install stretch-font
```
```bash
yarn add stretch-font
```

## Simple usage

#### For ES Module
```javascript
import 'stretch-font/style.css'
import stretchFont from 'stretch-font'

// Run only once if you didn't use "root"
// If you've used root many times, it should be different
stretchFont()
```

#### OR for HTML
```html
<link rel="stylesheet" href="https://unpkg.com/stretch-font/style.css">
<script src="https://unpkg.com/stretch-font/stretch-font.min.js"></script>
<script>stretchFont()</script>
```

## Options
### Simple usage
```html
<div class="stretch-font">Hello world</div>
```


### useStretchFont(root, className)
```
// defaults

root = document
className = "stretch-font"
```

### data-stretch
```html
<div class="stretch-font" data-stretch>
  The font is stretched to the width of the block
</div>
```
This is visible when you work with (i18n).
When you change the language, the text takes on the original block width and is not stretched. In this case, the font may increase or decrease depending on how long the text will be.

<p style="color: #FF7B42">⚠️ Do not apply styles and classes to the "stretch-font" block</p>

```html
🚫 Incorrect
<div class="stretch-font" style="font-size: 100px"> ... </div>

✅ Correct
<div style="font-size: 60px;">
  <div class="stretch-font">
    ...
  </div>
</div>
```
```html
🚫 Incorrect
<div class="stretch-font fz100">
  ... class fz100 - it's font-size: 100px ...
</div>

✅ Correct
<div class="fz100">
  <div class="stretch-font">
    ...
  </div>
</div>
```

### data-stretch-min="n"
```html
<div class="stretch-font" data-stretch-min="10">
  Font cannot be less than 10px
</div>
```

### data-stretch-max="n"
```html
<div class="stretch-font" data-stretch-max="20">
  Font cannot be larger than 20px
</div>
```

## License
Distributed under the MIT License. See `LICENSE` for more information.
