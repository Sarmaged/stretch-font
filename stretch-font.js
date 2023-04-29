/**
 * The function `useStretchFont` dynamically adjusts font size based on the width of the parent element.
 * @param [className=stretch-font] - The name of the class that will be used to identify the elements that will have their
 * font size stretched. By default, it is set to "stretch-font".
 * @returns An object with a single method `rebuild`.
 */
function useStretchFont(className = "stretch-font") {
  let Nodes = [];

  /**
   * This function saves the font size of an element and sets it as the font size of its child element.
   * @param el - The HTML element that needs to have its font size saved and set.
   * @returns The function does not have a return statement, so it does not return anything.
   */
  function saveFontSize(el) {
    if (el.firstChild.classList?.contains(className + '__save')) return
    const n = document.createElement("div");
    n.classList.add(className + '__save');
    n.innerHTML = el.innerText;
    n.style.fontSize = getFontSize(el);
    el.insertBefore(n, el.firstChild);
    setFontSize(el);
  }

  /**
   * The function returns the font size of an element.
   * @param el - The parameter "el" is a reference to a DOM element whose font size we want to retrieve.
   * @returns The function `getFontSize` is returning the computed font size of the element passed as an argument.
   */
  function getFontSize(el) {
    return window.getComputedStyle(el, null).getPropertyValue("font-size");
  }

  /**
   * The function sets the font size of an element based on its width and optional minimum and maximum font sizes.
   * @param el - The parameter `el` is a reference to an HTML element.
   */
  function setFontSize(el) {
    const fz = getFontSize(el.firstChild).slice(0, -2);

    const calc = (el.offsetWidth / el.firstChild.offsetWidth) * +fz * 0.97;
    let { fontStretchMin: min, fontStretchMax: max } = el.dataset;
    min !== undefined && (min = +(min || fz));
    max !== undefined && (max = +(max || fz));

    const width = calc > max ? max : calc < min ? min : calc;
    el.style.fontSize = width + "px";
  }

  /**
   * The function rebuild selects all nodes with a specific class name and saves their font size.
   */
  function rebuild() {
    Nodes = document.querySelectorAll('.' + className) || [];
    Nodes.forEach(saveFontSize);
  }

  window.addEventListener("DOMContentLoaded", rebuild);
  window.onresize = () => Nodes.forEach(setFontSize);

  return {
    rebuild
  }
}

export default useStretchFont;
