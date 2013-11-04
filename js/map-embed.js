(function( $ ) {
	// Map Shapes
	var mapShapes = {
		maps: {},
		getMap: function( mapName, callback, context ) {
			if ( this.maps[mapName] ) {
				this.callCallback( mapName, callback, context );

			} else if ( mapEmbedMapData[mapName] ) {
				this.maps[mapName] = mapEmbedMapData[mapName];
				this.callCallback( mapName, callback, context );

			} else {
				// Fallback to AJAX call
			}
		},

		callCallback: function( mapName, callback, context ) {
			var map = this.maps[mapName];
			setTimeout( function() {
				context = context || window;
				callback.call( context, map, mapName );
			}, 1 );
		}
	};

	var fillFunctions = {
		functions: {
			/*
			 * Basic one color fill if no fill function is selected
			 */
			defaultFill: function( val, args ) { return (args && args.defaultcolor) || '#ccc'; },

			/*
			 * The values are the color value, ex: #F00, blue, #004499
			 */
			literal: function( val ) { return val; },

			/*
			 * Fills using a gradient from one color to another color with 
			 * a high and low values.
			 *
			 * args.lowValue number - the floor value
			 * args.highValue number - the ceiling value
			 * args.lowColor color - the floor color value
			 * args.highColor color - the ceiling color value
			 */
			gradient: function( val, args ) {
				if ( !( args.lowColor instanceof MEColor ) ) {
					args.lowColor = new MEColor( args.lowColor );
					args.highColor = new MEColor( args.highColor );
				}

				if ( args.delta == null ) {
					args.delta = args.highValue - args.lowValue;
				}

				var amount = ( val - args.lowValue ) / args.delta;
				var color = args.lowColor.mix( args.highColor, amount );
				return color.toString();
			}


		},
		getFn: function( name, args ) {
			if ( this.functions[name] ) {
				var fn = this.functions[name];
				return function( val ) {
					return fn( val, args );
				}
			}
			return this.functions.defaultFill;
		}
	};
	window.mapEmbedRegisterFillFunction = function( name, fn ) {
		fillFunctions.functions[name] = fn;
	}
	
	// Map object	
	var Map = function() {
		this._init.apply( this, arguments );
	};

	Map.prototype = {
		_init: function( el ) {
			this.el = $(el);
			this.args = this.el.data();

			this.el.data( '_map', this );

			if ( this.args['map'] ) {
				mapShapes.getMap( this.args['map'], this.renderMap, this );
			}

			this.fillFn = fillFunctions.getFn( this.args.fillfn, this.args.fillargs );
		},

		renderMap: function( mapShapes ) {
			var width = this.args.width || this.el.width();
			var height = this.args.height || (mapShapes.height/mapShapes.width) * width;

			this.el.width( width );
			this.el.height( height );

			var scale = Math.min( width/mapShapes.width, height/mapShapes.height );

			var svg = $('<svg width="'+width+'px" height="'+height+'px" >').appendTo( this.el );

			for ( var key in mapShapes.shapes ) {
				var shapePath = mapShapes.shapes[key].replace( /\d+(\.\d*)?/g, function( match ) {
					return parseFloat( match )*scale;
				});

				var pathEl = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
				pathEl.setAttributeNS( null, 'd', shapePath );
				pathEl.setAttributeNS( null, 'data-key', key );
				pathEl.setAttributeNS( null, 'fill', this.calcFillColor( key, 0 ) );
				svg.append( pathEl );
			}
		},

		calcFillColor: function( key, col ) {
			if ( this.args.dataset && this.args.dataset[key] ) {
				return this.fillFn( this.args.dataset[key][col] );
			} else {
				return this.args.fillargs.defaultcolor || '#ccc';
			}
		}
	};

	$('div.map-embed').each( function() {
		new Map( this );
	});
})( jQuery );