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

	const body = document.body;

	const logoCircle = document.querySelector( '.site-header__logo-circle' );

	const circle = presentation.querySelector( '.circle' );
	const box    = presentation.querySelector( '.box' );

	const heroSection     = presentation.querySelector( '.hero' );
	const heroSlide       = presentation.querySelector( '.hero__slide' );
	const heroCopy        = presentation.querySelector( '.hero__copy' );
	const heroSlideStyles = window.getComputedStyle( heroSlide );
	const heroBoxShadow   = heroSlideStyles.boxShadow;
	
	const skills                = presentation.querySelector( '.skills' );
	const skillsTitleBand       = presentation.querySelector( '.skills__title-band' );
	const skillsItems           = gsap.utils.toArray( '.skills-item' );
	const skillsTitleBandStyles = window.getComputedStyle( skillsTitleBand );
	const skillsBoxShadow       = skillsTitleBandStyles.boxShadow;

	const aboutSection            = presentation.querySelector( '.about' );
	const aboutPortrait           = presentation.querySelector( '.about__portrait' );
	const aboutPortraitCard       = presentation.querySelector( '.about__portrait-card' );
	const aboutTitle              = presentation.querySelector( '.about__title' );
	const aboutCopy               = presentation.querySelector( '.about__copy' );
	const aboutPortraitCardStyles = window.getComputedStyle( aboutPortraitCard );
	const aboutBoxShadow          = aboutPortraitCardStyles.boxShadow;

	const projectsSection     = presentation.querySelector( '.projects' );
	const projectsStack       = presentation.querySelector( '.projects__stack' );
	const projectsContent     = presentation.querySelector( '.projects__content' );
	const projectStage        = presentation.querySelector( '.projects__detail-stage' );
	const projectDetails      = gsap.utils.toArray( '.projects__detail', presentation );
	const projectsImages      = gsap.utils.toArray( '.projects__image', presentation );
	const projectsStackStyles = window.getComputedStyle( projectsStack );
	const projectsBoxShadow   = projectsStackStyles.boxShadow;

	const contactSection     = presentation.querySelector( '.contact' );
	const contactPanel       = presentation.querySelector( '.contact__panel' );
	const contactContent     = gsap.utils.toArray( '.contact__item', presentation );
	const contactPanelStyles = window.getComputedStyle( contactPanel );
	const contactBoxShadow   = contactPanelStyles.boxShadow;
	const contactStart       = 7.3 + projectsImages.length * 2.3;

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
	gsap.set( projectsSection, { autoAlpha: 0 } );
	gsap.set( projectDetails, { autoAlpha: 0 } );
	gsap.set( projectsContent, { autoAlpha: 0, x: -32 } );
	gsap.set( projectsImages, { autoAlpha: 0, y: 64, scale: 0.9, } );
	gsap.set( contactSection, { autoAlpha: 0 } );
	gsap.set( contactContent, { autoAlpha: 0, y: 24 } );

	document.documentElement.classList.add( 'has-scroll-animation' );
	
	// Initialize the presentation transition timeline.
	const transition = gsap.timeline( {
		defaults: { ease: 'none' },
		scrollTrigger: {
			trigger: presentation,
			start: 'top top',
			end: `+=${ 1120 + projectsImages.length * 320 }%`,
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
		)
		.to(
			circle,
			{
				x: () => window.innerWidth * 0.7,
				y: () => ( window.innerHeight - getInitialCircleDiameter ) / 2,
				width: getInitialCircleDiameter,
				height: getInitialCircleDiameter,
				duration: 2.05,
				ease: 'power1.inOut',
			},
			4.85
		)
		.to(
			circle,
			{
				x: () => window.innerWidth * 0.08,
				y: () =>
					( window.innerHeight -
						Math.max( window.innerWidth, window.innerHeight ) *
							2 ) /
					2,
				width: () =>
					Math.max( window.innerWidth, window.innerHeight ) * 2,
				height: () =>
					Math.max( window.innerWidth, window.innerHeight ) * 2,
				duration: 1.5,
				ease: 'power2.inOut',
			},
			7.3
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
		)
		.to(
			box,
			{
				x: () => window.innerWidth * 0.85,
				y: () => ( window.innerHeight - window.innerHeight * 0.9 ) / 2,
				width: window.innerWidth * 0.2,
				height: window.innerHeight * 0.9,
				borderRadius: projectsStackStyles.borderRadius,
				boxShadow: projectsBoxShadow,
				rotation: 0,
				duration: 2.05,
				ease: 'power1.inOut',
			},
			4.85
		)
		.to(
			box,
			{
				x: () => getRelativeBounds( projectStage, presentation ).x,
				y: () => getRelativeBounds( projectStage, presentation ).y,
				width: () =>
					getRelativeBounds( projectStage, presentation ).width,
				height: () =>
					getRelativeBounds( projectStage, presentation ).height,
				borderRadius: '4px',
				duration: 1.5,
				ease: 'power2.inOut',
			},
			7.3
		)
		.to( box, {
			x: () => getRelativeBounds( contactPanel, presentation ).x,
			y: () => getRelativeBounds( contactPanel, presentation ).y,
			width: () => getRelativeBounds( contactPanel, presentation ).width,
			height: () => getRelativeBounds( contactPanel, presentation ).height,
			borderRadius: () => window.getComputedStyle( contactPanel ).borderRadius,
			backgroundColor: '#f8f8f7',
			boxShadow: contactBoxShadow,
			rotation: 0,
			duration: 1.5,
			ease: 'power2.inOut',
		}, contactStart );

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
		.addLabel( 'about', 4.6 )
		.to( aboutSection, { autoAlpha: 0, duration: 0.5 }, 4.85 )
		.set( aboutSection, { pointerEvents: 'none' }, 5.35 );

	// Projects.
	transition
		.to( body, { backgroundColor: '#0960bb' }, 5.35 )
		.to( logoCircle, { fill: '#f5f4f0' }, 5.35 )
		.set( projectsSection, { autoAlpha: 1 }, 5.35 )
		.to( projectsContent, { autoAlpha: 1, x: 0, duration: 0.8 }, 5.8 )
		.to(
			projectsImages,
			{
				autoAlpha: 1,
				y: 0,
				scale: 1,
				duration: 0.75,
				stagger: 0.14,
				ease: 'power2.out',
			},
			5.9
		)
		.addLabel( 'projects', 7.05 )
		.set( projectsSection, { pointerEvents: 'auto' }, 7.05 )
		.to( projectsContent, { autoAlpha: 0, duration: 0.4 }, 7.3 );

	const stackRotations = [ -11, 9, -6, 12 ];
	const getOffscreenImageX = ( image ) =>
		window.innerWidth * 1.15 - getRelativeBounds( image, presentation ).x;
	const getActiveImageX = ( image ) =>
		getRelativeBounds( projectStage, presentation ).x -
		getRelativeBounds( image, presentation ).x;
	const getActiveImageY = ( image ) =>
		getRelativeBounds( projectStage, presentation ).y -
		getRelativeBounds( image, presentation ).y;

	// Project image.
	projectsImages.forEach( ( image, index ) => {
		const sceneStart    = 7.3 + index * 2.3;
		const previousImage = projectsImages[ index - 1 ];

		if ( index === 0 ) {
			projectsImages.slice( 1 ).forEach( ( stackedImage ) => {
				transition.to(
					stackedImage,
					{
						x: () => getOffscreenImageX( stackedImage ),
						autoAlpha: 0,
						duration: 1.5,
						ease: 'power2.inOut',
					},
					sceneStart
				);
			} );
		} else {
			transition
				.to(
					previousImage,
					{
						x: () => getOffscreenImageX( previousImage ),
						y: 0,
						width: '76%',
						height: '65%',
						rotation: stackRotations[ index - 1 ],
						autoAlpha: 0,
						zIndex: 0,
						duration: 1.5,
						ease: 'power2.inOut',
					},
					sceneStart
				)
				.to(
					projectDetails[ index - 1 ],
					{ autoAlpha: 0, duration: 0.3 },
					sceneStart
				);
		}

		transition
			.set( image, { zIndex: 1 }, sceneStart )
			.to(
				image,
				{
					x: () => getActiveImageX( image ),
					y: () => getActiveImageY( image ),
					width: () =>
						getRelativeBounds( projectStage, presentation ).width,
					height: () =>
						getRelativeBounds( projectStage, presentation ).height,
					rotation: 0,
					scale: 1,
					autoAlpha: 1,
					duration: 1.5,
					ease: 'power2.inOut',
				},
				sceneStart
			)
			.to(
				projectDetails[ index ],
				{ autoAlpha: 1, duration: 0.5 },
				sceneStart + 1
			)
			.set( image, { autoAlpha: 1 }, sceneStart + 1.8 )
			.addLabel( `project-${ index + 1 }`, sceneStart + 1.8 );
	} );

	// Contact.
	// const contactStart = 7.3 + projectsImages.length * 2.3;
	const contactDuration = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ? 0 : 1.5;

	transition
		.to( projectsImages[ projectsImages.length - 1 ], {
			x: () => getOffscreenImageX( projectsImages[ projectsImages.length - 1 ] ),
			autoAlpha: 0,
			duration: contactDuration,
			ease: 'power2.inOut',
		}, contactStart )
		.to( projectDetails[ projectDetails.length - 1 ], { autoAlpha: 0, duration: 0.3 }, contactStart )
		.set( projectsSection, { pointerEvents: 'none' }, contactStart + 0.3 )
		.set( projectsSection, { autoAlpha: 0 }, contactStart + 1.5 )
		.to( circle, {
			x: () => window.innerWidth * ( window.matchMedia( '(max-width: 48rem)' ).matches ? 0.3 : 0.42 ),
			y: () => -Math.max( window.innerWidth, window.innerHeight ) * 0.12,
			width: () => Math.max( window.innerWidth, window.innerHeight ) * 1.2,
			height: () => Math.max( window.innerWidth, window.innerHeight ) * 1.2,
			backgroundColor: '#e4e9ee',
			duration: contactDuration,
			ease: 'power2.inOut',
		}, contactStart )
		.set( contactSection, { autoAlpha: 1 }, contactStart )
		.to( contactContent, {
			autoAlpha: 1,
			y: 0,
			duration: contactDuration ? 0.6 : 0,
			stagger: 0.08,
			ease: 'power2.out',
		}, contactStart + 0.85 )
		.to( document.querySelector( '.site-header' ), { color: '#fff', duration: 0.5 }, contactStart )
		.to( document.querySelector( '.site-header__contact' ), {
			color: () => window.matchMedia( '(max-width: 48rem)' ).matches ? '#fff' : '#111318',
			duration: 0.5,
		}, contactStart )
		.to( document.querySelector( '.site-header__logo svg' ), { color: '#fff', duration: 0.5 }, contactStart )
		.to( logoCircle, { fill: '#fff', duration: 0.5 }, contactStart )
		.set( contactSection, { pointerEvents: 'auto' }, contactStart + 1.8 )
		.addLabel( 'contact', contactStart + 1.8 );

	initSceneNavigation( transition );
}
