<?php

class Map_Embed_Admin {

	function __construct() {
		add_action( 'media_buttons', array( $this, 'media_button'), 999 );
		//add_action( 'after_wp_tiny_mce', array( $this, 'print_tinymce_script'));
		add_action( 'mce_external_plugins', array( $this, 'add_tinymce_plugin') );
		add_filter( 'mce_css', array( $this, 'editor_css') );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}


	/**
	 * Render the media insert button
	 */
	function media_button( $editor_id ) {
		global $post_ID, $temp_ID;
		$iframe_post_id = (int) (0 == $post_ID ? $temp_ID : $post_ID);
		$title = esc_attr( __( 'Add a Map', 'map-embed' ) );
		$plugin_url = esc_url( GRUNION_PLUGIN_URL );
		$site_url = esc_url( admin_url( "/admin-ajax.php?post_id={$iframe_post_id}&action=grunion_form_builder&TB_iframe=true&width=768" ) );
		?>

		<a class="button map-embed-media-button" title="<?php esc_html_e( 'Add Map', 'map-embed' ); ?>" data-editor="<?php echo esc_attr($editor_id); ?>" href="#">
			<span class="map-embed-button-icon"></span> <?php esc_html_e( 'Add Map', 'map-embed' ); ?>
		</a>

		<?php
	}


	/**
	 * Enqueue the scripts and stylesheets
	 */
	function enqueue_scripts() {
		$dir = plugins_url( '/', __FILE__ );
		wp_enqueue_style( 'map-embed-editor', $dir . 'css/editor.css' );
	}

	function print_tinymce_script() {
		$dir = plugins_url( '/', __FILE__ );
		//echo '<script src="', $dir, 'js/map-embed-admin.js"></script>';
	}

	function add_tinymce_plugin( $plugins ) {
		$dir = plugins_url( '/', __FILE__ );
		$plugins['mapEmbed'] = $dir . 'js/map-embed-admin.js';
		return $plugins;
	}

	function editor_css( $mcs_css ) {
		if ( ! empty( $mce_css ) ) {
			$mce_css .= ',';
		}
		$mce_css .= plugins_url( '/css/tinymce-content.css', __FILE__ );
		return $mce_css;
	}
}

$map_embed_admin = new Map_Embed_Admin();
