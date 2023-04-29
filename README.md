# stretch-font
The utility dynamically adjusts the font size depending on the width of the parent element.

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

#### For HTML
```html
...
<link rel="stylesheet" href="https://unpkg.com/stretch-font/style.css">
<script src="https://unpkg.com/stretch-font/stretch-font.min.js"></script>
<script>stretchFont()</script>
...
```

## Options
### Call the rebuild in ES
```javascript
import stretchFont from 'stretch-font'

// Init
const { rebuild } = stretchFont()

// Custom call
self.addEventListener('click', rebuild) // Example
```

### You can import style in tag `<style>`
```html
<style scoped>
@import "stretch-font/style.css";
</style>
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
