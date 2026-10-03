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

	const logoCircle        = document.querySelector( '.site-header__logo-circle' );

	const circle            = presentation.querySelector( '.circle' );
	const box               = presentation.querySelector( '.box' );

	const heroSection       = presentation.querySelector( '.hero' );
	const heroSlide         = presentation.querySelector( '.hero__slide' );
	const heroCopy          = presentation.querySelector( '.hero__copy' );
	
	const skills            = presentation.querySelector( '.skills' );
	const skillsTitleBand   = presentation.querySelector( '.skills__title-band' );

	const aboutSection      = presentation.querySelector( '.about' );
	const aboutPortrait     = presentation.querySelector( '.about__portrait' );
	const aboutPortraitCard = presentation.querySelector( '.about__portrait-card' );
	const aboutTitle        = presentation.querySelector( '.about__title' );
	const aboutCopy         = presentation.querySelector( '.about__copy' );

	const heroSlideStyles         = window.getComputedStyle( heroSlide );
	const skillsTitleBandStyles   = window.getComputedStyle( skillsTitleBand );
	const aboutPortraitCardStyles = window.getComputedStyle( aboutPortraitCard );
	const heroBoxShadow           = heroSlideStyles.boxShadow;
	const skillsBoxShadow         = skillsTitleBandStyles.boxShadow;
	const aboutBoxShadow          = aboutPortraitCardStyles.boxShadow;

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
		...getRelativeBounds( heroSlide, presentation ),
		'--box-overlay-opacity': 1,
		borderRadius: heroSlideStyles.borderRadius,
		boxShadow: heroBoxShadow,
		rotation: 0,
		scale: 1,
	} );

	const skillsItems = gsap.utils.toArray( '.skills-item' );
	gsap.set( skillsItems, {
		autoAlpha: 0,
		xPercent: ( index ) => [ -190, -85, 85, 190 ][ index ],
		yPercent: ( index ) => ( index % 2 === 0 ? -12 : 12 ),
		scale: 0.82,
	} );

	gsap.set( skillsTitleBand, { autoAlpha: 0, yPercent: 110 } );

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

	// Circle.
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

	// Box.
	transition
		.set(
			box,
			{
				x: () => getRelativeBounds( heroSlide, presentation ).x,
				y: () => getRelativeBounds( heroSlide, presentation ).y,
				width: () => getRelativeBounds( heroSlide, presentation ).width,
				height: () =>
					getRelativeBounds( heroSlide, presentation ).height,
				'--box-overlay-opacity': 1,
				borderRadius: () =>
					window.getComputedStyle( heroSlide ).borderRadius,
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
				x: () => getRelativeBounds( skillsTitleBand, presentation ).x,
				y: () => getRelativeBounds( skillsTitleBand, presentation ).y,
				width: () => getRelativeBounds( skillsTitleBand, presentation ).width,
				height: () =>
					getRelativeBounds( skillsTitleBand, presentation ).height,
				'--box-overlay-opacity': 0,
				borderRadius: () =>
					window.getComputedStyle( skillsTitleBand ).borderRadius,
				boxShadow: skillsBoxShadow,
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
				x: () => getRelativeBounds( aboutPortraitCard, presentation ).x,
				y: () => getRelativeBounds( aboutPortraitCard, presentation ).y,
				width: () => getRelativeBounds( aboutPortraitCard, presentation ).width,
				height: () =>
					getRelativeBounds( aboutPortraitCard, presentation ).height,
				borderRadius: () =>
					window.getComputedStyle( aboutPortraitCard ).borderRadius,
				boxShadow: aboutBoxShadow,
				rotation: 0,
				scale: 1,
				duration: 2.05,
				ease: 'power1.inOut',
			},
			2.4
		);

	// Hero.
	transition
		.addLabel( 'hero', 0 )
		.to(
			heroCopy,
			{
				autoAlpha: 0,
				y: -24,
				filter: 'blur(8px)',
				duration: 0.55,
			},
			0.15
		)
		.to( heroSection, { autoAlpha: 0, duration: 0.4 }, 1.2 );

	// Skills.
	transition
		.to(
			skillsItems[ 0 ],
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
			skillsItems[ 3 ],
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
			skillsItems[ 1 ],
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
			skillsItems[ 2 ],
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
			skillsTitleBand,
			{ autoAlpha: 1, yPercent: 0, duration: 0.75 },
			1.55
		)
		.addLabel( 'skills', 2.3 )
		.to(
			[ ...skillsItems, skillsTitleBand ],
			{ autoAlpha: 0, y: -20, duration: 0.6 },
			2.35
		)
		.set( skills, { pointerEvents: 'none' }, 4.5 );

	// About.
	transition
		.to( logoCircle, { fill: '#9abbdb' }, 3.05 )
		.to(
			aboutPortrait,
			{ autoAlpha: 1, y: 0, scale: 1, duration: 0.85 },
			3.05
		)
		.to( aboutTitle, { autoAlpha: 1, x: 0, duration: 0.9 }, 3.25 )
		.to( aboutCopy, { autoAlpha: 1, y: 0, duration: 0.8 }, 3.55 )
		.set( aboutSection, { pointerEvents: 'auto' }, 4.6 )
		.addLabel( 'about', 4.6 );

	initSceneNavigation( transition );
}
