(function () {
  // Prevent adding multiple buttons if script runs twice
  if (document.getElementById('freedium-bypass-btn')) return;

  // Create the button element
  const btn = document.createElement('button');
  btn.id = 'freedium-bypass-btn';
  btn.className = 'freedium-floating-btn';
  btn.innerText = 'Read Full Article';

  // Attach click listener
  btn.addEventListener('click', () => {
    // Default settings fallback
    const DEFAULT_MIRROR_URL = "https://freedium-mirror.cfd/";
    const DEFAULT_OPEN_BEHAVIOR = "current_tab";

    chrome.storage.sync.get(
      { bypassMirrorUrl: DEFAULT_MIRROR_URL, openBehavior: DEFAULT_OPEN_BEHAVIOR },
      (items) => {
        let mirrorUrl = items.bypassMirrorUrl;
        if (!mirrorUrl.endsWith('/')) {
          mirrorUrl += '/';
        }

        const bypassedUrl = mirrorUrl + window.location.href;

        if (items.openBehavior === "new_tab") {
          window.open(bypassedUrl, '_blank');
        } else if (items.openBehavior === "side_panel") {
          chrome.runtime.sendMessage({ action: "open_side_panel", url: bypassedUrl });
        } else {
          // "current_tab"
          window.location.href = bypassedUrl;
        }
      }
    );
  });

  // Apply position based on settings before appending
  chrome.storage.sync.get({ buttonPosition: "bottom_center" }, (items) => {
    btn.classList.add(`pos-${items.buttonPosition.replace('_', '-')}`);
    document.body.appendChild(btn);
  });

  // --- Premium Article Detection ---

  // Function to check if the paywall badge exists
  const isPremiumArticle = () => {
    // Medium uses an SVG star with fill="#FFC017" and the text "Member-only story"
    // We do a simple text search inside the body as a robust fallback.
    const bodyText = document.body.innerText || "";
    return bodyText.includes("Member-only story");
  };

  // Function to show the button if premium
  const checkAndShowButton = () => {
    if (isPremiumArticle()) {
      btn.classList.add('freedium-show');
      return true; // Found it
    }
    return false;
  };

  // Initial check
  if (!checkAndShowButton()) {
    // If not found immediately, set up an observer (Medium is an SPA, content loads dynamically)
    const observer = new MutationObserver((mutations) => {
      if (checkAndShowButton()) {
        // Once we find it and show the button, we can stop observing to save performance
        observer.disconnect();
      }
    });

    // Start observing the document body for injected nodes
    observer.observe(document.body, { childList: true, subtree: true });

    // Handle SPA navigation (user clicks a link to another article without full reload)
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        btn.classList.remove('freedium-show'); // Hide button
        observer.observe(document.body, { childList: true, subtree: true }); // Restart search
        checkAndShowButton(); // Quick check
      }
    }).observe(document, { subtree: true, childList: true });
  }

})();
