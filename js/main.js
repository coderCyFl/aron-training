(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector(".site-header");
  var bar = document.querySelector(".scroll-progress");
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  var mobCta = document.getElementById("mob-cta");
  var hero = document.querySelector(".hero");

  function onScroll() {
    var root = document.documentElement;
    var max = root.scrollHeight - root.clientHeight;
    var p = max > 0 ? root.scrollTop / max : 0;
    if (bar) bar.style.transform = "scaleX(" + p + ")";
    if (header) header.classList.toggle("is-scrolled", root.scrollTop > 8);
    if (mobCta && hero && window.matchMedia("(max-width: 980px)").matches) {
      var heroBottom = hero.getBoundingClientRect().bottom;
      var show = heroBottom < 80;
      mobCta.classList.toggle("is-visible", show);
      document.body.classList.toggle("has-mob-cta", show);
    } else if (mobCta) {
      mobCta.classList.remove("is-visible");
      document.body.classList.remove("has-mob-cta");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  function setNav(open) {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileNav.classList.toggle("is-open", open);
    if (open) mobileNav.removeAttribute("hidden");
    else mobileNav.setAttribute("hidden", "");
    document.body.classList.toggle("is-nav-open", open);
  }

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    mobileNav.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (link) setNav(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setNav(false);
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll(".faq-q"), function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      Array.prototype.forEach.call(document.querySelectorAll(".faq-q"), function (other) {
        other.setAttribute("aria-expanded", "false");
        var otherPanel = document.getElementById(other.getAttribute("aria-controls"));
        if (otherPanel) otherPanel.setAttribute("hidden", "");
      });
      if (!expanded && panel) {
        btn.setAttribute("aria-expanded", "true");
        panel.removeAttribute("hidden");
      }
    });
  });

  var reveals = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(reveals, function (el) {
      el.classList.add("is-in");
    });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

  Array.prototype.forEach.call(reveals, function (el) {
    io.observe(el);
  });
})();
