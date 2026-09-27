import { gsap } from 'gsap';

export function initHeroIntro() {

	const screen = document.querySelector( '.hero__screen' );
	if ( ! screen ) {
		return;
	}

	gsap.timeline( { defaults: { ease: 'power3.out' } } )
		.from( screen, { opacity: 0, duration: 0.8 } )
		.from(
			'.hero__copy > *',
			{ opacity: 0, y: 35, stagger: 0.12, duration: 0.8 },
			'-=0.45'
		)
}
