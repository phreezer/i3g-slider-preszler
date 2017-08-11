/*!
* i3g-slider-preszler - v0.0.1
* Homepage: http://i-3global.com
* Author: i3Global
* Author URL: http://i-3global.com/
*/
(function ($) {
	'use strict';
	/*jshint indent:4 */

	$.app = $.app || {};
	$.app.config = $.app.config || {
		API_SERVER: '/',
		API_PATH: 'preszler/wp-json/acf/v2/',
		API_ENDPOINT: 'options/slideshow'
	};


	$.serviceSlideshow = function () {

		var serviceSlideshow = {},
			config = {},
			defaults = $.app.config,
			cached = null;

		defaults.API_ENDPOINT = 'EventCalendar';


		function getConfig(defaults, options) {
			options = options || {};
			defaults = defaults || {};
			return $.extend(true, {}, defaults, options);
		}


		function formatData(data) {
			var regxDate = new RegExp(/\/Date\((\d*)\)\//),
				d = new Date();

			$.each(data, function (index, value) {
				if (value.Date) {
					value.Date = regxDate.exec(value.Date)[1];
					d.setTime(value.Date);
					value.DateString = d.toLocaleDateString();
				} else {
					value.DateString = 'Special Event';
				}
				if (value.CaptionBlack) {
					value.CaptionColor = 'caption-black';
				} else {
					value.CaptionColor = 'caption-white';
				}
			});

			return data;
		}


		function getData() {
			var deferred = Q.defer(),
				url;

			url = config.API_SERVER + config.API_PATH + config.API_ENDPOINT;


			console.log('url:',url);
			$.get(url, function (data) {
				console.log('data', data.slideshow);
				cached = formatData(data.slideshow);
				deferred.resolve(cached);
			});

			return deferred.promise;
		}


		function get(options) {
			console.log('options:', options);
			config = getConfig(defaults, options);
			var deferred = Q.defer();
			if (cached === null) {
				deferred.resolve(getData());
			} else {
				deferred.resolve(cached);
			}

			return deferred.promise;
		}


		function update() {
			cached = null;
			return get();
		}




		serviceSlideshow.get = get;
		serviceSlideshow.update = update;

		return serviceSlideshow;
	};


}(jQuery));


(function ($) {
	'use strict';
	/*jshint indent:4 */

	$.fn.appSlideshow = function () {

		// Set Defaults
		$.app = $.app || {};
		$.app.config = $.app.config || {};

		var config = {};
		var defaults = $.app.config;
		var options = {
			TEMPLATE_URL: ($.app.config.ASSETS_DIRECTORY || '') + 'views/slideshow.html',
			TEMPLATE: ''
		};
		var scope = { slides: [] };
		var elem = this[0];
		var slider = {};


		function buttonSetup (event, slick, currentSlide, nextSlide){
			var count = $('.slide').length-1;
			var prev_index = nextSlide-1 > -1 ? nextSlide-1 : count;
			var next_index = nextSlide+1 <= count ? nextSlide+1 : 0;
			var prev_img = 'url('+scope.slides[prev_index].image.url+')';
			var next_img = 'url('+scope.slides[next_index].image.url+')';

			// Set Next/Prev Background Image
			$('.prev-slide-image').css('background-image', prev_img);
			$('.next-slide-image').css('background-image', next_img);


			// Set Next/Prev button text
			$('.next-text').html(scope.slides[next_index].title);
			$('.prev-text').html(scope.slides[prev_index].title);

		}


		function initSlideshow() {
			slider = $('.slideshow');
			slider.slick({
				infinite: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: true,
				autoplaySpeed: 8000,
				dots: true,
				arrows: false,
				speed: 500,
				fade: true,
				cssEase: 'linear',
				mobileFirst: true
			});

			slider.on('beforeChange', buttonSetup);

			$('.prev-slide-container').on('click', function() {
				slider.slick('slickPrev');
			});

			$('.next-slide-container').on('click', function() {
				slider.slick('slickNext');
			});

			buttonSetup(null,null,null,0);

			// Temp bug fix, the width of the text box appears broken until the next slide loads
			setTimeout(function() { slider.slick('slickNext'); }, 100);
			//

			// Fire window resize on first load
			onResize();

		}

		function getConfig(defaults, options) {
			options = options || {};
			defaults = defaults || {};
			return $.extend(true, {}, defaults, options);
		}

		function templateUpdate() {
			$.serviceTemplateLoader().update(scope, options).then(function (data) {
				$(elem).html(data);
				initSlideshow();
			});
		}


		function onResize() {
			$('.prev-text').css('height', $('.prev-slide-text').width());
			$('.next-text').css('height', $('.next-slide-text').width());
		}


		this.init = function () {
			// Get Config
			config = getConfig(defaults, options);

			// Get SlideshowCalendar
			templateUpdate();

			// Get JSON Feed
			console.log('Init Directive');
			$.serviceSlideshow().get().then(function(data) {
				console.log('returned from Service:', data);
				scope.slides = data;
				templateUpdate();
			});

			// Event Listeners
			$(window).on('resize', onResize);

		};






		this.init();

		return this;

	};


	$('.app-slideshow').appSlideshow();

}(jQuery));
