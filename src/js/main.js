import '../scss/main.scss';

import { gsap } from 'gsap';
import { initHeroIntro } from './animations/hero-intro';
import { initPresentationTransition } from './animations/presentation-transition';

const motion = gsap.matchMedia();
let hasInitialized = false;

motion.add( '(prefers-reduced-motion: no-preference)', ( mediaContext ) => {
	let animation;
	mediaContext.ignore( () => {
		animation = gsap.context( () => {} );
	} );
	let navigation;
	let destroyed = false;

	const destroy = () => {
		if ( destroyed ) {
			return;
		}

		destroyed = true;
		const target = navigation?.getCurrentTarget();
		const focused = document.body.ownerDocument.activeElement;
		const restoreFocus = target?.contains( focused );
		navigation?.destroy();
		animation.revert();
		document.documentElement.classList.remove( 'has-scroll-animation' );

		if ( target ) {
			target.scrollIntoView( { block: 'start', behavior: 'instant' } );
			if ( restoreFocus ) {
				focused.focus( { preventScroll: true } );
			}
		}
	};

	try {
		const initialTarget = hasInitialized
			? [ ...document.querySelectorAll( '.section' ) ].reduce(
					( nearest, section ) =>
						Math.abs( section.getBoundingClientRect().top ) <
						Math.abs( nearest.getBoundingClientRect().top )
							? section
							: nearest
			  )
			: null;
		const required = [
			'.presentation',
			'.hero__slide',
			'.hero__copy',
			'.hero__screen',
			'.circle',
			'.box',
			'.site-header__logo-circle',
			'.skills__title-band',
			'.about__portrait',
			'.about__portrait-card',
			'.about__title',
			'.about__copy',
			'.projects__stack',
			'.projects__content',
			'.projects__detail-stage',
			'.contact__panel',
			'#hero',
			'#skills',
			'#about',
			'#projects',
			'#contact',
		];

		if (
			required.some(
				( selector ) => ! document.querySelector( selector )
			) ||
			document.querySelectorAll( '.skills-item' ).length !== 4 ||
			document.querySelectorAll( '.projects__image' ).length !== 4 ||
			document.querySelectorAll( '.projects__detail' ).length !== 4
		) {
			return destroy;
		}

		document.documentElement.classList.add( 'has-scroll-animation' );
		mediaContext.ignore( () => {
			animation.add( () => {
				navigation = initPresentationTransition( initialTarget );
				if ( navigation.getCurrentTarget()?.id === 'hero' ) {
					initHeroIntro();
				}
			} );
		} );
		hasInitialized = true;
	} catch {
		destroy();
	}

	return destroy;
} );
