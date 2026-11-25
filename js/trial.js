(function () {
  "use strict";

  var form = document.getElementById("trial-form");
  if (!form) return;

  var thanks = document.getElementById("thanks");
  var statusEl = document.getElementById("form-status");
  var stepStatus = document.getElementById("step-status");
  var submitBtn = document.getElementById("submit-btn");
  var nextBtn = document.getElementById("next-btn");
  var backBtn = document.getElementById("back-btn");
  var summaryBox = document.getElementById("summary-box");
  var thanksDelivery = document.getElementById("thanks-delivery");
  var copyBtn = document.getElementById("copy-btn");
  var copyStatus = document.getElementById("copy-status");
  var stepper = document.getElementById("stepper");
  var stepLabel = document.getElementById("step-label");
  var step1 = document.getElementById("step-1");
  var step2 = document.getElementById("step-2");
  var dot1 = document.getElementById("dot-1");
  var dot2 = document.getElementById("dot-2");
  var stepLine = document.getElementById("step-line");

  var STEP1_TEXT = ["name", "email", "phone", "age", "weight", "experience", "health"];
  var STEP2_TEXT = ["achieve", "schedule"];
  var currentStep = 1;

  function config() {
    return window.ARON_TRAINING_CONFIG || {};
  }

  function checkedValues(name) {
    return Array.prototype.map.call(
      form.querySelectorAll('input[name="' + name + '"]:checked'),
      function (el) { return el.value; }
    );
  }

  function fieldValue(name) {
    var el = form.elements[name];
    if (!el) return "";
    if (el.length && el[0] && el[0].type === "checkbox") {
      return checkedValues(name).join(", ");
    }
    return String(el.value || "").trim();
  }

  function setError(name, on) {
    var wrap = form.querySelector('[data-field="' + name + '"]');
    if (!wrap) return;
    wrap.classList.toggle("has-error", !!on);
    var input = wrap.querySelector("input, select, textarea");
    if (input) {
      input.classList.toggle("invalid", !!on);
      input.setAttribute("aria-invalid", on ? "true" : "false");
    }
  }

  function clearErrors(names) {
    (names || []).forEach(function (name) { setError(name, false); });
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function firstErrorEl(name) {
    return form.querySelector('[data-field="' + name + '"]');
  }

  function validateFields(names, includeGoals) {
    var first = null;
    names.forEach(function (name) {
      var value = fieldValue(name);
      var bad = !value;
      if (name === "email" && value && !isValidEmail(value)) bad = true;
      if (name === "age" && value) {
        var n = Number(value);
        if (!Number.isFinite(n) || n < 13 || n > 100) bad = true;
      }
      setError(name, bad);
      if (bad && !first) first = firstErrorEl(name);
    });
    if (includeGoals) {
      var missingGoals = !checkedValues("goals").length;
      setError("goals", missingGoals);
      if (missingGoals && !first) first = firstErrorEl("goals");
    }
    return first;
  }

  function showStep(step) {
    currentStep = step;
    var onFirst = step === 1;
    step1.classList.toggle("is-active", onFirst);
    step2.classList.toggle("is-active", !onFirst);
    if (onFirst) {
      step1.removeAttribute("hidden");
      step2.setAttribute("hidden", "");
    } else {
      step2.removeAttribute("hidden");
      step1.setAttribute("hidden", "");
    }
    if (dot1) {
      dot1.classList.toggle("is-active", onFirst);
      dot1.classList.toggle("is-done", !onFirst);
    }
    if (dot2) dot2.classList.toggle("is-active", !onFirst);
    if (stepLine) stepLine.classList.toggle("is-done", !onFirst);
    if (stepLabel) {
      stepLabel.textContent = onFirst
        ? "Step 1 of 2 — About you"
        : "Step 2 of 2 — Goals and time";
    }
    if (stepStatus) {
      stepStatus.textContent = "";
      stepStatus.classList.remove("error-text");
    }
    var heading = (onFirst ? step1 : step2).querySelector("legend");
    (onFirst ? step1 : step2).scrollIntoView({ behavior: "smooth", block: "start" });
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
  }

  function buildSummary() {
    return [
      "Aron Training — 1-hour trial request",
      "Submitted: " + new Date().toISOString(),
      "",
      "CONTACT",
      "Name: " + fieldValue("name"),
      "Email: " + fieldValue("email"),
      "Phone / WhatsApp: " + fieldValue("phone"),
      "",
      "ABOUT YOU",
      "Age: " + fieldValue("age"),
      "Weight: " + fieldValue("weight"),
      "Exercise experience: " + fieldValue("experience"),
      "Injuries or health conditions: " + fieldValue("health"),
      "",
      "GOALS AND TIME",
      "Selected goals: " + fieldValue("goals"),
      "What they want to achieve: " + fieldValue("achieve"),
      "Schedule / format: " + fieldValue("schedule"),
      "Other note: " + (fieldValue("note") || "—")
    ].join("\n");
  }

  function showThanks(summary, deliveryNote) {
    form.classList.add("is-hidden");
    form.setAttribute("hidden", "");
    if (stepper) stepper.setAttribute("hidden", "");
    thanks.classList.add("is-visible");
    thanks.removeAttribute("hidden");
    summaryBox.textContent = summary;
    thanksDelivery.textContent = deliveryNote || "";
    thanks.scrollIntoView({ behavior: "smooth", block: "start" });
    var heading = thanks.querySelector("h1");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
  }

  function openMailto(email, summary) {
    var name = fieldValue("name");
    var subject = "1-hour trial request from " + name;
    var maxBody = 1800;
    var body = summary.length > maxBody
      ? summary.slice(0, maxBody) + "\n\n[Message shortened for email. The full answers were shown on the thank-you screen.]"
      : summary;
    window.location.href = "mailto:" + encodeURIComponent(email)
      + "?subject=" + encodeURIComponent(subject)
      + "&body=" + encodeURIComponent(body);
  }

  function postEndpoint(endpoint, summary) {
    var payload = {
      name: fieldValue("name"),
      email: fieldValue("email"),
      phone: fieldValue("phone"),
      message: summary,
      _subject: "1-hour trial request from " + fieldValue("name")
    };
    return fetch(endpoint, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error("Form endpoint returned " + res.status);
      return res;
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      clearErrors(STEP1_TEXT);
      var first = validateFields(STEP1_TEXT, false);
      if (first) {
        if (stepStatus) {
          stepStatus.textContent = "Please complete the highlighted fields.";
          stepStatus.classList.add("error-text");
        }
        var focusEl = first.querySelector("input, select, textarea");
        if (focusEl) focusEl.focus();
        else first.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      showStep(2);
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", function () {
      showStep(1);
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (statusEl) {
      statusEl.textContent = "";
      statusEl.classList.remove("error-text");
    }

    if (currentStep !== 2) {
      showStep(2);
      return;
    }

    clearErrors(STEP2_TEXT.concat(["goals"]));
    var firstError = validateFields(STEP2_TEXT, true);
    if (firstError) {
      if (statusEl) {
        statusEl.textContent = "Please complete the highlighted fields.";
        statusEl.classList.add("error-text");
      }
      var focusEl = firstError.querySelector("input, select, textarea");
      if (focusEl) focusEl.focus();
      else firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    var summary = buildSummary();
    var cfg = config();
    var email = (cfg.contactEmail || "").trim();
    var endpoint = (cfg.formEndpoint || "").trim();

    if (submitBtn) submitBtn.disabled = true;
    if (statusEl) statusEl.textContent = "Sending your request…";

    function finish(note) {
      try {
        window.sessionStorage.setItem("aronTrainingLastRequest", summary);
      } catch (err) {}
      showThanks(summary, note);
    }

    if (endpoint) {
      postEndpoint(endpoint, summary)
        .then(function () {
          finish("Your request has been sent. Aron will be in touch to confirm a time. You can also copy your answers below.");
        })
        .catch(function () {
          if (email) {
            openMailto(email, summary);
            finish("The direct form send could not be completed, so your email app should have opened with a pre-filled message. Please press Send. You can also copy your answers below.");
          } else {
            finish("Your request is ready, but it could not be sent automatically. Please copy your answers below and send them to Aron.");
          }
        });
      return;
    }

    if (email) {
      openMailto(email, summary);
      finish("If your email app opened, please press Send so Aron receives your request. You can also copy your answers below.");
      return;
    }

    finish("Your request is ready. Please copy your answers below and send them to Aron so the trial can be confirmed.");
  });

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = summaryBox.textContent || "";
      var ok = function () { copyStatus.textContent = "Copied to your clipboard."; };
      var fail = function () { copyStatus.textContent = "Select the answers above and copy them manually."; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(ok).catch(fail);
      } else {
        fail();
      }
    });
  }
})();
