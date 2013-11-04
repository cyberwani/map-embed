/**
 *
 */

(function( $, tinymce ) {

	if ( !tinymce ) {
		return;
	}

	tinymce.create('tinymce.plugins.mapEmbed', {

		init : function(ed, url) {
			var t = this;
			t.url = url;
			t.editor = ed;
			t._createButtons();

			// // Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('...');
			// ed.addCommand('WP_Gallery', function() {
			// 	if ( tinymce.isIE )
			// 		ed.selection.moveToBookmark( ed.wpGalleryBookmark );

			// 	var el = ed.selection.getNode(),
			// 		gallery = wp.media.gallery,
			// 		frame;

			// 	// Check if the `wp.media.gallery` API exists.
			// 	if ( typeof wp === 'undefined' || ! wp.media || ! wp.media.gallery )
			// 		return;

			// 	// Make sure we've selected a gallery node.
			// 	if ( el.nodeName != 'IMG' || ed.dom.getAttrib(el, 'class').indexOf('wp-gallery') == -1 )
			// 		return;

			// 	frame = gallery.edit( '[' + ed.dom.getAttrib( el, 'title' ) + ']' );

			// 	frame.state('gallery-edit').on( 'update', function( selection ) {
			// 		var shortcode = gallery.shortcode( selection ).string().slice( 1, -1 );
			// 		ed.dom.setAttrib( el, 'title', shortcode );
			// 	});
			// });

			// ed.onInit.add(function(ed) {
			// 	// iOS6 doesn't show the buttons properly on click, show them on 'touchstart'
			// 	if ( 'ontouchstart' in window ) {
			// 		ed.dom.events.add(ed.getBody(), 'touchstart', function(e){
			// 			var target = e.target;

			// 			if ( target.nodeName == 'IMG' && ed.dom.hasClass(target, 'wp-gallery') ) {
			// 				ed.selection.select(target);
			// 				ed.dom.events.cancel(e);
			// 				ed.plugins.wordpress._hideButtons();
			// 				ed.plugins.wordpress._showButtons(target, 'wp_gallerybtns');
			// 			}
			// 		});
			// 	}
			// });

			ed.onMouseDown.add(function(ed, e) {
				if ( e.target.nodeName == 'IMG' && ed.dom.hasClass(e.target, 'map-embed') ) {
					console.log( ed.plugins.wordpress._hideButtons, ed.plugins.wordpress._showButtons );
					ed.plugins.wordpress._hideButtons();
					ed.plugins.wordpress._showButtons(e.target, 'map-embed-buttons');
				}
			});

			ed.onBeforeSetContent.add(function(ed, o) {
				o.content = t._shortcode_to_wysiwyg(o.content);
			});

			ed.onPostProcess.add(function(ed, o) {
				if (o.get)
					o.content = t._wysiwyg_to_shortcode(o.content);
			});
		},

		/**
		 * Convert the source from the text into the WYSIWYG by swapping the shortcode into a placeholder element
		 */
		_shortcode_to_wysiwyg : function(co) {
			return co.replace(/\[map([^\]]*)\]/g, _.bind( function( fullMatch, paramsMatch){

				// Add data- before the various parameters
				var params = this._parse_parameters( paramsMatch );

				var paramsStr = '';
				for ( var param in params ) {
					paramsStr += ' data-'+param+'="'+params[param]+'"';
				}

				return '<img class="map-embed mceItem" src="'+tinymce.baseURL+'/plugins/wpgallery/img/t.gif" '+paramsStr+'" />';
			}, this ) );
		},

		/**
		 * Convert the HTML source from the WYSIWYG into the text version by swapping it to a shortcode
		 */
		_wysiwyg_to_shortcode : function(co) {
			return co.replace( /(?:<p[^>]*>)*(<img[^>]+>)(?:<\/p>)*/g, _.bind( function( allMatch, imageMatch ) {
				var params = this._parse_parameters( imageMatch.replace( /^<\S+|\/?>$/g, '' ) );
				for ( var key in params ) {
					if ( !key.match( /^data-/i ) || key.match( /^data-mce/i ) ) {
						delete params[key];
					}
				}
			}, this ) );
		},

		/**
		 * Utility to parse parameters out of a string
		 */
		_parse_parameters : function( str ) {
			var regex = /(\S+)="([^"]*)"\s*/;
			var params = {};
			var m;
			while ( m = str.match( regex ) ) {
				params[m[1]] = m[2];
				str = str.substring( m[0].length );
			}
			return params;
		},

		/**
		 * Generate the buttons
		 */
		_createButtons : function() {
			var t = this, ed = tinymce.activeEditor, DOM = tinymce.DOM, editButton, dellButton, isRetina;

			if ( DOM.get('map-embed-buttons') ) {
				return;
			}

			// Tie our buttons into the TinyMCE WordPress plugin for hidding buttons
			var _hideButtons = ed.plugins.wordpress._hideButtons;
			ed.plugins.wordpress._hideButtons = function() {
				var DOM = tinymce.DOM;
				DOM.hide( DOM.get('map-embed-buttons') );
				return _hideButtons.apply( ed.plugins.wordpress, arguments );
			};

			isRetina = ( window.devicePixelRatio && window.devicePixelRatio > 1 ) || // WebKit, Opera
				( window.matchMedia && window.matchMedia('(min-resolution:130dpi)').matches ); // Firefox, IE10, Opera

			DOM.add(document.body, 'div', {
				id : 'map-embed-buttons',
				style : 'display:none;'
			});


			editButton = DOM.add('map-embed-buttons', 'img', {
				src : isRetina ? t.url+'/../img/edit-2x.png' : t.url+'/../img/edit.png',
				id : 'wp_editgallery',
				width : '24',
				height : '24',
				title : ed.getLang('wordpress.editgallery')
			});

			tinymce.dom.Event.add(editButton, 'mousedown', function(e) {
				var ed = tinymce.activeEditor;
				ed.wpGalleryBookmark = ed.selection.getBookmark('simple');
				ed.execCommand("WP_Gallery");
				ed.plugins.wordpress._hideButtons();
			});

			dellButton = DOM.add('map-embed-buttons', 'img', {
				src : isRetina ? t.url+'/../img/delete-2x.png' : t.url+'/../img/delete.png',
				id : 'wp_delgallery',
				width : '24',
				height : '24',
				title : ed.getLang('wordpress.delgallery')
			});

			tinymce.dom.Event.add(dellButton, 'mousedown', function(e) {
				var ed = tinymce.activeEditor, el = ed.selection.getNode();

				if ( el.nodeName == 'IMG' && ed.dom.hasClass(el, 'wp-gallery') ) {
					ed.dom.remove(el);

					ed.execCommand('mceRepaint');
					ed.dom.events.cancel(e);
				}

				ed.plugins.wordpress._hideButtons();
			});
		},

		getInfo : function() {
			return {
				longname : 'Gallery Settings',
				author : 'WordPress',
				authorurl : 'http://wordpress.org',
				infourl : '',
				version : "1.0"
			};
		}
	});

	tinymce.PluginManager.add('mapEmbed', tinymce.plugins.mapEmbed );
})( jQuery, tinymce );
