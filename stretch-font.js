/**
 * The function `useStretchFont` dynamically adjusts font size based on the width of the parent element.
 * @param [className=stretch-font] - The name of the class that will be used to identify the elements that will have their
 * font size stretched. By default, it is set to "stretch-font".
 * @returns An object with a single method `rebuild`.
 */
function useStretchFont(className = "stretch-font") {
  let Nodes = [];
  let resizeObserver = null;
  let mutationObserver = null;

  /**
   * The function saves the font size of an element in its dataset if it is not already saved.
   * @param el - The "el" parameter is a reference to an HTML element. It is used in the function to get and set the font
   * size of the element.
   */
  function saveFontSize(el) {
    if (!el.dataset.fz) {
      el.dataset.fz = getFontSize(el).slice(0, -2);
    }
  }

  /**
   * The function creates a shadow element for a given HTML element.
   * @param el - The `el` parameter is a reference to a DOM element that the `createShadow` function will create a shadow
   * for.
   * @returns There is no return statement in this code snippet, so nothing is being returned explicitly.
   */
  function createShadow(el) {
    if (el.firstChild.classList?.contains(className + "__save")) return;
    const n = document.createElement("i");
    n.classList.add(className + "__save");
    n.innerHTML = el.innerText;
    n.style.fontSize = el.dataset.fz + "px";
    el.insertBefore(n, el.firstChild);
  }

  /**
   * The function returns the font size of an element.
   * @param el - The parameter "el" is a reference to a DOM element whose font size we want to retrieve.
   * @returns The function `getFontSize` is returning the computed font size of the element passed as an argument.
   */
  function getFontSize(el) {
    return self.getComputedStyle(el, null).getPropertyValue("font-size");
  }

  /**
   * The function sets the font size of an element based on its width and optional minimum and maximum font sizes.
   * @param el - The parameter `el` is a reference to an HTML element.
   */
  function setFontSize(el) {
    let { fz, stretchMin: min, stretchMax: max } = el.dataset;
    min !== undefined && (min = +(min || fz));
    max !== undefined && (max = +(max || fz));

    const calc = (el.offsetWidth / el.firstChild.offsetWidth) * +fz * 0.97;
    const width = calc > max ? max : calc < min ? min : calc;
    el.style.fontSize = width + "px";
  }

  /**
   * The function rebuild() iterates through Nodes, saves the font size of each element, and observes them using an
   * observer if available.
   */
  function rebuild() {
    Nodes.forEach((el) => {
      saveFontSize(el);
      createShadow(el);
      resizeObserver && resizeObserver.observe(el);
      mutationObserver && mutationObserver.observe(el, { childList: true });
    });
  }

  /**
   * The function resizes the font of entries using requestAnimationFrame.
   * @param entries - The `entries` parameter is an array of `IntersectionObserverEntry` objects. These objects represent
   * the elements that are being observed by an `IntersectionObserver` instance and contain information about their
   * intersection with the viewport. In this case, the `entries` array is being passed to a function called `entries
   */
  function entriesResize(entries) {
    self.requestAnimationFrame(() => entries.forEach(({ target }) => setFontSize(target)));
  }

  /**
   * The function applies the createShadow and setFontSize functions to each target element in an array of entries.
   * @param entries - The `entries` parameter is an array of `MutationRecord` objects. Each `MutationRecord` object
   * represents a single change that occurred in the observed DOM. The `entriesMutation` function iterates over this array
   * and performs some actions on each `target` element of the mutation.
   */
  function entriesMutation(entries) {
    entries.forEach(({ target }) => {
      createShadow(target);
      setFontSize(target);
    });
  }

  self.addEventListener("DOMContentLoaded", () => {
    Nodes = document.querySelectorAll("." + className) || [];
    resizeObserver = new ResizeObserver(entriesResize);
    mutationObserver = new MutationObserver(entriesMutation);
    rebuild();
  });

  return {
    rebuild,
  };
}

export default useStretchFont;
