# VTT jQuery Boilerplate

### A jump-start for VTT jQuery plugins development

## Usage

1. Include jQuery:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
	```

2. Include plugin's code:

	```html
	<script src="path/to/jquery.plugin.js"></script>
	```

3. Call the plugin:

	```javascript
	$("#element").MODULENAME_LOWERCASE({
		// config
	});
	```

## Structure

The basic structure of the project is given in the following way:

```
├── demo/
│   └── index.html
├── dist/
│   ├── jquery.plugin.js
│   └── jquery.plugin.min.js
├── src/
│   └── jquery.plugin.js
├── .gitignore
├── bower.json
├── gulpfile.js
└── package.json
```

#### [demo/](https://github.com/libeo-vtt/vtt-jquery-boilerplate/tree/master/demo)

Contains a simple HTML file to demonstrate your plugin.

#### [dist/](https://github.com/libeo-vtt/vtt-jquery-boilerplate/tree/master/dist)

This is where the generated files are stored once Gulp runs.

#### [src/](https://github.com/libeo-vtt/vtt-jquery-boilerplate/tree/master/src)

Contains the JavaScript files responsible for your plugin.

#### [.gitignore](https://github.com/libeo-vtt/vtt-jquery-boilerplate/tree/master/.gitignore)

List of files that we don't want Git to track.

> Check this [Git Ignoring Files Guide](https://help.github.com/articles/ignoring-files) for more details.

#### [bower.json](https://github.com/libeo-vtt/vtt-jquery-boilerplate/tree/master/gulpfile.js)

Specify all dependencies loaded via Bower.

> Check [bower.io](http://bower.io//) if you haven't heard about this project yet.

#### [gulpfile.js](https://github.com/libeo-vtt/vtt-jquery-boilerplate/tree/master/gulpfile.js)

Contains all automated tasks using Gulp.

> Check [gulpjs.com](http://gulpjs.com/) if you haven't heard about this project yet.

#### [package.json](https://github.com/libeo-vtt/vtt-jquery-boilerplate/tree/master/package.json)

Specify all dependencies loaded via Node.JS.

> Check [NPM](https://npmjs.org/doc/json.html) for more details.

## History

Check [Releases](https://github.com/libeo-vtt/vtt-jquery-boilerplate/releases) for detailed changelog.

