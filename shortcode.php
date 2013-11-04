<?php
/**
 *
 */

class Map_Embed_Shortcode {
	static $encoded_brackets = array( '&#91;', '&#93;' );
	static $decoded_brackets = array( '[', ']' );
	var $mapsToLoad = array();

	function __construct() {
		add_shortcode( 'map', array( $this, 'render') );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts') );
		add_action( 'wp_footer', array( $this, 'load_maps' ) );
	}

	function render( $attrs, $content='' ) {
		if ( !empty( $attrs['map'] ) ) {
			$this->mapsToLoad[] = $attrs['map'];
			
			// Parse the attributes
			foreach ( $attrs as $key => $v ) {
				$v = str_replace( self::$encoded_brackets, self::$decoded_brackets, htmlspecialchars_decode( $v ) );
				
				$json_v = json_decode( $v );
				if ( $json_v ) {
					$v = $json_v;
				}
				$attrs[$key] = $v;
			}

			$map = new Map_Embed_Map( $attrs );
			return $map->get_html();
		}

		return '';
	}

	function enqueue_scripts() {
		$dir = plugins_url( '/', __FILE__ );
		wp_enqueue_script( 'map-embed-color', $dir . 'js/color.js', array(), '1', true );
		wp_enqueue_script( 'map-embed', $dir . 'js/map-embed.js', array( 'jquery' ), '1', true );
	}

	function load_maps() {
		$maps = array_unique( $this->mapsToLoad );
		$maps = apply_filters( 'map-embed/load_maps', $maps );

		if ( empty( $maps ) ) {
			// Stop if there are no maps
			return;
		}

		$loaded_maps = array();

		foreach ( $maps as $map_name ) {
			$map_data = null;

			if ( in_array( $map_name, array( 'us-states' ) ) ) {
				// Try to load up a default map
				$map_data = json_decode( file_get_contents( __DIR__.'/maps/'.$map_name.'.json' ) );
			}
			$map_data = apply_filters( 'map-embed/map_data', $map_data, $map_name );

			if ( !empty( $map_data ) ) {
				$loaded_maps[$map_name] = $map_data;
			}
		}

		if ( empty($loaded_maps) ) {
			return;
		}

		?>
		<script>
			var mapEmbedMapData = <?php echo json_encode($loaded_maps); ?>;
		</script>
		<?php
	}
}

$map_embed_shortcode = new Map_Embed_Shortcode();