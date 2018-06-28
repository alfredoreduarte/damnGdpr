// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variables rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "damnGdpr",
			defaults = {
				language: 'en',
				cookieNames: [],
				readMoreUrl: null,
				texts: {
					en: {
						title: "This website uses cookies",
						titleSecondary: "Cookie Settings",
						copy: "This website uses cookies to improve user experience. By using our website you consent to all cookies in accordance with our Cookie Policy.",
						agree: "I agree",
						reject: "I disagree",
						readMore: "Read More",
					},
					es: {
						title: "Este sitio web usa cookies",
						titleSecondary: "Cookies",
						copy: "Este sitio web usa cookies para mejorar tu experiencia de usuario. Al seguir navegando das consentimiento al uso de cookies de acuerdo con nuestra Política de Privacidad.",
						agree: "Acepto",
						reject: "No acepto",
						readMore: "Leer más",
					},
					pt: {
						title: "Este site usa cookies",
						titleSecondary: "Cookies",
						copy: "Este site usa cookies para melhorar sua experiência de usuário. Ao continuar navegando, você concorda com o uso de cookies de acordo com nossa Política de Privacidade.",
						agree: "Eu aceito",
						reject: "Não aceito",
						readMore: "Ler mais",
					}
				}
			};

		// The actual plugin constructor
		function Plugin ( options ) {
			// this.element = element; // only if plugins uses a $('selector')
			this.htmlContent = ''

			if (typeof Cookies !== "function") {
				console.log("damnGdpr: Please include https://github.com/js-cookie/js-cookie")
				return false
			}

			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			init: function() {
				if (this.settings.cookieNames.length == 0) {
					console.log("damnGdpr: Please specify cookieNames[] option")
					return false
				}

				// Place initialization logic here
				// You already have access to the DOM element and
				// the options via the instance, e.g. this.element
				// and this.settings
				// you can add more functions like the one below and
				// call them like the example below
				this.initializeDOMElements(this.settings);
				this.mainFunctionality(this.settings);
			},
			initializeDOMElements: function( settings ) {
				var localizedTexts = settings.texts[settings.language]
				this.htmlContent += '<div class="_gdPlugin-container">'
				this.htmlContent += '<div class="_gdPlugin-trigger-inactive">'+localizedTexts["title"]+'</div>'
				this.htmlContent += '<div class="_gdPlugin-trigger-secondary">'+localizedTexts["titleSecondary"]+'</div>'
				this.htmlContent += '<div class="_gdPlugin-main">'
				this.htmlContent += '<h4 class="_gdPlugin-main-header">'+localizedTexts["title"]+'</h4>'
				this.htmlContent += localizedTexts["copy"]+'<br>'
				this.htmlContent += '<div style="text-align: center">'
				this.htmlContent += '<div class="_gdPlugin-main-accept">'+localizedTexts["agree"]+'</div>'
				this.htmlContent += '</div>'
				this.htmlContent += '<div class="_gdPlugin-main-readmore-container">'
				if (settings.readMoreUrl) {
					this.htmlContent += '<a class="_gdPlugin-main-readmore" href="'+settings.readMoreUrl+'" target="_blank">'+localizedTexts["readMore"]+'</a>'
				}
				this.htmlContent += '<div class="_gdPlugin-main-reject">'+localizedTexts["reject"]+'</div>'
				this.htmlContent += '</div>'
				this.htmlContent += '</div>'
				$('body').append(this.htmlContent)
			},
			mainFunctionality: function( settings ) {
				// 
				// Show different triggers based on cookies existence
				// 
				var damnGdprAccepted = Cookies.get('damnGdprAccepted')
				var scrolledToBottom = false
				$(window).scroll(function() {
					if (damnGdprAccepted === 'true') {
						if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
							if (!scrolledToBottom) {
								$('._gdPlugin-trigger-secondary').slideDown()
								scrolledToBottom = true
							}
						}
					}
				})

				if (!damnGdprAccepted) {
					$('._gdPlugin-trigger-inactive').slideDown()
				}

				// 
				// UI Triggers
				// 
				$('._gdPlugin-trigger-inactive, ._gdPlugin-trigger-secondary').click(function(){
					$('._gdPlugin-main').slideDown()
					$('._gdPlugin-trigger-inactive').slideUp()
					$('._gdPlugin-trigger-secondary').slideUp()
				})

				// 
				// Handle user agreement
				// 
				$('._gdPlugin-main-accept').click(function(){
					for (var i = settings.cookieNames.length - 1; i >= 0; i--) {
						var currentValue = Cookies.get(settings.cookieNames[i])
						if (currentValue) {
							Cookies.set(settings.cookieNames[i], currentValue, { expires: 365 });
						}
					}
					Cookies.set('damnGdprAccepted', 'true', { expires: 365 });
					damnGdprAccepted = 'true' // controls scroll behavior
					scrolledToBottom = false
					$('._gdPlugin-main').slideUp()
					$('._gdPlugin-trigger-inactive').slideUp()
					$('._gdPlugin-trigger-secondary').slideUp()
				})

				// 
				// Handle user rejection
				// 
				$('._gdPlugin-main-reject').click(function(){
					for (var i = settings.cookieNames.length - 1; i >= 0; i--) {
						var currentValue = Cookies.get(settings.cookieNames[i])
						Cookies.remove(settings.cookieNames[i])
					}
					Cookies.remove('damnGdprAccepted')
					damnGdprAccepted = 'false' // controls scroll behavior
					scrolledToBottom = false
					$('._gdPlugin-main').slideUp()
					$('._gdPlugin-trigger-inactive').slideDown()
					$('._gdPlugin-trigger-secondary').slideUp()
				})
			}
		} );

		// 
		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		// 

		// ONLY IF PLUGIN IS USED WITH $("#DOM") ELEMENTS
		// $.fn[ pluginName ] = function( options ) {
			// return this.each( function() {
			// 	if ( !$.data( this, "plugin_" + pluginName ) ) {
			// 		$.data( this, "plugin_" + pluginName, new Plugin( options ) );
			// 	}
			// } );
		// };
		// ONLY IF PLUGIN IS USED WITH $("#DOM") ELEMENTS

		// ONLY IF NO DOM ELEMENTS ARE TARGETED
		$[ pluginName ] = function( options ) {
			return new Plugin( options );
		};
		// ONLY IF NO DOM ELEMENTS ARE TARGETED

} )( jQuery, window, document );
