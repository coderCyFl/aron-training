(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector(".site-header");
  var bar = document.querySelector(".scroll-progress");

  function onScroll() {
    var root = document.documentElement;
    var max = root.scrollHeight - root.clientHeight;
    var p = max > 0 ? root.scrollTop / max : 0;
    if (bar) bar.style.transform = "scaleX(" + p + ")";
    if (header) header.classList.toggle("is-scrolled", root.scrollTop > 8);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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
  }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

  Array.prototype.forEach.call(reveals, function (el) {
    io.observe(el);
  });
})();
