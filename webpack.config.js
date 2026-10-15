const config = require( '@wordpress/scripts/config/webpack.config' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const { BannerPlugin } = require( 'webpack' );
const { readFileSync } = require( 'node:fs' );
const { dirname, join } = require( 'node:path' );

const cssNotice = readFileSync(
	join( dirname( require.resolve( 'gsap/package.json' ) ), 'CSSPlugin.js' ),
	'utf8'
).match( /\/\*![\s\S]*?\*\// )[ 0 ];

module.exports = {
	...config,
	plugins: [
		...config.plugins,
		new BannerPlugin( { banner: cssNotice, raw: true, test: /\.js$/ } ),
	],
	optimization: {
		...config.optimization,
		minimizer: [
			new TerserPlugin( {
				parallel: true,
				extractComments: false,
				terserOptions: {
					format: {
						comments: /translators:|@license|copyright/i,
					},
					compress: { passes: 2 },
					mangle: { reserved: [ '__', '_n', '_nx', '_x' ] },
				},
			} ),
		],
	},
};
