import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

const INTERACTIVE_SELECTOR =
	'a, button, input, select, textarea, [contenteditable="true"]';
const SETTLE_TOLERANCE = 0.005;
const SCROLL_TOLERANCE = 2;

function getContactPanel( event ) {
	return typeof event.target?.closest === 'function'
		? event.target.closest( '.contact__panel' )
		: null;
}

function canScrollPanel( panel, direction ) {
	if ( ! panel || panel.scrollHeight <= panel.clientHeight ) {
		return false;
	}

	return direction < 0
		? panel.scrollTop > SCROLL_TOLERANCE
		: panel.scrollTop < panel.scrollHeight - panel.clientHeight - SCROLL_TOLERANCE;
}

function isInteractiveEvent( event ) {
	return typeof event.target?.closest === 'function'
		? Boolean( event.target.closest( INTERACTIVE_SELECTOR ) )
		: false;
}

function getKeyboardDirection( event ) {
	if ( event.altKey || event.ctrlKey || event.metaKey ) {
		return 0;
	}

	if ( event.key === 'ArrowDown' || event.key === 'PageDown' ) {
		return 1;
	}

	if ( event.key === 'ArrowUp' || event.key === 'PageUp' ) {
		return -1;
	}

	if ( event.key === ' ' ) {
		return event.shiftKey ? -1 : 1;
	}

	return 0;
}

export function initSceneNavigation( transition ) {
	const scrollTrigger = transition.scrollTrigger;
	const scenes = Object.entries( transition.labels )
		.map( ( [ name, time ] ) => ( { name, time } ) )
		.sort(
			( firstScene, secondScene ) => firstScene.time - secondScene.time
		);

	if ( ! scrollTrigger || scenes.length < 2 ) {
		return null;
	}

	gsap.registerPlugin( Observer, ScrollToPlugin );

	let activeScrollTween;
	let settleCheck;
	let isTransitioning = false;

	const getSceneProgress = ( scene ) => scene.time / transition.duration();
	const getSceneScrollPosition = ( scene ) =>
		scrollTrigger.start +
		getSceneProgress( scene ) * ( scrollTrigger.end - scrollTrigger.start );
	const isWithinPresentation = () =>
		window.scrollY >= scrollTrigger.start - SCROLL_TOLERANCE &&
		window.scrollY <= scrollTrigger.end + SCROLL_TOLERANCE;
	const canLeavePresentation = ( direction ) => {
		if ( direction < 0 ) {
			return scrollTrigger.start > SCROLL_TOLERANCE;
		}

		const maximumScroll =
			document.documentElement.scrollHeight - window.innerHeight;

		return maximumScroll > scrollTrigger.end + SCROLL_TOLERANCE;
	};
	const getDirectionalScene = ( direction ) => {
		const currentProgress = scrollTrigger.progress;
		const settledIndex = scenes.findIndex(
			( scene ) =>
				Math.abs( getSceneProgress( scene ) - currentProgress ) <=
				SETTLE_TOLERANCE
		);

		if ( settledIndex >= 0 ) {
			return scenes[ settledIndex + direction ];
		}

		if ( direction > 0 ) {
			return scenes.find(
				( scene ) => getSceneProgress( scene ) > currentProgress
			);
		}

		return scenes.findLast(
			( scene ) => getSceneProgress( scene ) < currentProgress
		);
	};
	const unlockWhenSettled = ( targetProgress, deadline ) => {
		settleCheck?.kill();

		if (
			Math.abs( transition.progress() - targetProgress ) <=
				SETTLE_TOLERANCE ||
			Date.now() >= deadline
		) {
			isTransitioning = false;
			settleCheck = null;
			return;
		}

		settleCheck = gsap.delayedCall( 0.05, () => {
			unlockWhenSettled( targetProgress, deadline );
		} );
	};
	const goToScene = ( sceneName, options = {} ) => {
		const targetIndex = scenes.findIndex(
			( scene ) => scene.name === sceneName
		);

		if ( targetIndex < 0 || ( isTransitioning && ! options.force ) ) {
			return false;
		}

		const targetScene = scenes[ targetIndex ];
		const targetProgress = getSceneProgress( targetScene );

		isTransitioning = true;
		settleCheck?.kill();
		activeScrollTween?.kill();
		activeScrollTween = gsap.to( window, {
			duration: options.duration ?? 1.35,
			ease: 'power2.inOut',
			overwrite: 'auto',
			scrollTo: {
				y: getSceneScrollPosition( targetScene ),
				autoKill: false,
			},
			onComplete: () => {
				activeScrollTween = null;
				unlockWhenSettled( targetProgress, Date.now() + 1600 );
			},
		} );

		return true;
	};
	const moveBy = ( direction ) => {
		if ( isTransitioning || ! isWithinPresentation() ) {
			return false;
		}

		const targetScene = getDirectionalScene( direction );

		if ( ! targetScene ) {
			if ( ! canLeavePresentation( direction ) ) {
				return false;
			}

			const boundaryPosition =
				direction > 0
					? scrollTrigger.end + SCROLL_TOLERANCE + 1
					: Math.max( 0, scrollTrigger.start - SCROLL_TOLERANCE - 1 );

			observer.disable();
			window.scrollTo( {
				top: boundaryPosition,
				behavior: 'auto',
			} );
			return true;
		}

		return goToScene( targetScene.name );
	};

	const handleGesture = ( self, direction ) => {
		if ( isInteractiveEvent( self.event ) ) {
			return;
		}

		const panel = getContactPanel( self.event );

		if ( canScrollPanel( panel, direction ) ) {
			panel.scrollTop += direction * Math.abs( self.deltaY );
			return;
		}

		moveBy( direction );
	};
	const observer = Observer.create( {
		target: window,
		type: 'wheel,touch',
		ignore: INTERACTIVE_SELECTOR,
		wheelSpeed: -1,
		tolerance: 12,
		preventDefault: true,
		onUp: ( self ) => handleGesture( self, 1 ),
		onDown: ( self ) => handleGesture( self, -1 ),
	} );

	const syncObserver = () => {
		if ( isWithinPresentation() ) {
			observer.enable();
		} else {
			observer.disable();
		}
	};
	const handleKeydown = ( event ) => {
		if ( isInteractiveEvent( event ) ) {
			return;
		}

		const direction = getKeyboardDirection( event );

		if ( direction && canScrollPanel( getContactPanel( event ), direction ) ) {
			return;
		}

		if ( direction && moveBy( direction ) ) {
			event.preventDefault();
		}
	};

	window.addEventListener( 'keydown', handleKeydown );
	window.addEventListener( 'scroll', syncObserver, { passive: true } );
	document.querySelector( '.site-header__contact[href="#contact"]' )?.addEventListener( 'click', ( event ) => {
		if ( event.defaultPrevented || event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ) {
			return;
		}

		if ( goToScene( 'contact', { force: true } ) ) {
			event.preventDefault();
		}
	} );
	syncObserver();

	return { goToScene };
}
