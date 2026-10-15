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
		: panel.scrollTop <
				panel.scrollHeight - panel.clientHeight - SCROLL_TOLERANCE;
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

export function initSceneNavigation( transition, initialTarget ) {
	const scrollTrigger = transition.scrollTrigger;
	const projectDetails = [
		...document.querySelectorAll( '.projects__detail' ),
	];
	const scenes = Object.entries( transition.labels )
		.map( ( [ name, time ] ) => ( {
			name,
			time,
			target: name.startsWith( 'project-' )
				? projectDetails[ Number( name.slice( 8 ) ) - 1 ]
				: document.getElementById( name ),
		} ) )
		.sort(
			( firstScene, secondScene ) => firstScene.time - secondScene.time
		);

	if (
		! scrollTrigger ||
		scenes.length < 2 ||
		scenes.some( ( scene ) => ! scene.target )
	) {
		throw new Error( 'Presentation scenes are incomplete.' );
	}

	gsap.registerPlugin( Observer, ScrollToPlugin );

	let activeScrollTween;
	let settleCheck;
	let isTransitioning = false;
	let destroyed = false;
	const previousUpdate = transition.eventCallback( 'onUpdate' );
	const controlled = [
		...document.querySelectorAll(
			'.section, .projects__detail, .projects__content, .projects__image'
		),
	];
	const originalInert = new Map(
		controlled.map( ( node ) => [ node, node.inert ] )
	);
	const getCurrentScene = () =>
		scenes.reduce( ( nearest, scene ) =>
			Math.abs( scene.time - transition.time() ) <
			Math.abs( nearest.time - transition.time() )
				? scene
				: nearest
		);
	const getCurrentTarget = () => getCurrentScene().target;
	const syncAccessibility = () => {
		if ( destroyed ) {
			return;
		}

		const scene = getCurrentScene();
		const section = scene.target.closest( '.section' );
		const focused = section.ownerDocument.activeElement;
		controlled.forEach( ( node ) => {
			if ( node.matches( '.section' ) ) {
				node.inert = node !== section;
			} else if ( node.matches( '.projects__detail' ) ) {
				node.inert = node !== scene.target;
			} else if ( node.matches( '.projects__content' ) ) {
				node.inert = scene.name !== 'projects';
			} else {
				node.inert =
					scene.name !== 'projects' &&
					node !==
						document.querySelectorAll( '.projects__image' )[
							projectDetails.indexOf( scene.target )
						];
			}
		} );

		if (
			controlled.some(
				( node ) => node.inert && node.contains( focused )
			)
		) {
			document
				.querySelector( '.site-header__contact' )
				?.focus( { preventScroll: true } );
		}
	};

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
	const unlockWhenSettled = ( targetProgress, deadline, focusTarget ) => {
		settleCheck?.kill();
		if ( destroyed ) {
			return;
		}

		if (
			Math.abs( transition.progress() - targetProgress ) <=
				SETTLE_TOLERANCE ||
			Date.now() >= deadline
		) {
			isTransitioning = false;
			settleCheck = null;
			syncAccessibility();
			focusTarget?.focus( { preventScroll: true } );
			return;
		}

		settleCheck = gsap.delayedCall( 0.05, () => {
			unlockWhenSettled( targetProgress, deadline, focusTarget );
		} );
	};
	const goToScene = ( sceneName, options = {} ) => {
		const targetIndex = scenes.findIndex(
			( scene ) => scene.name === sceneName
		);

		if (
			destroyed ||
			targetIndex < 0 ||
			( isTransitioning && ! options.force )
		) {
			return false;
		}

		const targetScene = scenes[ targetIndex ];
		const targetProgress = getSceneProgress( targetScene );

		isTransitioning = true;
		settleCheck?.kill();
		activeScrollTween?.kill();
		if ( options.duration === 0 ) {
			scrollTrigger.scroll( getSceneScrollPosition( targetScene ) );
			scrollTrigger.update();
			scrollTrigger.getTween()?.pause();
			transition.progress( targetProgress );
			unlockWhenSettled(
				targetProgress,
				Date.now(),
				options.focusTarget
			);
			return true;
		}
		activeScrollTween = gsap.to( window, {
			duration: options.duration ?? 1.35,
			ease: 'power2.inOut',
			overwrite: 'auto',
			scrollTo: {
				y: getSceneScrollPosition( targetScene ),
				autoKill: false,
			},
			onComplete: () => {
				if ( destroyed ) {
					return;
				}
				activeScrollTween = null;
				unlockWhenSettled(
					targetProgress,
					Date.now() + 1600,
					options.focusTarget
				);
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
		if (
			self.event.ctrlKey ||
			self.event.touches?.length > 1 ||
			isInteractiveEvent( self.event )
		) {
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
		ignoreCheck: ( event ) => event.ctrlKey || event.touches?.length > 1,
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

		if (
			direction &&
			canScrollPanel( getContactPanel( event ), direction )
		) {
			return;
		}

		if ( direction && ( isTransitioning || moveBy( direction ) ) ) {
			event.preventDefault();
		}
	};
	const navigateToHash = ( hash, duration = 0 ) => {
		let id;
		try {
			id = decodeURIComponent( hash.slice( 1 ) );
		} catch {
			return false;
		}
		const element = document.getElementById( id );
		const scene =
			id === 'content' || id === 'top' || ! id
				? scenes[ 0 ]
				: scenes.find(
						( candidate ) =>
							candidate.target === element ||
							candidate.name === id
				  ) ||
				  scenes.findLast( ( candidate ) =>
						candidate.target.contains( element )
				  );

		if ( ! scene ) {
			return false;
		}

		return goToScene( scene.name, {
			force: true,
			duration,
			focusTarget: element?.matches( '[tabindex], a, button' )
				? element
				: scene.target,
		} );
	};
	const handleClick = ( event ) => {
		const link = event.target.closest?.( 'a[href]' );
		if (
			! link ||
			link.hasAttribute( 'download' ) ||
			( link.target && link.target !== '_self' ) ||
			event.defaultPrevented ||
			event.button !== 0 ||
			event.altKey ||
			event.ctrlKey ||
			event.metaKey ||
			event.shiftKey
		) {
			return;
		}

		const url = new URL( link.href, window.location.href );
		if (
			url.origin !== window.location.origin ||
			url.pathname !== window.location.pathname ||
			url.search !== window.location.search ||
			! url.hash
		) {
			return;
		}

		if ( navigateToHash( url.hash, 1.35 ) ) {
			event.preventDefault();
			if ( window.location.hash !== url.hash ) {
				window.history.pushState( null, '', url.hash );
			}
		}
	};
	const handleHistory = () => navigateToHash( window.location.hash );
	const handleUpdate = () => {
		previousUpdate?.call( transition );
		syncAccessibility();
	};
	const destroy = () => {
		if ( destroyed ) {
			return;
		}
		destroyed = true;
		observer.kill();
		activeScrollTween?.kill();
		settleCheck?.kill();
		transition.eventCallback( 'onUpdate', previousUpdate );
		window.removeEventListener( 'keydown', handleKeydown );
		window.removeEventListener( 'scroll', syncObserver );
		window.removeEventListener( 'hashchange', handleHistory );
		window.removeEventListener( 'popstate', handleHistory );
		document.removeEventListener( 'click', handleClick );
		originalInert.forEach( ( inert, node ) => {
			node.inert = inert;
		} );
	};

	window.addEventListener( 'keydown', handleKeydown );
	window.addEventListener( 'scroll', syncObserver, { passive: true } );
	window.addEventListener( 'hashchange', handleHistory );
	window.addEventListener( 'popstate', handleHistory );
	document.addEventListener( 'click', handleClick );
	transition.eventCallback( 'onUpdate', handleUpdate );
	syncAccessibility();
	syncObserver();
	if ( initialTarget ) {
		navigateToHash( `#${ initialTarget.id }` );
	} else if ( window.location.hash ) {
		handleHistory();
	}

	return { goToScene, getCurrentTarget, destroy };
}
