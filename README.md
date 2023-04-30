# stretch-font
The **Utility Dynamically** 🤩 adjusts the **font size** depending on the width of the parent element.

<hr>

This plugin was created in order not to write CSS [Media query] rules for each screen when you have many languages and you can switch them dynamically.

The sentence itself looks like a **"title"**. Text size conversions to only one line ☝🏻

### Support
- 🔥 Hot text replacement (i18n)
- 🖥 Any change in the width of the parent element
- 🔄 Rotate
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
stretchFont()
```

#### OR for HTML
```html
<link rel="stylesheet" href="https://unpkg.com/stretch-font/style.css">
<script src="https://unpkg.com/stretch-font/stretch-font.min.js"></script>
<script>stretchFont()</script>
```

### Next you just need to add a class to any element
```html
<div class="stretch-font">Hello world</div>
```

## Options

### useStretchFont(className, root)
- className = "stretch-font"
- root = document

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
