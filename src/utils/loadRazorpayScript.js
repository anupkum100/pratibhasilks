let razorpayScriptPromise = null;

export function loadRazorpayScript(timeoutMs = 10000) {
  if (window.Razorpay) return Promise.resolve(true);

  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    const script = existingScript || document.createElement("script");
    let settled = false;
    let timeout;

    const finish = (loaded) => {
      if (settled) return;

      settled = true;
      window.clearTimeout(timeout);

      if (!loaded) {
        razorpayScriptPromise = null;
        script.onload = null;
        script.onerror = null;

        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      }

      resolve(loaded);
    };

    timeout = window.setTimeout(() => finish(false), timeoutMs);

    script.onload = () => finish(true);
    script.onerror = () => finish(false);

    if (!existingScript) {
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return razorpayScriptPromise;
}
