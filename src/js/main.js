import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../scss/main.scss";

const screen = document.querySelector(".hero__screen");
const presentation = document.querySelector(".presentation");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (screen && !prefersReducedMotion) {
	gsap.timeline({ defaults: { ease: "power3.out" } })
		.from(screen, { opacity: 0, duration: 0.8 })
		.from(".hero__bar > *", { opacity: 0, y: -16, stagger: 0.1, duration: 0.6 }, "-=0.7")
		.from(".hero__copy > *", { opacity: 0, y: 35, stagger: 0.12, duration: 0.8 }, "-=0.45")
		.from(".hero__index, .hero__footer", { opacity: 0, duration: 0.8 }, "-=0.4");
}

if (presentation && !prefersReducedMotion) {
	gsap.registerPlugin(ScrollTrigger);
	document.documentElement.classList.add("has-scroll-animation");

	const members = gsap.utils.toArray(".team-member");
	const transition = gsap.timeline({
		defaults: { ease: "none" },
		scrollTrigger: {
			trigger: presentation,
			start: "top top",
			end: "+=320%",
			pin: true,
			scrub: 0.8,
			anticipatePin: 1,
		},
	});

	gsap.set(".team", { backgroundColor: "rgba(172, 210, 235, 0)" });
	gsap.set(".team__header", { autoAlpha: 0, y: -18 });
	gsap.set(".team__arch", {
		autoAlpha: 0,
		top: "11%",
		right: "0%",
		bottom: "11%",
		left: "3.5%",
		borderRadius: "4rem 0 0 4rem",
	});
	gsap.set(members, {
		autoAlpha: 0,
		xPercent: (index) => [-190, -85, 85, 190][index],
		yPercent: (index) => (index % 2 === 0 ? -12 : 12),
		scale: 0.82,
	});
	gsap.set(".team__title-band", { autoAlpha: 0, yPercent: 110 });

	transition
		.addLabel("hero", 0)
		.to(".hero__copy, .hero__index, .hero__accent", {
			autoAlpha: 0,
			y: -24,
			filter: "blur(8px)",
			duration: 0.55,
		}, 0.15)
		.to(".hero__footer, .hero__scroll", { autoAlpha: 0, duration: 0.35 }, 0.15)
		.to(".team__arch", { autoAlpha: 1, duration: 0.3 }, 0.22)
		.to(".team", { backgroundColor: "#acd2eb", duration: 0.9 }, 0.25)
		.to(".team__arch", {
			top: "19%",
			right: "-12%",
			bottom: "-18%",
			left: "-12%",
			borderRadius: "50% 50% 0 0 / 28% 28% 0 0",
			duration: 1.25,
		}, 0.35)
		.to(".hero__bar", { autoAlpha: 0, duration: 0.35 }, 0.55)
		.to(".team__header", { autoAlpha: 1, y: 0, duration: 0.45 }, 0.68)
		.to(members[0], { autoAlpha: 1, xPercent: 0, yPercent: 0, scale: 1, duration: 0.85 }, 0.72)
		.to(members[3], { autoAlpha: 1, xPercent: 0, yPercent: 0, scale: 1, duration: 0.85 }, 0.72)
		.to(members[1], { autoAlpha: 1, xPercent: 0, yPercent: 0, scale: 1, duration: 0.85 }, 1.02)
		.to(members[2], { autoAlpha: 1, xPercent: 0, yPercent: 0, scale: 1, duration: 0.85 }, 1.02)
		.to(".hero", { autoAlpha: 0, duration: 0.4 }, 1.2)
		.to(".team__title-band", { autoAlpha: 1, yPercent: 0, duration: 0.75 }, 1.55)
		.addLabel("team", 2.3);

	const scrollLink = document.querySelector(".hero__scroll");

	if (scrollLink) {
		scrollLink.addEventListener("click", (event) => {
			event.preventDefault();
			window.scrollTo({ top: transition.scrollTrigger.end, behavior: "smooth" });
		});
	}
}