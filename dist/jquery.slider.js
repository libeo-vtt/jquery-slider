// Slider jQuery Plugin
// A responsive and a11y friendly jQuery slider.

(function($) {
    var Slider = function(element, options) {
        this.slider = $(element);

        // Default module configuration
        this.defaults = {
            displayedSlides: 4,
            slidesGutter: 20,
            createNavigation: true,
            navigationType: 'both',
            createNavigationArrows: true,
            createNavigationPages: true,
            displayPageNumber: true,
            displayFirstActiveContent: true,
            swipe: true,
            autoplay: false,
            autoplayDelay: 3000,
            infiniteLoop: true,
            animationSpeed: 300,
            onActiveSlideUpdateBefore: $.noop,
            onActiveSlideUpdateAfter: $.noop,
            onChangeSlideBefore: $.noop,
            onChangeSlideAfter: $.noop,
            onLayoutUpdateBefore: $.noop,
            onLayoutUpdateAfter: $.noop,
            labels: {
                navigationPrev: 'Précédent',
                navigationPrevAria: 'La diapositive précédente est affichée.',
                navigationNext: 'Suivant',
                navigationNextAria: 'La diapositive suivante est affichée.',
                navigationPage: 'Afficher la diapositive',
                navigationPageActive: 'Diapositive présentement affichée',
                autoplayButton: 'Mettre le carrousel en marche',
                autoplayButtonPause: 'Mettre le carrousel en pause',
            },
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
        };

        // Merge default classes with window.project.classes
        this.classes = $.extend(true, this.defaults.classes, (window.project ? window.project.classes : {}));

        // Merge default labels with window.project.labels
        this.labels = $.extend(true, this.defaults.labels, (window.project ? window.project.labels : {}));

        // Merge default config with custom config
        this.config = $.extend(true, this.defaults, options || {});

        // Get sliders wrapper
        this.sliderWrapper = this.slider.find('.' + this.classes.sliderWrapper);

        // Get sliders container
        this.sliderContainer = this.slider.find('.' + this.classes.sliderContainer);

        // Get slides
        this.slides = this.slider.find('.' + this.classes.slide);

        // Initialize activeSlideIndex
        this.activeSlideIndex = 0;

        // Initialize mouse hover state
        this.mouseHover = false;

        // Initialize animated state
        this.isAnimated = false;

        if (this.slides.length > this.config.displayedSlides) {
            if (this.config.createNavigationArrows || this.config.createNavigationPages) {
                this.createNavigation();
            }
            if (this.config.autoplay) this.autoplay();
            if (this.config.swipe) this.swipe();
        }

        this.init();
    };

    $.extend(Slider.prototype, {

        // Component initialization
        init: function() {
            this.initLayout(this.config.displayedSlides);
            this.createAriabox();

            // Create active content wrapper
            if (this.isActiveContent()) {
                this.initActiveContent();
            }

            // Bind events
            this.bindEvents();
        },

        // Layout initialization
        initLayout: function() {
            var slideWidth = 100 / this.slides.length,
                slideWidthCalc = this.config.slidesGutter / this.slides.length * this.slides.length;

            // Callback
            this.config.onLayoutUpdateBefore();

            // Create slider overflow wrapper
            this.sliderWrapper.wrap('<div class="' + this.classes.sliderOverflow + '"></div>');
            this.slider.find('.' + this.classes.sliderOverflow).css('overflow', 'hidden');

            // Add necessary css for the slider
            this.sliderWrapper.css({
                'position': 'relative',
                'overflow': 'hidden',
                'margin-left': this.config.slidesGutter / 2 * -1 + 'px',
                'margin-right': this.config.slidesGutter / 2 * -1 + 'px'
            });

            this.sliderContainer.css({
                'position': 'relative',
                'left': '0',
                'width': this.slides.length / this.config.displayedSlides * 100 + '%'
            });

            this.slides.css({
                'float': 'left',
                'position': 'relative',
                'margin-left': this.config.slidesGutter / 2 + 'px',
                'margin-right': this.config.slidesGutter / 2 + 'px',
                'width': 'calc(' + slideWidth + '% - ' + slideWidthCalc + 'px)'
            });

            // Disable focus on hidden slides
            this.slides.slice(this.config.displayedSlides).find(':focusable').attr('tabindex', '-1');

            // Callback
            this.config.onLayoutUpdateAfter();
        },

        // Bind events with actions
        bindEvents: function() {
            this.slider.hover($.proxy(function() {
                this.mouseHover = true;
            }, this), $.proxy(function() {
                this.mouseHover = false;
            }, this));

            // Detect keyboard navigation
            $(document).on('keyboardnavigation', $.proxy(function() {
                this.stopAutoplay();
            }, this));
        },

        // Active Content initialization
        initActiveContent: function() {
            this.activeContentTriggers = this.slides.find('.' + this.classes.sliderActiveContentTrigger);
            this.activeContentWrapper = $('.' + this.slider.data('active-content'));

            this.activeContentTriggers.on('click', $.proxy(function(e) {
                var $element = $(e.currentTarget);
                var content = $element.parents('.' + this.classes.slide).find('.' + $element.data('show-active-content')).clone();

                this.updateActiveSlideContent(content);
                e.preventDefault();
            }, this));

            if (this.config.displayFirstActiveContent) {
                this.activeContentTriggers.first().trigger('click');
            }
        },

        // Update active slide content
        updateActiveSlideContent: function(content) {
            this.config.onActiveSlideUpdateBefore();
            this.activeContentWrapper.html(content);
            this.config.onActiveSlideUpdateAfter();
        },

        // Create navigation
        createNavigation: function() {
            // Clear existing navigation
            this.slider.find('.' + this.classes.sliderNavigation).remove();

            // Create navigation wrapper
            this.sliderWrapper.after('<div class="' + this.classes.sliderNavigation + ' clearfix"></div>');

            // Get navigation wrapper obejct
            this.sliderNavigation = this.slider.find('.' + this.classes.sliderNavigation);

            if (this.config.createNavigationArrows) this.createNavigationArrows();
            if (this.config.createNavigationPages) this.createNavigationPages();
        },

        // Create arrows navigation
        createNavigationArrows: function() {
            var previousButton = '<button class="' + this.classes.navigationPrev + '"><span class="visuallyhidden ' + this.labels.aria + '">' + this.labels.navigationPrev + '</span></button>',
                nextButton = '<button class="' + this.classes.navigationNext + '"><span class="visuallyhidden ' + this.labels.aria + '">' + this.labels.navigationNext + '</span></button>';

            // Create navigation wrapper
            this.sliderNavigation.append('<div class="' + this.classes.navigationArrow + '-wrapper"></div>');

            // Append each button
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
            this.navigationPrevious.on('click', $.proxy(function(e) {
                this.navigationTypeTriggered = 'arrows';

                this.changeSlide(this.activeSlideIndex - 1);
                this.updateAriabox(this.config.navigationPrevAria);
                this.stopAutoplay();
            }, this));

            this.navigationNext.on('click', $.proxy(function(e) {
                this.navigationTypeTriggered = 'arrows';

                this.changeSlide(this.activeSlideIndex + 1);
                this.updateAriabox(this.config.navigationNextAria);
                this.stopAutoplay();
            }, this));
        },

        // Create pages navigation
        createNavigationPages: function() {
            var button = '<button class="' + this.classes.navigationPage + '"><span class="visuallyhidden ' + this.labels.aria + '"></span></button>';

            // Create navigation wrapper
            this.sliderNavigation.append('<div class="' + this.classes.navigationPage + '-wrapper"></div>');

            // Append each pages
            for (var i = 0; i < this.slides.length / this.config.displayedSlides; i++) {
                this.sliderNavigation.find('.' + this.classes.navigationPage + '-wrapper').append(button);
            }

            // Get pages elements
            this.navigationPages = this.sliderNavigation.find('.' + this.classes.navigationPage);

            // Add aria text for each page
            this.navigationPages.each($.proxy(function(index, element) {
                if (this.config.displayPageNumber === true) {
                    $(element).find('.' + this.labels.aria).text(this.labels.navigationPage).after(index + 1);
                } else {
                    $(element).find('.' + this.labels.aria).text(this.labels.navigationPage + (parseInt(index) + 1));
                }
            }, this));

            // Initialize first page button
            this.navigationPages.eq(0).addClass(this.classes.states.active).append('<span class="visuallyhidden ' + this.classes.ariaTextActive + '">' + this.labels.navigationPageActive + '</span>');

            this.bindEventsNavigationPages();
        },

        // Bind events for the pages navigation
        bindEventsNavigationPages: function() {
            // Get pages elements
            this.navigationPages = this.sliderNavigation.find('.' + this.classes.navigationPage);

            this.navigationPages.on('click', $.proxy(function(e) {
                var index = $(e.currentTarget).index();

                this.navigationTypeTriggered = 'pages';
                this.navigationPages.removeClass(this.classes.states.active);
                $(e.currentTarget).addClass(this.classes.states.active);

                this.changeSlide(index * this.config.displayedSlides);

                this.stopAutoplay();
            }, this));
        },

        swipe: function() {
            this.detectswipe(this.slider, $.proxy(function(direction) {
                this.stopAutoplay();
                this.changeSlide(this.activeSlideIndex + (direction === 'left' ? 1 : -1));
            }, this));
        },

        // Initialize autoplay
        autoplay: function() {
            this.isAutoplay = true;
            this.autoplayButton.addClass(this.classes.states.active);

            this.createAutoplayButton();
            this.toggleAutoplayText();

            this.autoplayInterval = setInterval($.proxy(function() {
                if (!this.mouseHover) this.changeSlide(this.activeSlideIndex + 1);
            }, this), this.config.autoplayDelay);
        },

        stopAutoplay: function() {
            this.isAutoplay = false;

            clearInterval(this.autoplayInterval);

            // Remove active class on autoplay button
            if (this.autoplayButton !== undefined) {
                this.autoplayButton.removeClass(this.classes.states.active);
                this.toggleAutoplayText();
            }
        },

        // Create autoplay button
        createAutoplayButton: function() {
            var button = '<button class="' + this.classes.autoplayButton + ' ' + this.classes.states.active + '"><span class="">' + this.labels.autoplayButton + '</span></button>';

            if (this.sliderNavigation.find('.' + this.classes.autoplayButton).length < 1) {
                this.sliderNavigation.append(button);
                this.bindEventsAutoplayButton();
            }
        },

        bindEventsAutoplayButton: function() {
            this.autoplayButton = this.sliderNavigation.find('.' + this.classes.autoplayButton);
            this.autoplayButton.on('click', $.proxy(function() {
                if (this.isAutoplay) {
                    this.stopAutoplay();
                } else {
                    this.mouseHover = false;
                    this.autoplay();
                }
            }, this));
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
            if (this.config.createNavigationArrows) {
                this.slider.append('<div class="visuallyhidden ' + this.classes.ariaHiddenBox + '" aria-live="polite" aria-atomic="true" aria-hidden="true"></div>');
                this.ariaHiddenBox = this.slider.find('.' + this.classes.ariaHiddenBox);
            }
        },

        // Update aria hidden box
        updateAriabox: function(content) {
            if (this.config.createNavigationArrows) {
                this.ariaHiddenBox.html(content);
            }
        },

        // Change active slide
        changeSlide: function(index) {
            // Prevent slide outside the wrapper
            if (index < 0) {
                if (this.config.infiniteLoop) {
                    index = this.slides.length - this.config.displayedSlides;
                } else {
                    index = 0;
                }
            } else if (index > this.slides.length - this.config.displayedSlides) {
                if (this.navigationTypeTriggered === 'pages') {
                    index = this.slides.length - this.config.displayedSlides;
                } else {
                    if (this.config.infiniteLoop) {
                        index = 0;
                    } else {
                        index = this.slides.length - this.config.displayedSlides;
                    }
                }
            }

            // Only animated if there is no active animation
            if (!this.isAnimated) {
                this.changeSlideAnimation(index);
            }
        },

        // Change active slide animation
        changeSlideAnimation: function(index) {
            this.isAnimated = true;

            this.config.onChangeSlideBefore();

            // Change slide animation
            this.sliderContainer.animate({
                left: 100 / this.config.displayedSlides * index * -1 + '%'
            }, this.config.animationSpeed, $.proxy(function() {
                this.isAnimated = false;

                // Update active slide index
                this.activeSlideIndex = index;

                this.slides.find(':focusable').attr('tabindex', '-1');
                this.slides.slice(index, index + this.config.displayedSlides).find(':focusable').removeAttr('tabindex');

                if (this.config.createNavigationArrows || this.config.createNavigationPages) {
                    this.updateSlidesNavigation();
                }

                this.config.onChangeSlideAfter();
            }, this));
        },

        // Update navigation active elements
        updateSlidesNavigation: function() {
            // Get current active page index
            var currentPageIndex = this.activeSlideIndex / this.config.displayedSlides;
            var currentPageIndexRounded = Math.floor(currentPageIndex);

            if (currentPageIndex === this.slides.length / this.config.displayedSlides - 1) {
                currentPageIndexRounded = this.navigationPages.length - 1;
            }

            // Update pages buttons active class
            this.navigationPages.removeClass(this.classes.states.active).eq(currentPageIndexRounded).addClass(this.classes.states.active);

            // Update hidden active text
            this.navigationPages.find('.' + this.classes.ariaTextActive).remove();
            this.navigationPages.eq(currentPageIndexRounded).append('<span class="visuallyhidden ' + this.classes.ariaTextActive + '">' + this.labels.navigationPageActive + '</span>');
        },

        detectswipe: function(element, callback) {
            var min_x = 30
            var max_x = 30
            var min_y = 50
            var max_y = 60
            var direction = '';

            swipe_det = new Object();
            swipe_det.sX = 0;
            swipe_det.sY = 0;
            swipe_det.eX = 0;
            swipe_det.eY = 0;

            element = element[0];

            element.addEventListener('touchstart', function(e) {
                var t = e.touches[0];
                swipe_det.sX = t.screenX;
                swipe_det.sY = t.screenY;
            }, false);

            element.addEventListener('touchmove', function(e) {
                var t = e.touches[0];
                swipe_det.eX = t.screenX;
                swipe_det.eY = t.screenY;
                e.preventDefault();
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
            return this.slider.data('active-content') !== undefined;
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
