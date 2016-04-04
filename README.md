# VTT jQuery Slider
A responsive and a11y friendly jQuery slider.

## Usage

1. Include jQuery:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
	```

2. Include plugin's code:

	```html
	<script src="path/to/jquery.slider.js"></script>
	```

3. Call the plugin:

	```javascript
	$("#element").slider({
		// config
	});
	```

## Structure

The basic structure of the project is given in the following way:

```
├── demo/
│   └── index.html
├── dist/
│   ├── jquery.slider.js
│   └── jquery.slider.min.js
├── src/
│   └── jquery.slider.js
├── .gitignore
├── bower.json
├── gulpfile.js
└── package.json
```

#### [demo/](demo/)

Contains a simple HTML file to demonstrate your plugin.

#### [dist/](dist/)

This is where the generated files are stored once Gulp runs.

#### [src/](src/)

Contains the JavaScript files responsible for your plugin.

#### [.gitignore](.gitignore)

List of files that we don't want Git to track.

> Check this [Git Ignoring Files Guide](https://help.github.com/articles/ignoring-files) for more details.

#### [bower.json](gulpfile.js)

Specify all dependencies loaded via Bower.

> Check [bower.io](http://bower.io//) if you haven't heard about this project yet.

#### [gulpfile.js](gulpfile.js)

Contains all automated tasks using Gulp.

> Check [gulpjs.com](http://gulpjs.com/) if you haven't heard about this project yet.

#### [package.json](package.json)

Specify all dependencies loaded via Node.JS.

> Check [NPM](https://npmjs.org/doc/json.html) for more details.

## History

Check [Releases](../../releases) for detailed changelog.

