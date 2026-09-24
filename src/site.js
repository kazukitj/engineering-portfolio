const desktopLayout = window.matchMedia("(min-width: 761px)");

function updateResponsiveDetails() {
  document.querySelectorAll("details.entry-meta").forEach((details) => {
    details.open = desktopLayout.matches;
  });
}

updateResponsiveDetails();
desktopLayout.addEventListener("change", updateResponsiveDetails);

document.querySelectorAll("details.document-reader").forEach((reader) => {
  const frame = reader.querySelector("iframe[data-src]");

  const loadDocument = () => {
    if (reader.open && frame && !frame.hasAttribute("src")) {
      frame.setAttribute("src", frame.dataset.src);
    }
  };

  reader.addEventListener("toggle", loadDocument);
  loadDocument();
});
