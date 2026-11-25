/**
 * Aron Training — site configuration
 *
 * This site is static (GitHub Pages), so trial requests are not stored
 * on a server unless you hook up an email or form endpoint below.
 *
 * Option 1 — mailto (simplest)
 *   Set contactEmail to Aron's real address. After a valid submit, the
 *   visitor's email app opens with a pre-filled message. They still need
 *   to press Send.
 *
 * Option 2 — Formspree
 *   Create a form at https://formspree.io and set formEndpoint to
 *   "https://formspree.io/f/xxxxxx". Leads arrive in Aron's inbox.
 *
 * Option 3 — FormSubmit
 *   Set formEndpoint to "https://formsubmit.co/ajax/real-email@domain.com"
 *   using Aron's real address. See https://formsubmit.co.
 *
 * Leave both values empty until a real address is available.
 * Do not use a placeholder or made-up email.
 */
window.ARON_TRAINING_CONFIG = {
  contactEmail: "",
  formEndpoint: ""
};
