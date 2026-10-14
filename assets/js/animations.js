/* Scroll, pointer depth, and GSAP timelines.
   Pointer effects stay on fine desktop pointers. */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (reduce || !window.gsap) document.documentElement.classList.add("show-all");

  const progress = document.querySelector(".scroll-progress");
  function onScroll() {
    const nav = document.getElementById("siteNav");
    if (nav) nav.classList.toggle("is-solid", window.scrollY > 20);
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = "scaleX(" + value + ")";
    progress.setAttribute("aria-valuenow", String(Math.round(value * 100)));
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (fine && !reduce) {
    const cursor = document.querySelector(".cursor");
    if (cursor) {
      let x = 0;
      let y = 0;
      let cx = 0;
      let cy = 0;
      window.addEventListener("pointermove", function (event) {
        x = event.clientX;
        y = event.clientY;
        cursor.classList.add("is-on");
        const hot = event.target.closest("a, button, input, select");
        cursor.classList.toggle("is-hot", Boolean(hot));
      });
      window.addEventListener("pointerleave", function () { cursor.classList.remove("is-on"); });
      function loop() {
        cx += (x - cx) * 0.18;
        cy += (y - cy) * 0.18;
        cursor.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
        requestAnimationFrame(loop);
      }
      loop();
    }

    document.querySelectorAll("[data-magnetic]").forEach(function (node) {
      node.addEventListener("pointermove", function (event) {
        const rect = node.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        node.style.transform = "translate(" + dx * 0.22 + "px," + dy * 0.28 + "px)";
      });
      node.addEventListener("pointerleave", function () { node.style.transform = ""; });
    });

    document.addEventListener("pointermove", function (event) {
      const card = event.target.closest("[data-tilt]");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      const amount = card.classList.contains("collection") ? 3.5 : card.classList.contains("float-piece") ? 4 : 6;
      card.style.transform = "rotateX(" + (-py * amount) + "deg) rotateY(" + px * amount + "deg)";
    });
    document.addEventListener("pointerout", function (event) {
      const card = event.target.closest("[data-tilt]");
      if (!card) return;
      card.style.transform = "";
    });

    const hero = document.querySelector(".cine");
    if (hero && window.innerWidth > 991) {
      const frame = hero.querySelector(".cine__athlete");
      const copy = hero.querySelector(".cine__copy");
      const bg = hero.querySelector(".cine__bg img");
      hero.addEventListener("pointermove", function (event) {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        if (frame) frame.style.translate = x * -22 + "px " + y * -14 + "px";
        if (copy) copy.style.translate = x * 14 + "px " + y * 8 + "px";
        if (bg) bg.style.translate = x * 18 + "px " + y * 12 + "px";
      });
    }
  }

  if (!reduce && window.gsap && document.querySelector(".cine")) {
    gsap.from(".cine__bg", { autoAlpha: 0, duration: 0.9, ease: "power2.out" });
  }

  if (reduce || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  if (document.querySelector(".cine")) {
    gsap.to(".cine__athlete", {
      yPercent: 14,
      ease: "none",
      scrollTrigger: { trigger: ".cine", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(".cine__copy", {
      yPercent: -12,
      ease: "none",
      scrollTrigger: { trigger: ".cine", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(".cine__bg img", {
      yPercent: 10,
      ease: "none",
      scrollTrigger: { trigger: ".cine", start: "top top", end: "bottom top", scrub: true }
    });
  }

  if (document.querySelector(".film")) {
    gsap.matchMedia().add("(min-width: 992px)", function () {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".film",
          start: "top top",
          end: "+=70%",
          pin: true,
          scrub: 0.7
        }
      });
      tl.fromTo(".film__back img", { yPercent: -8, scale: 1.12 }, { yPercent: 8, scale: 1, ease: "none" }, 0);
      tl.fromTo(".film__front", { yPercent: 14 }, { yPercent: -10, ease: "none" }, 0);
      tl.fromTo(".film__ghost", { xPercent: -6 }, { xPercent: 8, ease: "none" }, 0);
    });
  }

  gsap.utils.toArray(".collection").forEach(function (card, index) {
    gsap.from(card, {
      y: 48,
      opacity: 0,
      duration: 0.9,
      delay: index * 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 88%", once: true }
    });
  });

  gsap.utils.toArray(".statement .line, .campaign .line").forEach(function (line, index) {
    gsap.from(line, {
      yPercent: 110,
      duration: 1,
      delay: index * 0.06,
      ease: "power3.out",
      scrollTrigger: { trigger: line.closest("section"), start: "top 72%", once: true }
    });
  });

  const statementImage = document.querySelector(".statement__media img");
  if (statementImage) {
    gsap.to(statementImage, {
      yPercent: 8,
      ease: "none",
      scrollTrigger: { trigger: ".statement", start: "top bottom", end: "bottom top", scrub: true }
    });
  }

  document.querySelectorAll(".campaign__media img").forEach(function (image) {
    gsap.fromTo(image, { scale: 1.16 }, {
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: image.closest(".campaign"),
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  gsap.utils.toArray(".tech__bar span").forEach(function (bar) {
    gsap.to(bar, {
      scaleX: 1,
      duration: 1.1,
      ease: "power2.out",
      scrollTrigger: { trigger: bar, start: "top 90%", once: true }
    });
  });

  gsap.utils.toArray(".reveal").forEach(function (node) {
    gsap.from(node, {
      y: 28,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: node, start: "top 88%", once: true }
    });
  });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
