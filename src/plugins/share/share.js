/*
 * @title WET-BOEW Share widget
 * @overview Facilitates sharing Web content on social media platforms.
 * @license wet-boew.github.io/wet-boew/License-en.html / wet-boew.github.io/wet-boew/Licence-fr.html
 * @author @pjackson28
 */
(function( $, window, document, vapour ) {
"use strict";

/* 
 * Variable and function definitions. 
 * These are global to the plugin - meaning that they will be initialized once per page,
 * not once per instance of plugin on the page. So, this is a good place to define
 * variables that are common to all instances of the plugin on a page.
 */
var selector = ".wb-share",
	shareLink = "shr-lnk",
	$document = vapour.doc,
	i18n, i18nText,

	/*
	 * Plugin users can override these defaults by setting attributes on the html elements that the
	 * selector matches.
	 * For example, adding the attribute data-option1="false", will override option1 for that plugin instance.
	 */
	defaults = {
		heading: "h2",
		sites: {

			// The definitions of the available bookmarking sites, in URL use
			// '{u}' for the page URL, '{t}' for the page title, {i} for the image, and '{d}' for the description
			bitly: {
				name: "bitly",
				url: "http://bitly.com/?url={u}"
			},
			blogger: {
				name: "Blogger",
				url: "http://www.blogger.com/blog_this.pyra?t=&amp;u={u}&amp;n={t}"
			},
			delicious: {
				name: "Delicious",
				url: "http://delicious.com/post?url={u}&amp;title={t}"
			},
			digg: {
				name: "Digg",
				url: "http://digg.com/submit?phase=2&amp;url={u}&amp;title={t}"
			},
			diigo: {
				name: "Diigo",
				url: "http://www.diigo.com/post?url={u}&amp;title={t}"
			},
			dzone: {
				name: "DZone",
				url: "http://www.dzone.com/link/add.html?url={u}&amp;title={t}"
			},
			facebook: {
				name: "Facebook",
				url: "http://www.facebook.com/sharer.php?u={u}&amp;t={t}"
			},
			fark: {
				name: "Fark",
				url: "http://cgi.fark.com/cgi/fark/submit.pl?new_url={u}&amp;new_comment={t}"
			},
			googleplus: {
				name: "Google+",
				url: "https://plus.google.com/share?url={u}&amp;hl=" + document.documentElement.lang,
			},
			linkedin: {
				name: "LinkedIn",
				url: "http://www.linkedin.com/shareArticle?mini=true&amp;url={u}&amp;title={t}&amp;ro=false&amp;summary={d}&amp;source="
			},
			myspace: {
				name: "MySpace",
				url: "http://www.myspace.com/Modules/PostTo/Pages/?u={u}&amp;t={t}"
			},
			netvibes: {
				name: "Netvibes",
				url: "http://www.netvibes.com/share?url={u}&amp;title={t}"
			},
			newsvine: {
				name: "Newsvine",
				url: "http://www.newsvine.com/_wine/save?u={u}&amp;h={t}"
			},
			pinterest: {
				name: "Pinterest",
				url: "http://www.pinterest.com/pin/create/button/?url={u}&amp;media={i}&amp;description={d}"
			},
			reddit: {
				name: "reddit",
				url: "http://reddit.com/submit?url={u}&amp;title={t}"
			},
			stumbleupon: {
				name: "StumbleUpon",
				url: "http://www.stumbleupon.com/submit?url={u}&amp;title={t}"
			},
			technorati: {
				name: "Technorati",
				url: "http://www.technorati.com/faves?add={u}"
			},
			tumblr: {
				name: "tumblr",
				url: "http://www.tumblr.com/share?v=3&amp;u={u}&amp;t={t}"
			},
			twitter: {
				name: "Twitter",
				url: "http://twitter.com/home?status={t}%20{u}"
			}
		}
	},

	/*
	* Init runs once per plugin element on the page. There may be multiple elements. 
	* It will run more than once per plugin if you don't remove the selector from the timer.
	* @method init
	* @param {jQuery Event} event `timerpoke.wb` event that triggered the function call
	*/
	init = function( event ) {
		var elm = event.target,
			sites, heading, settings, panel, link, $share, $elm, pageHref,
			pageTitle, pageImage, pageDescription, site, siteProperties, url;

		// Filter out any events triggered by descendants
		if ( event.currentTarget === elm ) {
			$elm = $( elm );
			settings = $.extend( true, defaults, vapour.getData( $elm, "wet-boew" ) );
			sites = settings.sites;
			heading = settings.heading;
			pageHref = vapour.pageUrlParts.href;
			pageTitle = encodeURIComponent( document.title || $document.find( "h1:first" ).text() );

			// Placeholders until source(s) can be determined and implemented
			pageImage = encodeURIComponent( "" ),
			pageDescription = encodeURIComponent( "" );

			// All plugins need to remove their reference from the timer in the init sequence unless they have a requirement to be poked every 0.5 seconds
			window._timer.remove( selector );

			// Only initialize the i18nText once
			if ( !i18nText ) {
				i18n = window.i18n;
				i18nText = {
					shareText: i18n( "shr-txt" ),
					disclaimer: i18n( "shr-disc" )
				};
			}

			panel = "<section id='shr-pg' class='shr-pg wb-panel-" +
				( vapour.html.attr( "dir" ) === "rtl" ? "l" : "r" ) +
				"'><div class='overlay-hd'><" + heading + ">" +
				i18nText.shareText + "</" + heading + "></div><ul class='colcount-xs-2 colcount-sm-3'>";

			for ( site in sites ) {
				siteProperties = sites[ site ];
				url = siteProperties.url
						.replace( /\{u\}/, pageHref )
						.replace( /\{t\}/, pageTitle )
						.replace( /\{i\}/, pageImage )
						.replace( /\{d\}/, pageDescription );
				panel += "<li><a href='" + url + "' class='" + shareLink + " " + site + " btn btn-default' target='_blank'>" + siteProperties.name + "</a></li>";
			}

			panel += "</ul><div class='clearfix'></div><p class='col-sm-12'>" + i18nText.disclaimer + "</p></section>";
			link = "<a href='#shr-pg' aria-controls='shr-pg' class='shr-opn overlay-lnk'><span class='glyphicon glyphicon-share'></span> " +
				i18nText.shareText + "</a>";
			
			$share = $( panel + link );

			$elm.append( $share );

			$share.trigger( "timerpoke" );
		}
	};

// Bind the init event of the plugin
$document.on( "timerpoke.wb", selector, init );

$document.on( "click vclick", "." + shareLink, function( event) {
	var which = event.which;

	// Ignore middle and right mouse buttons
	if ( !which || which === 1 ) {

		// Close the overlay by emulating an escape key keydown
		$( event.target ).trigger({
			type: "keydown",
			which: 27
		});
	}
});

// Add the timer poke to initialize the plugin
window._timer.add( selector );

})( jQuery, window, document, vapour );
