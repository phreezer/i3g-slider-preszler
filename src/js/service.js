(function ($) {
	'use strict';
	/*jshint indent:4 */

	$.app = $.app || {};
	$.app.config = $.app.config || {
		API_SERVER: '/',
		API_PATH: 'wp-json/acf/v2/',
		API_ENDPOINT: 'options/slideshow'
	};


	$.serviceSlideshow = function () {

		var serviceSlideshow = {},
			config = {},
			defaults = $.app.config,
			cached = null;

		defaults.API_ENDPOINT = 'options/slideshow';


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

			// @ifdef PROD
			url = config.API_SERVER + config.API_PATH + config.API_ENDPOINT;
			// @endif

			// @ifdef DEBUG
			url = 'json/slideshow.json';
			// @endif
			$.get(url, function (data) {
				cached = formatData(data.slideshow);
				deferred.resolve(cached);
			});

			return deferred.promise;
		}


		function get(options) {
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
