/**
 * Javascript class for manipulating colors
 */
MEColor = function() {
	this.r = 0;
	this.g = 0;
	this.b = 0;

	this._init.apply( this, arguments );
}

MEColor.prototype = {
	/**
	 * 
	 * new MEColor( 255, 0, 0 ); // Red
	 * new MEColor( new MEColor( 255, 0, 0 ) ); // Clone a color
	 * new MEColor( '#ff0000' ); // Red
	 * new MEColor( 'red' );
	 */
	_init: function( r, g, b ) {

		if ( arguments.length == 3 ) {
			// RGB values are passed
			this.r = r;
			this.g = g;
			this.b = this.b

		} else if ( r instanceof MEColor ) {
			this.r = r.r;
			this.g = r.g;
			this.b = r.b;

		} else if ( typeof r == 'string' ) {
			var str = r.replace( /\s+/g, '' ).toLowerCase();

			// Convert color names
			if ( MEColor.namedColors[str] ) {
				str = MEColor.namedColors[str];
			}

			var parser, matches, rgba;
			// Work through all the various formats to find one that matches
			for ( var i=0; i<MEColor.stringParsers.length; ++i ) {
				parser = MEColor.stringParsers[i];
				matches = parser.re.exec( str );

				if ( matches ) {
					rgba = parser.parse( matches );
					this.r = rgba[0];
					this.g = rgba[1];
					this.b = rgba[2];
					break;
				}
			}
		}
	},

	toHex: function() {
		// convert rgb values to hex
		var ca = [
			Math.round(this.r).toString(16),
			Math.round(this.g).toString(16),
			Math.round(this.b).toString(16)
		];

		// 0-pad rgb strings
		for (var i in ca) {
			if (ca[i].length == 0) {
				ca[i] = '00';
			} else if (ca[i].length == 1) {
				ca[i] = '0' + ca[i];
			}
		}

		return '#' + ca.join('');
	},

	toString: function() {
		return this.toHex();
	},

	/**
	 * @param color MEColor
	 * @param amount number - 0 to 1, 0 is all this color, and 1 is all parameter color
	 */
	mix: function( color, amount ) {
		var dr, dg, db, r, g, b;

		dr = color.r - this.r;
		dg = color.g - this.g;
		db = color.b - this.b;

		r = this.r + dr*amount;
		g = this.g + dg*amount;
		b = this.b + db*amount;
		
		return new MEColor( r, g, b );
	}
};

// Static
MEColor.stringParsers = [{
	re: /rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(?:,(\d?(?:\.\d+)?))?\)/,
	parse: function( execResult ) {
		return [
			execResult[ 1 ],
			execResult[ 2 ],
			execResult[ 3 ],
			execResult[ 4 ]
		];
	}
}, {
	re: /rgba?\((\d+(?:\.\d+)?)\%,(\d+(?:\.\d+)?)\%,(\d+(?:\.\d+)?)\%(?:,(\d?(?:\.\d+)?))?\)/,
	parse: function( execResult ) {
		return [
			execResult[ 1 ] * 2.55,
			execResult[ 2 ] * 2.55,
			execResult[ 3 ] * 2.55,
			execResult[ 4 ]
		];
	}
},
{
	// this regex ignores A-F because it's compared against an already lowercased string
	re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
	parse: function( execResult ) {
		return [
			parseInt( execResult[ 1 ], 16 ),
			parseInt( execResult[ 2 ], 16 ),
			parseInt( execResult[ 3 ], 16 )
		];
	}
}, {
	// this regex ignores A-F because it's compared against an already lowercased string
	re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
	parse: function( execResult ) {
		return [
			parseInt( execResult[ 1 ] + execResult[ 1 ], 16 ),
			parseInt( execResult[ 2 ] + execResult[ 2 ], 16 ),
			parseInt( execResult[ 3 ] + execResult[ 3 ], 16 )
		];
	}
}, {
	re: /hsla?\((\d+(?:\.\d+)?),(\d+(?:\.\d+)?)\%,(\d+(?:\.\d+)?)\%(?:,(\d?(?:\.\d+)?))?\)/,
	space: "hsla",
	parse: function( execResult ) {
		var rgb = MEColor.hslToRgb( execResult[1], execResult[2] / 100, execResult[3] / 100);
		return [
			rgb.r,
			rgb.g,
			rgb.b,
			execResult[ 4 ]
		];
	}
}];

