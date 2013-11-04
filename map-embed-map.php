<?php

/**
 *
 */
class Map_Embed_Map {
	var $attrs = array();

	function __construct( $attrs ) {
		$this->attrs = $attrs;
	}

	function get_shortcode() {
		$output = '';

		foreach ( $this->attrs as $name => $val ) {
			$output = $output . ' ' . $name . '="'. $this->serialize_shortcode_value( $val ) . '"';
		}

		return '[map'.$output.']';
	}

	function get_html( ) {
		$output = '<div class="map-embed"';

		foreach ( $this->attrs as $name => $val ) {
			$output .= ' data-' . esc_attr($name) . '="' . $this->serialize_html_value( $val ) . '"';
		}

		$output .= ' data-dataset="' . $this->serialize_html_value( $this->dataset ) . '"';

		$output .= '></div>';
		return $output;
	}

	function serialize_shortcode_value( $val ) {
		if ( is_array( $val ) || is_object( $val ) ) {
			return str_replace( Map_Embed_Shortcode::$decoded_brackets, Map_Embed_Shortcode::$encoded_brackets, htmlspecialchars( json_encode( $val ) ) );
		} else {
			return htmlspecialchars($val);
		}
		
	}

	function serialize_html_value( $val ) {
		if ( is_array( $val ) || is_object( $val ) ) {
			return esc_attr( json_encode( $val ) );
		} else {
			return esc_attr( $val );
		}
	}
}