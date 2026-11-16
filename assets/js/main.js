/*
	Template Name: AI Agentech - AI Agency & Technology HTML Template
	Author: https://themexriver.com/
	Version: 1.0
*/

(function ($) {
"use strict";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/*
	preloader-1 — the gold house of the logo draws itself as the page loads (no set time), then the sheet fades out
*/
function agPreloaderInit() {

	var loader = document.querySelector(".ax-preloader-1");
	if (!loader) return null;

	if (prefersReducedMotion()) {
		return {
			done: function () {
				loader.remove();
				afterPreloader();
			}
		};
	}

	var content = loader.querySelector(".ax-preloader-1-content");
	var fill = loader.querySelector(".ax-preloader-1-logo-fill");
	var linesBox = loader.querySelector(".ax-preloader-1-logo-lines");
	var lines = loader.querySelectorAll(".ax-preloader-1-logo-lines path");

	var exited = false;

	// the lines draw by stroke (pathLength 1), then the gold fades in; its progress follows the page loading
	var intro = gsap.timeline({ paused: true });

	intro
		.to(lines, { strokeDashoffset: 0, duration: 1.8, stagger: .15, ease: "power2.inOut" }, .1)
		.to(fill, { fillOpacity: 1, duration: .9, ease: "power2.out" }, 1.6)
		.to(linesBox, { opacity: 0, duration: .9, ease: "power2.out" }, 1.8);

	// exit: the logo and then the sheet fade out
	function exit() {
		intro.kill();

		var tl = gsap.timeline({
			onComplete: function () {
				loader.remove();
			}
		});

		tl.to(content, { opacity: 0, duration: .5, ease: "power2.in" })
			.addLabel("fade", "-=.15")
			.to(loader, { opacity: 0, duration: .9, ease: "power2.inOut" }, "fade")
			.add(afterPreloader, "fade+=.25");
	}

	// loading: each image is a step, the window load the last (the drawing waits at 96% for it)
	var images = Array.prototype.slice.call(document.images);
	var steps = images.length + 1;
	var done = 0;

	function advance() {
		if (exited) return;

		// starts at 8%, so something moves at once
		gsap.to(intro, { progress: Math.min(Math.max(done / steps, .08), .96), duration: .5, ease: "power1.out", overwrite: true });
	}

	function step() {
		done++;
		advance();
	}

	images.forEach(function (image) {
		if (image.complete) {
			done++;
		} else {
			image.addEventListener("load", step, { once: true });
			image.addEventListener("error", step, { once: true });
		}
	});

	advance();

	// page loaded: finish the drawing, then exit
	function tryExit() {
		if (exited) return;
		exited = true;

		gsap.to(intro, { progress: 1, duration: (1 - intro.progress()) * .6, ease: "power1.out", overwrite: true, onComplete: exit });
	}

	// safety: a page that never loads does not keep the sheet
	gsap.delayedCall(15, tryExit);

	return {
		done: tryExit
	};
}

var agPreloader = agPreloaderInit();


// the hero intro, played by afterPreloader
var agHero1First = null;


/*
	hero-1 — after the preloader: building and card slide up, the title opens, text, button, social bar and stats come in
*/
function agHero1Intro() {

	var area = document.querySelector(".ax-hero-1-area");
	if (!area || prefersReducedMotion()) return;

	var building = area.querySelector(".ax-hero-1-building");
	var card = area.querySelector(".ax-hero-1-card");
	var text = area.querySelector(".ax-hero-1-text");
	var btn = area.querySelector(".btn-elm");
	var social = area.querySelector(".ax-hero-1-social");
	var stats = area.querySelectorAll(".ax-hero-1-rating, .ax-hero-1-stat");

	// from-tweens park the parts behind the preloader, afterPreloader plays the timeline
	var tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

	// they only slide (the hero edge cuts them)
	tl.from(building, { yPercent: 100, duration: 1.5, clearProps: "transform" }, 0)
		.from(card, { yPercent: 160, duration: 1.4, clearProps: "transform" }, .5)
		// the title (wa_blinds_text) opens between the card and the text
		.from(text, { y: 28, opacity: 0, duration: .9, clearProps: "transform,opacity" }, 1.5)
		.from(btn, { y: 28, opacity: 0, duration: .9, clearProps: "transform,opacity" }, 1.75)
		.from(social, { xPercent: -100, duration: 1, clearProps: "transform" }, 2)
		.from(stats, { yPercent: 100, duration: 1, stagger: .12, clearProps: "transform" }, 2.3);

	agHero1First = {
		play: function () {
			tl.play();
		}
	};
}


/*
	about-1 — the photo slider, autoplay every 4s (waits on hover)
*/
function agAbout1Slider() {

	if (!document.querySelector(".ax-about-1-slider")) return;

	new Swiper(".ax-about-1-slider", {
		slidesPerView: 1,
		speed: 900,
		rewind: true,
		autoplay: prefersReducedMotion() ? false : { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
		navigation: {
			prevEl: ".ax-about-1-prev",
			nextEl: ".ax-about-1-next"
		}
	});
}


/*
	about-1 — the three number cards slide down and open (clip-path) with the scroll, from 1200px up only
*/
function agAbout1Stats() {

	var cards = gsap.utils.toArray(".ax-about-1-stat");
	if (!cards.length || prefersReducedMotion()) return;

	gsap.matchMedia().add("(min-width: 1200px)", function () {

		cards.forEach(function (card) {

			gsap.fromTo(card, { y: -70, clipPath: "inset(0% 0% 100% 0%)" }, {
				y: 0,
				clipPath: "inset(0% 0% 0% 0%)",
				ease: "none",
				scrollTrigger: {
					trigger: card,
					start: "top 92%",
					end: "top 60%",
					scrub: 1
				}
			});
		});
	});
}


/*
	about-1 — the five half circles grow from the top middle when the section comes into view
*/
function agAbout1Lines() {

	var area = document.querySelector(".ax-about-1-area");
	var lines = gsap.utils.toArray(".ax-about-1-line");
	if (!area || !lines.length || prefersReducedMotion()) return;

	gsap.from(lines, {
		scale: 0,
		opacity: 0,
		transformOrigin: "50% 50%",
		duration: 2,
		ease: "power3.out",
		stagger: .18,
		clearProps: "transform,opacity",
		scrollTrigger: { trigger: area, start: "top 75%", once: true }
	});
}


/*
	service-1 — the card slider: 3 / 2 / 1 cards a view, loops with the arrows
*/
function agService1Slider() {

	if (!document.querySelector(".ax-service-1-slider")) return;

	new Swiper(".ax-service-1-slider", {
		slidesPerView: 1,
		spaceBetween: 16,
		speed: 800,
		rewind: true,
		navigation: {
			prevEl: ".ax-service-1-prev",
			nextEl: ".ax-service-1-next"
		},
		breakpoints: {
			768: { slidesPerView: 2, spaceBetween: 24 },
			1200: { slidesPerView: 3, spaceBetween: 28 }
		}
	});
}


/*
	service-1 — the picture of the wide card moves inside it (±7.5%) while the card is scrolled
*/
function agService1Parallax() {

	var box = document.querySelector(".ax-service-1-big");
	var img = document.querySelector(".ax-service-1-big-img");
	if (!box || !img || prefersReducedMotion()) return;

	gsap.fromTo(img, { yPercent: -7.5 }, {
		yPercent: 7.5,
		ease: "none",
		scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true }
	});
}


/*
	client-1 — the four cross-hair lines are drawn one after another when the logo row comes into view
*/
function agClient1Lines() {

	var row = document.querySelector(".ax-client-1-row");
	var lines = gsap.utils.toArray(".ax-client-1-line");
	if (!row || !lines.length || prefersReducedMotion()) return;

	var tl = gsap.timeline({
		defaults: { duration: 1.6, ease: "power2.inOut" },
		scrollTrigger: { trigger: row, start: "top 85%", once: true },
		onComplete: function () {
			gsap.set(lines, { clearProps: "transform" });
		}
	});

	lines.forEach(function (line, i) {
		tl.from(line, line.classList.contains("is-v") ? { scaleY: 0 } : { scaleX: 0 }, i * .2);
	});
}


/*
	project-1 — the project slider; the tabs filter its cards by data-category
*/
function agProject1Slider() {

	var el = document.querySelector(".ax-project-1-slider");
	if (!el) return;

	var slides = Array.prototype.slice.call(el.querySelectorAll(".swiper-slide"));
	var tabs = Array.prototype.slice.call(document.querySelectorAll(".ax-project-1-tab"));
	var empty = document.querySelector(".ax-project-1-empty");

	var swiper = new Swiper(el, {
		slidesPerView: "auto",
		spaceBetween: 16,
		slidesOffsetBefore: 12,
		speed: 800,
		grabCursor: true,
		navigation: {
			prevEl: ".ax-project-1-prev",
			nextEl: ".ax-project-1-next"
		},
		breakpoints: {
			768: { spaceBetween: 24, slidesOffsetBefore: 24 },
			1200: { spaceBetween: 32, slidesOffsetBefore: -180 },
			1400: { slidesOffsetBefore: -200 },
			1600: { slidesOffsetBefore: -212 }
		}
	});

	tabs.forEach(function (tab) {
		tab.addEventListener("click", function () {

			var filter = tab.getAttribute("data-filter");
			var list = slides.filter(function (slide) {
				return filter === "all" || slide.getAttribute("data-category").split(" ").indexOf(filter) > -1;
			});

			tabs.forEach(function (other) {
				other.classList.toggle("is-active", other === tab);
			});

			swiper.removeAllSlides();
			swiper.appendSlide(list);
			swiper.update();
			swiper.slideTo(0, 0);

			if (empty) empty.classList.toggle("is-show", !list.length);

			if (!prefersReducedMotion() && list.length) {
				gsap.fromTo(list, { y: 40, opacity: 0 }, {
					y: 0,
					opacity: 1,
					duration: .7,
					ease: "power3.out",
					stagger: .1,
					clearProps: "transform,opacity"
				});
			}
		});
	});
}


/*
	project-1 — head text and button, building and tabs come up when they scroll into view
*/
function agProject1In() {

	var area = document.querySelector(".ax-project-1-area");
	if (!area || prefersReducedMotion()) return;

	var head = area.querySelector(".ax-project-1-head");
	var headItems = gsap.utils.toArray(".ax-project-1-text, .ax-project-1-head .btn-elm", area);
	var bg = area.querySelector(".ax-project-1-bg");
	var tabsBox = area.querySelector(".ax-project-1-tabs");
	var tabs = gsap.utils.toArray(".ax-project-1-tab", area);

	if (head && headItems.length) {
		gsap.from(headItems, {
			y: 40,
			opacity: 0,
			duration: 1,
			delay: .3,
			ease: "power3.out",
			stagger: .2,
			clearProps: "transform,opacity",
			scrollTrigger: { trigger: head, start: "top 85%", once: true }
		});
	}

	if (bg) {
		gsap.from(bg, {
			scale: .5,
			opacity: 0,
			transformOrigin: "50% 100%",
			duration: 1.8,
			ease: "power3.out",
			clearProps: "transform,opacity",
			scrollTrigger: { trigger: bg, start: "top 90%", once: true }
		});
	}

	if (tabsBox && tabs.length) {
		// no css transition while gsap moves them
		gsap.set(tabs, { transition: "none" });

		gsap.from(tabs, {
			y: 24,
			opacity: 0,
			duration: .8,
			delay: .2,
			ease: "power3.out",
			stagger: .08,
			clearProps: "transform,opacity,transition",
			scrollTrigger: { trigger: tabsBox, start: "top 92%", once: true }
		});
	}
}


/*
	contact-1 — the four lines are drawn, the big words and the info card wipe in from the left
*/
function agContact1In() {

	var area = document.querySelector(".ax-contact-1-area");
	if (!area || prefersReducedMotion()) return;

	var lines = gsap.utils.toArray(".ax-contact-1-line", area);
	var big = area.querySelector(".ax-contact-1-big");
	var words = gsap.utils.toArray(".ax-contact-1-big-word", area);
	var card = area.querySelector(".ax-contact-1-big-row .ax-contact-1-info");

	if (lines.length) {
		var linesTl = gsap.timeline({
			defaults: { duration: 1.6, ease: "power2.inOut" },
			scrollTrigger: { trigger: area, start: "top 75%", once: true },
			onComplete: function () {
				gsap.set(lines, { clearProps: "transform" });
			}
		});

		lines.forEach(function (line, i) {
			linesTl.from(line, line.classList.contains("is-left") || line.classList.contains("is-right") ? { scaleY: 0 } : { scaleX: 0 }, i * .2);
		});
	}

	if (big && words.length) {
		var wipe = { clipPath: "inset(0 100% 0 0)", x: -60, ease: "power3.out" };
		var bigTl = gsap.timeline({
			scrollTrigger: { trigger: big, start: "top 92%", once: true },
			onComplete: function () {
				gsap.set(words.concat(card || []), { clearProps: "clipPath,transform" });
			}
		});

		bigTl.from(words[0], Object.assign({ duration: 1.2 }, wipe));
		if (card) bigTl.from(card, Object.assign({ duration: 1.1 }, wipe), "-=.8");
		if (words[1]) bigTl.from(words[1], Object.assign({ duration: 1.2 }, wipe), "-=.9");
	}
}


/*
	team-1 — the cards slide up and wipe in one after another; subtitle, text and button come up
*/
function agTeam1In() {

	var area = document.querySelector(".ax-team-1-area");
	if (!area || prefersReducedMotion()) return;

	var subtitle = area.querySelector(".ax-team-1-head .ax-subtitle-1");
	var cards = gsap.utils.toArray(".ax-team-1-card", area);
	var side = area.querySelector(".ax-team-1-side");

	if (subtitle) {
		gsap.from(subtitle, {
			y: 30,
			opacity: 0,
			duration: .8,
			ease: "power3.out",
			clearProps: "transform,opacity",
			scrollTrigger: { trigger: subtitle, start: "top 90%", once: true }
		});
	}

	cards.forEach(function (card, i) {
		gsap.fromTo(card, { y: 90, clipPath: "inset(100% 0% 0% 0%)" }, {
			y: 0,
			clipPath: "inset(0% 0% 0% 0%)",
			duration: 1.1,
			// later by its place in the row
			delay: (i % 3) * .15,
			ease: "power3.out",
			clearProps: "transform,clipPath",
			scrollTrigger: { trigger: card, start: "top 90%", once: true }
		});
	});

	if (side) {
		gsap.from(gsap.utils.toArray(".ax-team-1-text, .btn-elm", side), {
			y: 40,
			opacity: 0,
			duration: 1,
			ease: "power3.out",
			stagger: .2,
			clearProps: "transform,opacity",
			scrollTrigger: { trigger: side, start: "top 90%", once: true }
		});
	}
}


/*
	process-1 — from 1400px the section is pinned and the steps slide in with the scroll (the arc follows), under 1400px each step slides in on view
*/
function agProcess1Steps() {

	var area = document.querySelector(".ax-process-1-area");
	if (!area || prefersReducedMotion()) return;

	var steps = gsap.utils.toArray(".ax-process-1-step", area);
	var ring = area.querySelector(".ax-process-1-ring.is-active");
	if (!steps.length) return;

	// arc angles of the steps (degrees from 12 o'clock)
	var angles = [33.5, 70.8, 100.7, 135.5];

	// the words come up when the section scrolls into view
	gsap.from(gsap.utils.toArray(".ax-process-1-head .ax-subtitle-1, .ax-process-1-text, .ax-process-1-foot .btn-elm", area), {
		y: 40,
		opacity: 0,
		duration: 1,
		delay: .3,
		ease: "power3.out",
		stagger: .2,
		clearProps: "transform,opacity",
		scrollTrigger: { trigger: area, start: "top 70%", once: true }
	});

	var mm = gsap.matchMedia();

	mm.add("(min-width: 1400px)", function () {

		var tl = gsap.timeline({
			scrollTrigger: {
				trigger: area,
				start: function () {
					return area.offsetHeight >= window.innerHeight ? "top top" : "center center";
				},
				end: "+=220%",
				pin: true,
				scrub: 0.6,
				anticipatePin: 1,
				invalidateOnRefresh: true,
				// measured first, so the titles below count the space of the pin
				refreshPriority: 1
			}
		});

		if (ring) gsap.set(ring, { "--ax-process-1-arc": "0deg" });

		steps.forEach(function (step, i) {
			// fromTo, not from: with invalidateOnRefresh a from() would take the off-screen place
			tl.fromTo(step, {
				x: function () {
					return window.innerWidth;
				}
			}, {
				x: 0,
				duration: 1,
				ease: "power2.out"
			}, i);

			if (ring) {
				tl.fromTo(ring, {
					"--ax-process-1-arc": (i ? angles[Math.min(i - 1, angles.length - 1)] : 0) + "deg"
				}, {
					"--ax-process-1-arc": angles[Math.min(i, angles.length - 1)] + "deg",
					duration: 1,
					ease: "none"
				}, i);
			}
		});

		// the steps rest for the end of the pin
		tl.to({}, { duration: .5 });
	});

	mm.add("(max-width: 1399px)", function () {

		steps.forEach(function (step) {
			gsap.from(step, {
				x: function () {
					return window.innerWidth;
				},
				duration: 1,
				ease: "power3.out",
				clearProps: "transform",
				scrollTrigger: { trigger: step, start: "top 88%", once: true }
			});
		});
	});
}


/*
	choose-1 — the pictures wipe or slide in once when they scroll into view
*/
function agChoose1In() {

	var grid = document.querySelector(".ax-choose-1-grid");
	if (!grid || prefersReducedMotion()) return;

	var photo = grid.querySelector(".ax-choose-1-photo");
	var building = grid.querySelector(".ax-choose-1-card-pic.is-building");
	var cuts = gsap.utils.toArray(".ax-choose-1-card-pic.is-cut", grid);

	// wipe a picture in, its image zooms out
	function wipe(box, hidden, trigger) {
		var img = box.querySelector("img");

		gsap.timeline({
			scrollTrigger: { trigger: trigger || box, start: "top 85%", once: true },
			onComplete: function () {
				gsap.set([box, img], { clearProps: "clipPath,transform" });
			}
		})
		.fromTo(box, { clipPath: hidden }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power3.inOut" }, 0)
		.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: "power3.out" }, 0);
	}

	if (photo) wipe(photo, "inset(0% 100% 0% 0%)");

	cuts.forEach(function (cut) {
		wipe(cut, "inset(0% 0% 100% 0%)");
	});

	if (building) {
		gsap.from(building, {
			xPercent: 100,
			duration: 1.3,
			ease: "power3.out",
			clearProps: "transform",
			scrollTrigger: { trigger: building.parentNode, start: "top 85%", once: true }
		});
	}
}


/*
	testimonial-1 — seven avatars in a row (data-pos -3 to 3), the middle one is shown; a click, a dot or the autoplay (5s) turns the row
*/
function agTestimonial1Slider() {

	var slider = document.querySelector(".ax-testimonial-1-slider");
	if (!slider) return;

	var avatars = Array.prototype.slice.call(slider.querySelectorAll(".ax-testimonial-1-avatar"));
	var quotes = Array.prototype.slice.call(slider.querySelectorAll(".ax-testimonial-1-quote"));
	var names = Array.prototype.slice.call(slider.querySelectorAll(".ax-testimonial-1-name"));
	var dots = Array.prototype.slice.call(slider.querySelectorAll(".ax-testimonial-1-dot"));

	var total = avatars.length;
	var half = Math.floor(total / 2);
	var active = half;
	var timer = null;

	// the round pictures follow the slider: 3 copies of the list in a track, reset to the middle one after a move
	var picsBox = document.querySelector(".ax-testimonial-1-pics");
	var picsList = picsBox ? picsBox.querySelector(".ax-testimonial-1-pics-list") : null;
	var picsTrack = null;
	var picsCount = picsList ? picsList.children.length : 0;
	var picsMoved = 0;

	if (picsList && picsCount) {
		picsTrack = document.createElement("div");
		picsTrack.className = "ax-testimonial-1-pics-track";

		var picsBefore = picsList.cloneNode(true);
		var picsAfter = picsList.cloneNode(true);

		picsBox.insertBefore(picsTrack, picsList);
		picsTrack.appendChild(picsBefore);
		picsTrack.appendChild(picsList);
		picsTrack.appendChild(picsAfter);
	}

	// y of the track when picture `moved` is in the middle
	function picsY(moved) {
		var box = picsBox.parentNode;
		var size = picsList.children[0].offsetHeight;
		return (box.offsetHeight - size) / 2 - picsList.offsetHeight - moved * size;
	}

	function picsPlace() {
		if (!picsTrack || !picsList.children[0].offsetHeight) return;
		picsMoved = ((picsMoved % picsCount) + picsCount) % picsCount;
		gsap.set(picsTrack, { y: picsY(picsMoved) });
	}

	function picsMove(step) {
		if (!picsTrack || !step || !picsList.children[0].offsetHeight) return;

		picsMoved += step;

		if (prefersReducedMotion()) {
			picsPlace();
			return;
		}

		gsap.to(picsTrack, {
			y: picsY(picsMoved),
			duration: 1.2,
			ease: "power3.inOut",
			overwrite: true,
			onComplete: picsPlace
		});
	}

	function show(index) {

		var before = active;

		active = (index + total) % total;

		// shortest way to the new one (-3 to 3), the pictures go with it
		picsMove(((active - before + total + half) % total) - half);

		avatars.forEach(function (avatar, i) {
			var pos = ((i - active + total + half) % total) - half;
			var before = parseInt(avatar.getAttribute("data-pos"), 10);

			avatar.classList.toggle("is-jump", Math.abs(pos - before) > half);
			avatar.setAttribute("data-pos", pos);
		});

		quotes.forEach(function (el, i) {
			el.classList.toggle("is-active", i === active);
		});

		names.forEach(function (el, i) {
			el.classList.toggle("is-active", i === active);
		});

		dots.forEach(function (el, i) {
			el.classList.toggle("is-active", i === active);
		});
	}

	function play() {
		if (prefersReducedMotion()) return;
		stop();
		timer = setInterval(function () {
			show(active + 1);
		}, 5000);
	}

	function stop() {
		if (timer) clearInterval(timer);
		timer = null;
	}

	avatars.forEach(function (avatar, i) {
		avatar.addEventListener("click", function () {
			show(i);
		});
		avatar.addEventListener("keydown", function (e) {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				show(i);
			}
		});
	});

	dots.forEach(function (dot, i) {
		dot.addEventListener("click", function () {
			show(i);
		});
	});

	slider.addEventListener("mouseenter", stop);
	slider.addEventListener("mouseleave", play);

	picsPlace();
	window.addEventListener("resize", picsPlace);

	play();
}