MEColor.namedColors = {
	aliceblue: "#f0f8ff",
	antiquewhite: "#faebd7",
	aquamarine: "#7fffd4",
	azure: "#f0ffff",
	beige: "#f5f5dc",
	bisque: "#ffe4c4",
	blanchedalmond: "#ffebcd",
	blueviolet: "#8a2be2",
	brown: "#a52a2a",
	burlywood: "#deb887",
	cadetblue: "#5f9ea0",
	chartreuse: "#7fff00",
	chocolate: "#d2691e",
	coral: "#ff7f50",
	cornflowerblue: "#6495ed",
	cornsilk: "#fff8dc",
	crimson: "#dc143c",
	cyan: "#00ffff",
	darkblue: "#00008b",
	darkcyan: "#008b8b",
	darkgoldenrod: "#b8860b",
	darkgray: "#a9a9a9",
	darkgreen: "#006400",
	darkgrey: "#a9a9a9",
	darkkhaki: "#bdb76b",
	darkmagenta: "#8b008b",
	darkolivegreen: "#556b2f",
	darkorange: "#ff8c00",
	darkorchid: "#9932cc",
	darkred: "#8b0000",
	darksalmon: "#e9967a",
	darkseagreen: "#8fbc8f",
	darkslateblue: "#483d8b",
	darkslategray: "#2f4f4f",
	darkslategrey: "#2f4f4f",
	darkturquoise: "#00ced1",
	darkviolet: "#9400d3",
	deeppink: "#ff1493",
	deepskyblue: "#00bfff",
	dimgray: "#696969",
	dimgrey: "#696969",
	dodgerblue: "#1e90ff",
	firebrick: "#b22222",
	floralwhite: "#fffaf0",
	forestgreen: "#228b22",
	gainsboro: "#dcdcdc",
	ghostwhite: "#f8f8ff",
	gold: "#ffd700",
	goldenrod: "#daa520",
	greenyellow: "#adff2f",
	grey: "#808080",
	honeydew: "#f0fff0",
	hotpink: "#ff69b4",
	indianred: "#cd5c5c",
	indigo: "#4b0082",
	ivory: "#fffff0",
	khaki: "#f0e68c",
	lavender: "#e6e6fa",
	lavenderblush: "#fff0f5",
	lawngreen: "#7cfc00",
	lemonchiffon: "#fffacd",
	lightblue: "#add8e6",
	lightcoral: "#f08080",
	lightcyan: "#e0ffff",
	lightgoldenrodyellow: "#fafad2",
	lightgray: "#d3d3d3",
	lightgreen: "#90ee90",
	lightgrey: "#d3d3d3",
	lightpink: "#ffb6c1",
	lightsalmon: "#ffa07a",
	lightseagreen: "#20b2aa",
	lightskyblue: "#87cefa",
	lightslategray: "#778899",
	lightslategrey: "#778899",
	lightsteelblue: "#b0c4de",
	lightyellow: "#ffffe0",
	limegreen: "#32cd32",
	linen: "#faf0e6",
	mediumaquamarine: "#66cdaa",
	mediumblue: "#0000cd",
	mediumorchid: "#ba55d3",
	mediumpurple: "#9370db",
	mediumseagreen: "#3cb371",
	mediumslateblue: "#7b68ee",
	mediumspringgreen: "#00fa9a",
	mediumturquoise: "#48d1cc",
	mediumvioletred: "#c71585",
	midnightblue: "#191970",
	mintcream: "#f5fffa",
	mistyrose: "#ffe4e1",
	moccasin: "#ffe4b5",
	navajowhite: "#ffdead",
	oldlace: "#fdf5e6",
	olivedrab: "#6b8e23",
	orange: "#ffa500",
	orangered: "#ff4500",
	orchid: "#da70d6",
	palegoldenrod: "#eee8aa",
	palegreen: "#98fb98",
	paleturquoise: "#afeeee",
	palevioletred: "#db7093",
	papayawhip: "#ffefd5",
	peachpuff: "#ffdab9",
	peru: "#cd853f",
	pink: "#ffc0cb",
	plum: "#dda0dd",
	powderblue: "#b0e0e6",
	rosybrown: "#bc8f8f",
	royalblue: "#4169e1",
	saddlebrown: "#8b4513",
	salmon: "#fa8072",
	sandybrown: "#f4a460",
	seagreen: "#2e8b57",
	seashell: "#fff5ee",
	sienna: "#a0522d",
	skyblue: "#87ceeb",
	slateblue: "#6a5acd",
	slategray: "#708090",
	slategrey: "#708090",
	snow: "#fffafa",
	springgreen: "#00ff7f",
	steelblue: "#4682b4",
	tan: "#d2b48c",
	thistle: "#d8bfd8",
	tomato: "#ff6347",
	turquoise: "#40e0d0",
	violet: "#ee82ee",
	wheat: "#f5deb3",
	whitesmoke: "#f5f5f5",
	yellowgreen: "#9acd32"
};

/**
 * @param h number - 0 to 360
 * @param s number - 0 to 1
 * @param l number - 0 to 1
 * @return simple object with rgb
 */
MEColor.hslToRgb = function( h, s, l ) {
	var rgb = {};

	if(s == 0){
        rgba.r = rgba.g = rgba.b = l; // achromatic
    }else{
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        rgba.r = MEColor.hue2rgb (p, q, h + 1/3);
        rgba.g = MEColor.hue2rgb (p, q, h);
        rgba.b = MEColor.hue2rgb (p, q, h - 1/3);
    }

    rgba.r = rgba.r * 255;
    rgba.g = rgba.g * 255;
    rgba.b = rgba.b * 255;
    return rgb;
};

MEColor.hue2rgb = function(p, q, t){
  if(t < 0) t += 1;
  if(t > 1) t -= 1;
  if(t < 1/6) return p + (q - p) * 6 * t;
  if(t < 1/2) return q;
  if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}


