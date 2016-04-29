# jQuery Slider Plugin
Accessible, responsive and configurable jQuery slider plugin

## Usage

1. Include jQuery:

	```html
    <script src="path/to/jquery.min.js"></script>
	```

2. Include plugin's code:

	```html
	<script src="path/to/jquery.slider.min.js"></script>
	```

3. Call the plugin:

	```javascript
	// Default configuration
	$('.slider-element').slider();

	// Custom configuration
	$('.slider-element').slider({
		displayedSlides: 1,
		slidesGutter: 0
	});
	```

## Downloads

* [Source](https://raw.githubusercontent.com/libeo-vtt/jquery-slider/master/dist/jquery.slider.js)
* [Minified version](https://raw.githubusercontent.com/libeo-vtt/jquery-slider/master/dist/jquery.slider.min.js)

## Configuration

#### `displayedSlides`

> **Type:** Integer<br>
**Default value:** 4

Number of displayed slides

---

#### `slidesGutter`

> **Type:** Integer<br>
**Default value:** 20

Margin between slides

---

#### `createNavigationArrows`

> **Type:** Boolean<br>
**Default value:** true

Create a previous/next navigation

---

#### `createNavigationPages`

> **Type:** Boolean<br>
**Default value:** true

Create a paginated navigation

---

#### `displayPageNumber`

> **Type:** Boolean<br>
**Default value:** true

Display pages number in navigation

---

#### `displayFirstActiveContent`

> **Type:** Boolean<br>
**Default value:** true

---

#### `swipe`

> **Type:** Boolean<br>
**Default value:** true

Activate swipe support on mobile devices

---

#### `autoplay`

> **Type:** Boolean<br>
**Default value:** true

---

#### `autoplayDelay`

> **Type:** Integer<br>
**Default value:** 3000

---

#### `infiniteLoop`

> **Type:** Boolean<br>
**Default value:** true

---

#### `animationSpeed`

> **Type:** Integer<br>
**Default value:** 300

---

### Callbacks

#### `onActiveSlideUpdateBefore`

> **Type:** Function<br>
**Default value:** $.noop

Called before active content is updated

---

#### `onActiveSlideUpdateAfter`

> **Type:** Function<br>
**Default value:** $.noop

Called after active content is updated

---

#### `onChangeSlideBefore`

> **Type:** Function<br>
**Parameters:** direction<br>
**Default value:** $.noop

Called before changing slide

---

#### `onChangeSlideAfter`

> **Type:** Function<br>
**Parameters:** direction<br>
**Default value:** $.noop

Called after changing slide

---

#### `onLayoutUpdateBefore`

> **Type:** Function<br>
**Default value:** $.noop

Called before the slider layout is updated

---

#### `onLayoutUpdateAfter`

> **Type:** Function<br>
**Default value:** $.noop

Called after the slider layout is updated

---

### Public Methods (API)

#### `.prevSlide()`

#### `.nextSlide()`

#### `.startAutoplay()`

#### `.stopAutoplay()`

```javascript
var slider = $('.element').slider();

slider.prevSlide();
slider.nextSlide();
slider.startAutoplay();
slider.stopAutoplay();
```

---

### Labels

```javascript
labels: {
    navigationPrev: 'Précédent',
    navigationPrevAria: 'La diapositive précédente est affichée.',
    navigationNext: 'Suivant',
    navigationNextAria: 'La diapositive suivante est affichée.',
    navigationPage: 'Afficher la diapositive',
    navigationPageActive: 'Diapositive présentement affichée',
    autoplayButton: 'Mettre le carrousel en marche',
    autoplayButtonPause: 'Mettre le carrousel en pause',
}
```

### Classes

```javascript
classes: {
    sliderOverflow: 'slider-overflow',
    sliderWrapper: 'slider-wrapper',
    sliderContainer: 'slider-container',
    slide: 'slide',
    sliderActiveContentTrigger: 'slider-active-content-trigger',
    sliderNavigation: 'slider-navigation',
    navigationPrev: 'slider-navigation-prev',
    navigationNext: 'slider-navigation-next',
    navigationArrow: 'slider-navigation-arrows',
    navigationPage: 'slider-navigation-pages',
    ariaText: 'aria-text',
    ariaTextActive: 'aria-text-active',
    ariaHiddenBox: 'aria-hidden-box',
    autoplayButton: 'slider-autoplay',
    states: {
        active: 'is-active'
    }
}
```

## History

Check [Releases](../../releases) for detailed changelog.

