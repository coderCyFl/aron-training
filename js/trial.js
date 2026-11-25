(function () {
  "use strict";

  var form = document.getElementById("trial-form");
  if (!form) return;

  var thanks = document.getElementById("thanks");
  var statusEl = document.getElementById("form-status");
  var submitBtn = document.getElementById("submit-btn");
  var summaryBox = document.getElementById("summary-box");
  var thanksDelivery = document.getElementById("thanks-delivery");
  var copyBtn = document.getElementById("copy-btn");
  var copyStatus = document.getElementById("copy-status");

  var REQUIRED_TEXT = ["name", "email", "phone", "age", "weight", "experience", "experienceNote", "injuries", "health", "achieve", "frequency", "source"];
  var REQUIRED_RADIO = ["contactMethod", "parqChestDoctor", "parqChestPainActivity", "parqChestPainRest", "parqDizziness", "parqJoint", "parqMedication", "parqOther", "format"];
  var REQUIRED_CHECKS = ["goals", "days", "times"];
  var PARQ_FIELDS = ["parqChestDoctor", "parqChestPainActivity", "parqChestPainRest", "parqDizziness", "parqJoint", "parqMedication", "parqOther"];

  function config() {
    return window.ARON_TRAINING_CONFIG || {};
  }

  function checkedValues(name) {
    return Array.prototype.map.call(
      form.querySelectorAll('input[name="' + name + '"]:checked'),
      function (el) { return el.value; }
    );
  }

  function radioValue(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : "";
  }

  function fieldValue(name) {
    var el = form.elements[name];
    if (!el) return "";
    if (el.length && el[0] && (el[0].type === "checkbox" || el[0].type === "radio")) {
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

  function clearErrors() {
    Array.prototype.forEach.call(form.querySelectorAll(".has-error, .invalid"), function (el) {
      el.classList.remove("has-error", "invalid");
    });
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validate() {
    clearErrors();
    var first = null;

    REQUIRED_TEXT.forEach(function (name) {
      var value = fieldValue(name);
      var bad = !value;
      if (name === "email" && value && !isValidEmail(value)) bad = true;
      if (name === "age" && value) {
        var n = Number(value);
        if (!Number.isFinite(n) || n < 13 || n > 100) bad = true;
      }
      if (bad) {
        setError(name, true);
        if (!first) first = form.querySelector('[data-field="' + name + '"]');
      }
    });

    REQUIRED_RADIO.forEach(function (name) {
      if (!radioValue(name)) {
        setError(name, true);
        if (!first) first = form.querySelector('[data-field="' + name + '"]');
      }
    });

    REQUIRED_CHECKS.forEach(function (name) {
      if (!checkedValues(name).length) {
        setError(name, true);
        if (!first) first = form.querySelector('[data-field="' + name + '"]');
      }
    });

    return first;
  }

  function buildSummary() {
    var parqYes = PARQ_FIELDS.filter(function (name) {
      return radioValue(name) === "Yes";
    });

    var lines = [
      "Aron Training — 1-hour trial request",
      "Submitted: " + new Date().toISOString(),
      "",
      "CONTACT",
      "Name: " + fieldValue("name"),
      "Email: " + fieldValue("email"),
      "Phone / WhatsApp: " + fieldValue("phone"),
      "Preferred contact: " + fieldValue("contactMethod"),
      "Best time to contact: " + (fieldValue("contactTime") || "—"),
      "",
      "ABOUT YOU",
      "Age: " + fieldValue("age"),
      "Weight: " + fieldValue("weight"),
      "Height: " + (fieldValue("height") || "—"),
      "",
      "TRAINING BACKGROUND",
      "Experience: " + fieldValue("experience"),
      "Notes: " + fieldValue("experienceNote"),
      "",
      "HEALTH",
      "Injury history: " + fieldValue("injuries"),
      "Health conditions / medication / clearance: " + fieldValue("health"),
      "PAR-Q heart condition (doctor advice): " + radioValue("parqChestDoctor"),
      "PAR-Q chest pain during activity: " + radioValue("parqChestPainActivity"),
      "PAR-Q chest pain at rest (past month): " + radioValue("parqChestPainRest"),
      "PAR-Q dizziness / loss of consciousness: " + radioValue("parqDizziness"),
      "PAR-Q bone or joint problem: " + radioValue("parqJoint"),
      "PAR-Q blood pressure or heart medication: " + radioValue("parqMedication"),
      "PAR-Q other reason not to exercise: " + radioValue("parqOther"),
      "PAR-Q yes answers: " + (parqYes.length ? parqYes.join(", ") : "None"),
      "",
      "GOALS",
      "Selected goals: " + fieldValue("goals"),
      "What they want to achieve: " + fieldValue("achieve"),
      "Event or date: " + (fieldValue("event") || "—"),
      "Current obstacles: " + (fieldValue("blockers") || "—"),
      "",
      "SCHEDULE",
      "Frequency: " + fieldValue("frequency"),
      "Preferred days: " + fieldValue("days"),
      "Preferred times: " + fieldValue("times"),
      "Session format: " + fieldValue("format"),
      "How they found Aron: " + fieldValue("source") + (fieldValue("sourceNote") ? " — " + fieldValue("sourceNote") : "")
    ];
    return lines.join("\n");
  }

  function showThanks(summary, deliveryNote) {
    form.classList.add("is-hidden");
    form.setAttribute("hidden", "");
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
    var body = summary;
    if (body.length > maxBody) {
      body = summary.slice(0, maxBody) + "\n\n[Message shortened for email. The full answers were shown on the thank-you screen.]";
    }
    var url = "mailto:" + encodeURIComponent(email)
      + "?subject=" + encodeURIComponent(subject)
      + "&body=" + encodeURIComponent(body);
    window.location.href = url;
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

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    statusEl.textContent = "";
    statusEl.classList.remove("error-text");

    var firstError = validate();
    if (firstError) {
      statusEl.textContent = "Please complete the highlighted fields.";
      statusEl.classList.add("error-text");
      var focusEl = firstError.querySelector("input, select, textarea");
      if (focusEl) focusEl.focus();
      else firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    var summary = buildSummary();
    var cfg = config();
    var email = (cfg.contactEmail || "").trim();
    var endpoint = (cfg.formEndpoint || "").trim();

    submitBtn.disabled = true;
    statusEl.textContent = "Sending your request…";

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
            statusEl.classList.add("error-text");
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
      var ok = function () {
        copyStatus.textContent = "Copied to your clipboard.";
      };
      var fail = function () {
        copyStatus.textContent = "Select the answers above and copy them manually.";
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(ok).catch(fail);
      } else {
        fail();
      }
    });
  }
})();