/*
	footer-1 — the "Get in Touch" house rises from below with the scroll (scrub)
*/
function axFooter1Touch() {

	var area = document.querySelector(".ax-footer-1-area");
	var card = area ? area.querySelector(".ax-footer-1-touch") : null;

	if (!card || prefersReducedMotion()) return;

	var mm = gsap.matchMedia();

	// how low the card waits (px)
	[
		["(min-width: 1200px)", 260],
		["(max-width: 1199px)", 50]
	].forEach(function (item) {
		mm.add(item[0], function () {
			gsap.fromTo(card, { y: item[1] }, {
				y: 0,
				ease: "none",
				scrollTrigger: { trigger: area, start: "top bottom", end: "top 20%", scrub: true }
			});
		});
	});
}


/*
	page lifecycle
*/
function afterPreloader() {
	if (agHero1First) agHero1First.play();

	// titles that waited behind the preloader (main-common.js) come in
	(window.waTextEffectWaiting || []).forEach(function (tl) {
		tl.play();
	});
}

function afterPageLoad() {
	if ($(".wow").length) {
		new WOW({
			boxClass: "wow",
			animateClass: "animated",
			offset: 100,
			mobile: true,
			live: true
		}).init();
	}
}

window.addEventListener("load", function () {

	ScrollTrigger.refresh();

	if (agPreloader) {
		agPreloader.done();
	} else {
		afterPreloader();
	}

	afterPageLoad();
});

// measure first, so a later trigger does not kill the passed ones (pin error)
ScrollTrigger.refresh();

agHero1Intro();
agAbout1Slider();
agAbout1Stats();
agAbout1Lines();
agService1Slider();
agService1Parallax();
agClient1Lines();
agProject1Slider();
agProject1In();
agContact1In();
agTeam1In();
agProcess1Steps();
agChoose1In();
agTestimonial1Slider();
axFooter1Touch();

})(jQuery);

