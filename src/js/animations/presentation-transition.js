import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initSceneNavigation } from './scene-navigation';

function getRelativeBounds( element, ancestor ) {
	let currentElement = element;
	let x = 0;
	let y = 0;

	while ( currentElement && currentElement !== ancestor ) {
		x += currentElement.offsetLeft;
		y += currentElement.offsetTop;
		currentElement = currentElement.offsetParent;
	}

	if ( currentElement !== ancestor ) {
		const elementBounds = element.getBoundingClientRect();
		const ancestorBounds = ancestor.getBoundingClientRect();

		x = elementBounds.left - ancestorBounds.left;
		y = elementBounds.top - ancestorBounds.top;
	}

	return {
		x,
		y,
		width: element.offsetWidth,
		height: element.offsetHeight,
	};
}

export function initPresentationTransition() {
	const presentation = document.querySelector( '.presentation' );

	if ( ! presentation ) {
		return;
	}

	const circle        = presentation.querySelector( '.circle' );
	const box           = presentation.querySelector( '.box' );
	const heroPanel     = presentation.querySelector( '.hero__slide' );
	const titleBand     = presentation.querySelector( '.team__title-band' );
	const about         = presentation.querySelector( '.about' );
	const aboutCard     = presentation.querySelector( '.about__portrait-card' );
	const aboutPortrait = presentation.querySelector( '.about__portrait' );
	const aboutTitle    = presentation.querySelector( '.about__title' );
	const aboutCopy     = presentation.querySelector( '.about__copy' );

	const heroPanelStyles = window.getComputedStyle( heroPanel );
	const titleBandStyles = window.getComputedStyle( titleBand );
	const aboutCardStyles = window.getComputedStyle( aboutCard );
	const heroBoxShadow   = heroPanelStyles.boxShadow;
	const teamBoxShadow   = titleBandStyles.boxShadow;
	const aboutBoxShadow  = aboutCardStyles.boxShadow;

	gsap.registerPlugin( ScrollTrigger );

	// Initial setup for the presentation transition.
	const getInitialCircleDiameter = Math.max( window.innerWidth, window.innerHeight ) * 1.2;
	const circleInitialSetup = {
		x: () => window.innerWidth * 0.2,
		y: () => ( window.innerHeight - getInitialCircleDiameter ) / 2,
		width: getInitialCircleDiameter,
		height: getInitialCircleDiameter,
		scale: 1,
	};
	gsap.set( circle, circleInitialSetup );

	gsap.set( box, {
		...getRelativeBounds( heroPanel, presentation ),
		'--box-overlay-opacity': 1,
		borderRadius: heroPanelStyles.borderRadius,
		boxShadow: heroBoxShadow,
		rotation: 0,
		scale: 1,
	} );

	const members = gsap.utils.toArray( '.team-member' );
	gsap.set( members, {
		autoAlpha: 0,
		xPercent: ( index ) => [ -190, -85, 85, 190 ][ index ],
		yPercent: ( index ) => ( index % 2 === 0 ? -12 : 12 ),
		scale: 0.82,
	} );

	gsap.set( titleBand, { autoAlpha: 0, yPercent: 110 } );

	gsap.set( aboutPortrait, { autoAlpha: 0, y: 24, scale: 0.96 } );

	gsap.set( aboutTitle, { autoAlpha: 0, x: 48 } );

	gsap.set( aboutCopy, { autoAlpha: 0, y: 24 } );

	document.documentElement.classList.add( 'has-scroll-animation' );
	
	// Initialize the presentation transition timeline.
	const transition = gsap.timeline( {
		defaults: { ease: 'none' },
		scrollTrigger: {
			trigger: presentation,
			start: 'top top',
			end: '+=640%',
			pin: true,
			scrub: 0.8,
			anticipatePin: 1,
			invalidateOnRefresh: true,
		},
	} );

	transition
	.set(
		circle,
		circleInitialSetup,
		0
	)
	.to(
		circle,
		{
			x: () =>
				window.innerWidth *
				( window.matchMedia( '(max-width: 48rem)' ).matches
					? -0.45
					: -0.1 ),
			y: () => window.innerHeight * 0.25,
			width: () =>
				window.innerWidth *
				( window.matchMedia( '(max-width: 48rem)' ).matches
					? 1.9
					: 1.2 ),
			height: () =>
				window.innerWidth *
				( window.matchMedia( '(max-width: 48rem)' ).matches
					? 1.9
					: 1.2 ),
			scale: 1,
			duration: 2.05,
			ease: 'power1.inOut',
		},
		0.1
	)
	.to(
		circle,
		{
			x: () => -getInitialCircleDiameter * 0.8,
			y: () => ( window.innerHeight - getInitialCircleDiameter ) / 2,
			width: getInitialCircleDiameter,
			height: getInitialCircleDiameter,
			scale: 1,
		},
		2.4
	);

	transition
	.set(
		box,
		{
			x: () => getRelativeBounds( heroPanel, presentation ).x,
			y: () => getRelativeBounds( heroPanel, presentation ).y,
			width: () => getRelativeBounds( heroPanel, presentation ).width,
			height: () =>
				getRelativeBounds( heroPanel, presentation ).height,
			'--box-overlay-opacity': 1,
			borderRadius: () =>
				window.getComputedStyle( heroPanel ).borderRadius,
			boxShadow: heroBoxShadow,
			rotation: 0,
			scale: 1,
			zIndex: 1,
		},
		0
	)
	.to(
		box,
		{
			x: () => getRelativeBounds( titleBand, presentation ).x,
			y: () => getRelativeBounds( titleBand, presentation ).y,
			width: () => getRelativeBounds( titleBand, presentation ).width,
			height: () =>
				getRelativeBounds( titleBand, presentation ).height,
			'--box-overlay-opacity': 0,
			borderRadius: () =>
				window.getComputedStyle( titleBand ).borderRadius,
			boxShadow: teamBoxShadow,
			rotation: () =>
				window.matchMedia( '(max-width: 48rem)' ).matches ? 1 : 1.1,
			scale: 1.02,
			duration: 2.05,
			ease: 'power1.inOut',
		},
		0.1
	)
	.set( box, { zIndex: 3 }, 1.2 )
	.to(
		box,
		{
			x: () => getRelativeBounds( aboutCard, presentation ).x,
			y: () => getRelativeBounds( aboutCard, presentation ).y,
			width: () => getRelativeBounds( aboutCard, presentation ).width,
			height: () =>
				getRelativeBounds( aboutCard, presentation ).height,
			borderRadius: () =>
				window.getComputedStyle( aboutCard ).borderRadius,
			boxShadow: aboutBoxShadow,
			rotation: 0,
			scale: 1,
			duration: 2.05,
			ease: 'power1.inOut',
		},
		2.4
	);




	

	transition
		.addLabel( 'hero', 0 )
		.to(
			'.hero__copy',
			{
				autoAlpha: 0,
				y: -24,
				filter: 'blur(8px)',
				duration: 0.55,
			},
			0.15
		)
		.to(
			members[ 0 ],
			{
				autoAlpha: 1,
				xPercent: 0,
				yPercent: 0,
				scale: 1,
				duration: 0.85,
			},
			0.72
		)
		.to(
			members[ 3 ],
			{
				autoAlpha: 1,
				xPercent: 0,
				yPercent: 0,
				scale: 1,
				duration: 0.85,
			},
			0.72
		)
		.to(
			members[ 1 ],
			{
				autoAlpha: 1,
				xPercent: 0,
				yPercent: 0,
				scale: 1,
				duration: 0.85,
			},
			1.02
		)
		.to(
			members[ 2 ],
			{
				autoAlpha: 1,
				xPercent: 0,
				yPercent: 0,
				scale: 1,
				duration: 0.85,
			},
			1.02
		)
		.to( '.hero', { autoAlpha: 0, duration: 0.4 }, 1.2 )
		.to(
			'.team__title-band',
			{ autoAlpha: 1, yPercent: 0, duration: 0.75 },
			1.55
		)
		.addLabel( 'team', 2.3 )
		.to(
			'.team-member, .team__title-band',
			{ autoAlpha: 0, y: -20, duration: 0.6 },
			2.35
		)
		.to(
			aboutPortrait,
			{ autoAlpha: 1, y: 0, scale: 1, duration: 0.85 },
			3.05
		)
		.to( aboutTitle, { autoAlpha: 1, x: 0, duration: 0.9 }, 3.25 )
		.to( aboutCopy, { autoAlpha: 1, y: 0, duration: 0.8 }, 3.55 )
		.set( '.team', { pointerEvents: 'none' }, 4.5 )
		.set( about, { pointerEvents: 'auto' }, 4.6 )
		.addLabel( 'about', 4.6 );

	const sceneNavigation = initSceneNavigation( transition );
}
