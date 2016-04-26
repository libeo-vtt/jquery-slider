// Slider jQuery Plugin
// A responsive and a11y friendly jQuery slider.

(function($) {
    var Slider = function(element, options) {
        this.slider = $(element);

        // Default module configuration
        this.defaults = {
            displayedSlides: 4,
            slidesMargin: 20,
            createNavigation: true,
            navigationType: 'both',
            displayDotsNumber: true,
            autoCenterActiveSlide: true,
            swipe: true,
            autoplay: false,
            autoplayDelay: 3000,
            changeSlideLoop: true,
            animationSpeed: 300,
            beforeClone: $.noop,
            afterClone: $.noop,
            beforeChangeSlide: $.noop,
            afterChangeSlide: $.noop,
            beforeUpdateLayout: $.noop,
            afterUpdateLayout: $.noop,
            labels: {
                navigationPrev: 'Précédent',
                navigationNext: 'Suivant',
                navigationDot: 'Afficher la diapositive ',
                navigationDotActive: 'Diapositive présentement affichée',
                autoplayButton: 'Mettre le carrousel en marche',
                autoplayButtonPause: 'Mettre le carrousel en pause'
            },
            classes: {
                sliderOverflow: 'slider-overflow',
                sliderWrapper: 'slider-wrapper',
                sliderContainer: 'slider-container',
                slide: 'slide',
                sliderActiveContent: 'slider-activecontent',
                sliderTrigger: 'slide-trigger',
                sliderTriggerContent: 'slide-trigger-content',
                sliderNavigation: 'slider-navigation',
                navigationPrev: 'slider-navigation-prev',
                navigationNext: 'slider-navigation-next',
                navigationArrow: 'slider-navigation-arrows',
                navigationDot: 'slider-navigation-dots',
                ariaText: 'aria-text',
                ariaTextActive: 'aria-text-active',
                ariaHiddenBox: 'aria-hidden-box',
                autoplayButton: 'slider-autoplay',
                states: {
                    active: 'is-active'
                }
            }
        };

        // Merge default classes with window.project.classes
        this.classes = $.extend(true, this.defaults.classes, (window.project ? window.project.classes : {}));

        // Merge default labels with window.project.labels
        this.labels = $.extend(true, this.defaults.labels, (window.project ? window.project.labels : {}));

        // Merge default config with custom config
        this.config = $.extend(true, this.defaults, options || {});

        // Get the sliders wrapper
        this.sliderWrapper = this.slider.find('.' + this.classes.sliderWrapper);

        // Get the sliders container
        this.sliderContainer = this.slider.find('.' + this.classes.sliderContainer);

        // Get the slides
        this.slides = this.slider.find('.' + this.classes.slide);

        // Initialize activeSlideIndex
        this.activeSlideIndex = 0;

        // Get displayed slides number
        this.displayedSlides = this.config.displayedSlides;

        // Initialize mouse hover state
        this.mouseHover = false;

        // Initialize animated state
        this.animated = false;

        // Bind events
        this.bindEvents();

        if (this.slides.length > this.config.displayedSlides) {
            // Navigation initialization
            if (this.config.createNavigation) {
                this.createNavigation(this.config.navigationType);
            }

            // Autoplay initialization
            if (this.config.autoplay) {
                this.autoplay();
            }

            // Swipe navigation initialization
            if (this.config.swipe) {
                this.swipe();
            }
        }

        this.init();
    };

    $.extend(Slider.prototype, {

        // Component initialization
        init: function() {
            // Layout initialization
            this.initLayout(this.config.displayedSlides);

            this.createAriabox();

            // Create active content wrapper
            if (this.isActiveContent()) {
                var content = this.slides.first().find('.' + this.classes.sliderTriggerContent).clone();
                this.slider.prepend('<div class="' + this.classes.sliderContent + '"></div>');
                this.updateActiveSlideContent(content);
                // Auto center active slide
                if (this.config.autoCenterActiveSlide === true) {
                    this.slider.find('.' + this.classes.sliderActiveContent).css('text-align', 'center');
                }
            }
        },

        // Layout initialization
        initLayout: function() {
            var slideWidth = 100 / this.slides.length,
                slideWidthCalc = this.config.slidesMargin / this.slides.length * this.slides.length,
                slidesCSS = 'float: left;' +
                'position: relative;' +
                'width: ' + slideWidth + '%;' +
                'width: calc(' + slideWidth + '% - ' + slideWidthCalc + 'px);';

            // Callback
            this.config.beforeUpdateLayout();

            // Add necessary css for the slider
            this.sliderWrapper.css({
                'position': 'relative',
                'overflow': 'hidden',
                'margin-left': this.config.slidesMargin / 2 * -1 + 'px',
                'margin-right': this.config.slidesMargin / 2 * -1 + 'px'
            });

            // Create slider overflow wrapper
            this.sliderWrapper.wrap('<div class="' + this.classes.sliderOverflow + '"></div>');
            this.slider.find('.' + this.classes.sliderOverflow).css('overflow', 'hidden');

            this.sliderContainer.css({
                'position': 'relative',
                'left': '0',
                'width': this.slides.length / this.displayedSlides * 100 + '%'
            });

            this.slides.attr('style', slidesCSS).find('> a').css('display', 'block');

            // Add margin to all slides
            this.slides.css({
                'margin-left': this.config.slidesMargin / 2 + 'px',
                'margin-right': this.config.slidesMargin / 2 + 'px'
            });

            // Disable focus on hidden slides
            this.slides.slice(this.displayedSlides).find(':focusable').attr('tabindex', '-1');

            // Callback
            this.config.afterUpdateLayout();
        },

        // Bind events with actions
        bindEvents: function() {
            this.slider.hover($.proxy(function() {
                this.mouseHover = true;
            }, this), $.proxy(function() {
                this.mouseHover = false;
            }, this));

            // Function called each time the sliderTrigger element is clicked
            if (this.isActiveContent()) {
                this.slider.find('.' + this.classes.sliderTrigger).on('click', $.proxy(function(e) {
                    var content = $(e.currentTarget).parents('.' + this.classes.slide).find('.' + this.classes.sliderTriggerContent).clone();
                    this.updateActiveSlideContent(content);
                    e.prevent();
                }, this));
            }

            // Detect keyboard navigation
            $(document).on('keyboardnavigation', $.proxy(function() {
                // Stop autoplay
                this.stopAutoplay();
            }, this));
        },

        // Create navigation
        createNavigation: function(type) {
            // Clear existing navigation
            this.slider.find('.' + this.classes.sliderNavigation).remove();

            // Create navigation wrapper
            this.sliderWrapper.after('<div class="' + this.classes.sliderNavigation + ' clearfix"></div>');

            // Get navigation wrapper obejct
            this.sliderNavigation = this.slider.find('.' + this.classes.sliderNavigation);

            // Add navigation type class
            this.sliderNavigation.addClass('is-' + this.classes.sliderNavigation + '-' + type);

            // Arrows navigation type
            if (type === 'arrows') {
                this.createArrowsNavigation();
            }
            // Dots navigation type
            else if (type === 'dots') {
                this.createDotsNavigation();
            }
            // Both navigation type
            else {
                this.createArrowsNavigation();
                this.createDotsNavigation();
            }
        },

        // Create arrows navigation
        createArrowsNavigation: function() {
            var previousButton = '<button class="' + this.classes.navigationPrev + '"><span class="visuallyhidden ' + this.labels.aria + '">' + this.labels.navigationPrev + '</span></button>',
                nextButton = '<button class="' + this.classes.navigationNext + '"><span class="visuallyhidden ' + this.labels.aria + '">' + this.labels.navigationNext + '</span></button>';

            // Create navigation wrapper
            this.sliderNavigation.append('<div class="' + this.classes.navigationArrow + '-wrapper"></div>');

            // Append each arrows
            this.sliderNavigation.find('.' + this.classes.navigationArrow + '-wrapper').append(previousButton, nextButton);

            // Get previous and next buttons
            this.navigationPrevious = this.sliderNavigation.find('.' + this.classes.navigationPrev);
            this.navigationNext = this.sliderNavigation.find('.' + this.classes.navigationNext);

            if (this.config.navigationType === 'both') {
                this.navigationPrevious.attr('aria-hidden', 'true');
                this.navigationNext.attr('aria-hidden', 'true');
            }

            this.bindEventsArrowsNavigation();
        },

        // Bind events for the arrows navigation
        bindEventsArrowsNavigation: function() {
            // Bind previous arrow event
            this.navigationPrevious.on('click', $.proxy(function(e) {
                this.navigationTypeTriggered = 'arrows';
                this.changeSlide(this.activeSlideIndex - 1);
                this.navigationNext.removeClass(this.classes.states.active);
                $(e.currentTarget).addClass(this.classes.states.active);

                // Update hidden aria box
                this.updateAriabox('La diapositive précédente est affichée.');

                // Stop autoplay
                this.stopAutoplay();
            }, this));

            // Bind next arrow event
            this.navigationNext.on('click', $.proxy(function(e) {
                this.navigationTypeTriggered = 'arrows';
                this.changeSlide(this.activeSlideIndex + 1);
                this.navigationPrevious.removeClass(this.classes.states.active);
                $(e.currentTarget).addClass(this.classes.states.active);

                // Update hidden aria box
                this.updateAriabox('La diapositive suivante est affichée.');

                // Stop autoplay
                this.stopAutoplay();
            }, this));
        },

        // Create dots navigation
        createDotsNavigation: function() {
            var dot = '<button class="' + this.classes.navigationDot + '"><span class="visuallyhidden ' + this.labels.aria + '"></span></button>';

            // Create navigation wrapper
            this.sliderNavigation.append('<div class="' + this.classes.navigationDot + '-wrapper"></div>');

            // Append each dots
            for (var i = 0; i < this.slides.length / this.displayedSlides; i++) {
                this.sliderNavigation.find('.' + this.classes.navigationDot + '-wrapper').append(dot);
            }

            // Get dots elements
            this.navigationDots = this.sliderNavigation.find('.' + this.classes.navigationDot);

            // Add aria text for each dot
            this.navigationDots.each($.proxy(function(index, el) {
                // Show dots number
                if (this.config.displayDotsNumber === true) {
                    $(el).find('.' + this.labels.aria).text(this.labels.navigationDot).after(index + 1);
                }
                // Don't show dots number
                else {
                    $(el).find('.' + this.labels.aria).text(this.labels.navigationDot + (parseInt(index) + 1));
                }
            }, this));

            // Initialize first dot button
            this.navigationDots.eq(0).addClass(this.classes.states.active).append('<span class="visuallyhidden ' + this.classes.ariaTextActive + '">' + this.labels.navigationDotActive + '</span>');

            this.bindEventsDotsNavigation();
        },

        // Bind events for the dots navigation
        bindEventsDotsNavigation: function() {
            // Get dots elements
            this.navigationDots = this.sliderNavigation.find('.' + this.classes.navigationDot);

            // Bind click events
            this.navigationDots.on('click', $.proxy(function(e) {
                this.navigationTypeTriggered = 'dots';
                var index = $(e.currentTarget).index() - $(e.currentTarget).parent().find('.slider-navigation-prev, .slider-navigation-next').length;
                this.changeSlide(index * this.displayedSlides);
                this.navigationDots.removeClass(this.classes.states.active);
                $(e.currentTarget).addClass(this.classes.states.active);

                // Stop autoplay
                this.stopAutoplay();
            }, this));
        },

        swipe: function() {
            this.detectswipe(this.slider, $.proxy(function(direction) {
                // Stop autoplay
                this.stopAutoplay();

                if (direction === "left") {
                    this.changeSlide(this.activeSlideIndex + 1);
                } else {
                    this.changeSlide(this.activeSlideIndex - 1);
                }

            }, this));
        },

        // Initialize autoplay
        autoplay: function() {
            this.createAutoplayButton();

            this.isAutoplay = true;
            this.toggleAutoplayText();

            this.autoplayInterval = setInterval($.proxy(function() {
                if (!this.mouseHover) {
                    this.changeSlide(this.activeSlideIndex + 1);
                }
            }, this), this.config.autoplayDelay);

        },

        // Create autoplay button
        createAutoplayButton: function() {
            var button = '<button class="' + this.classes.autoplayButton + ' ' + this.classes.states.active + '"><span class="">' + this.labels.autoplayButton + '</span></button>';

            // Create button
            if (this.sliderNavigation.find('.' + this.classes.autoplayButton).length < 1) {
                this.sliderNavigation.append(button);
                this.bindEventsAutoplayButton();
            }
        },

        bindEventsAutoplayButton: function() {
            // Get autoplay button
            this.autoplayButton = this.sliderNavigation.find('.' + this.classes.autoplayButton);

            // Bind click events
            this.autoplayButton.on('click', $.proxy(function() {
                if (this.isAutoplay) {
                    this.stopAutoplay();
                    this.autoplayButton.removeClass(this.classes.states.active);
                } else {
                    this.mouseHover = false;
                    this.autoplay();
                    this.autoplayButton.addClass(this.classes.states.active);
                }
            }, this));
        },

        // Stop autoplay
        stopAutoplay: function() {
            this.isAutoplay = false;
            clearInterval(this.autoplayInterval);

            // Remove active class on autoplay button
            if (this.sliderNavigation.find('.' + this.classes.autoplayButton).length > 0) {
                this.sliderNavigation.find('.' + this.classes.autoplayButton).removeClass(this.classes.states.active);
                this.toggleAutoplayText();
            }
        },

        // Toggle aria text of autoplay button
        toggleAutoplayText: function() {
            if (this.sliderNavigation.find('.' + this.classes.autoplayButton).length > 0) {
                if (this.isAutoplay) {
                    this.autoplayButton.find('span').text(this.labels.autoplayButtonPause);
                } else {
                    this.autoplayButton.find('span').text(this.labels.autoplayButton);
                }
            }
        },

        // Create aria hidden box
        createAriabox: function() {
            if (this.config.navigationType === 'arrows') {
                this.slider.append('<div class="visuallyhidden ' + this.classes.ariaHiddenBox + '" aria-live="polite" aria-atomic="true" aria-hidden="true"></div>');
                this.ariaHiddenBox = this.slider.find('.' + this.classes.ariaHiddenBox);
            }
        },

        // Update aria hidden box
        updateAriabox: function(content) {
            if (this.config.navigationType === 'arrows') {
                this.ariaHiddenBox.html(content);
            }
        },

        // Change active slide
        changeSlide: function(index) {
            // Prevent slide outside the wrapper
            if (index < 0) {
                if (this.config.changeSlideLoop) {
                    index = this.slides.length - this.displayedSlides;
                } else {
                    index = 0;
                }
            } else if (index > this.slides.length - this.displayedSlides) {
                if (this.navigationTypeTriggered === 'dots') {
                    index = this.slides.length - this.displayedSlides;
                } else {
                    if (this.config.changeSlideLoop) {
                        index = 0;
                    } else {
                        index = this.slides.length - this.displayedSlides;
                    }
                }
            }

            // Only animated if there is no active animation
            if (!this.animated) {
                this.changeSlideAnimation(index);
            }
        },

        // Change active slide animation
        changeSlideAnimation: function(index) {
            // Update animation state
            this.animated = true;

            // Callback
            this.config.beforeChangeSlide();

            // Change slide animation
            this.sliderContainer.animate({
                left: 100 / this.displayedSlides * index * -1 + '%'
            }, this.config.animationSpeed, $.proxy(function() {
                // Update animation state
                this.animated = false;
                // Callback
                this.config.afterChangeSlide();
                // Update active slide index
                this.activeSlideIndex = index;
                // Update tabindex
                this.slides.find(':focusable').attr('tabindex', '-1');
                this.slides.slice(index, index + this.displayedSlides).find(':focusable').removeAttr('tabindex');
                if (this.config.navigationType === 'dots' || this.config.navigationType === 'both') {
                    // Get current active dot index
                    var currentDotIndex = this.activeSlideIndex / this.displayedSlides;
                    var currentDotIndexRounded = Math.floor(currentDotIndex);
                    if (currentDotIndex === this.slides.length / this.displayedSlides - 1) {
                        currentDotIndexRounded = this.navigationDots.length - 1;
                    }
                    // Update dots buttons active class
                    this.navigationDots.removeClass(this.classes.states.active).eq(currentDotIndexRounded).addClass(this.classes.states.active);
                    // Update hidden active text
                    this.navigationDots.find('.' + this.classes.ariaTextActive).remove();
                    this.navigationDots.eq(currentDotIndexRounded).append('<span class="visuallyhidden ' + this.classes.ariaTextActive + '">' + this.labels.navigationDotActive + '</span>');
                }
            }, this));
        },

        // Update active slide content
        updateActiveSlideContent: function(content) {
            this.config.beforeClone();
            this.slider.find('.' + this.classes.sliderActiveContent).html(content);
            this.config.afterClone();
        },

        detectswipe: function(element, callback) {
            swipe_det = new Object();
            swipe_det.sX = 0;
            swipe_det.sY = 0;
            swipe_det.eX = 0;
            swipe_det.eY = 0;
            var min_x = 30
            var max_x = 30
            var min_y = 50
            var max_y = 60
            var direction = '';
            element = element[0];
            element.addEventListener('touchstart', function(e) {
                var t = e.touches[0];
                swipe_det.sX = t.screenX;
                swipe_det.sY = t.screenY;
            }, false);
            element.addEventListener('touchmove', function(e) {
                e.preventDefault();
                var t = e.touches[0];
                swipe_det.eX = t.screenX;
                swipe_det.eY = t.screenY;
            }, false);
            element.addEventListener('touchend', function(e) {
                if ((((swipe_det.eX - min_x > swipe_det.sX) || (swipe_det.eX + min_x < swipe_det.sX)) && ((swipe_det.eY < swipe_det.sY + max_y) && (swipe_det.sY > swipe_det.eY - max_y) && (swipe_det.eX > 0)))) {
                    if (swipe_det.eX > swipe_det.sX) direction = 'right';
                    else direction = 'left';
                } else if ((((swipe_det.eY - min_y > swipe_det.sY) || (swipe_det.eY + min_y < swipe_det.sY)) && ((swipe_det.eX < swipe_det.sX + max_x) && (swipe_det.sX > swipe_det.eX - max_x) && (swipe_det.eY > 0)))) {
                    if (swipe_det.eY > swipe_det.sY) direction = 'down';
                    else direction = 'up';
                }
                if (direction != '') {
                    if (typeof callback == 'function') callback(direction);
                }
                direction = '';
                swipe_det.sX = 0;
                swipe_det.sY = 0;
                swipe_det.eX = 0;
                swipe_det.eY = 0;
            }, false);
        },

        // Check if slider has active content attribute set to true
        isActiveContent: function() {
            return typeof this.slider.data('activecontent') !== 'undefined';
        }

    });

    $.fn.slider = function(options) {
        return this.each(function() {
            var element = $(this);

            // Return early if this element already has a plugin instance
            if (element.data('slider')) return;

            // pass options to plugin constructor
            var slider = new Slider(this, options);

            // Store plugin object in this element's data
            element.data('slider', slider);
        });
    };
})(jQuery);
