/**
 * The `useStretchFont` function adjusts the font size of HTML elements based on their width and specified minimum and
 * maximum font size values.
 * @param [className=stretch-font] - The class name that identifies the elements that should have their font size
 * stretched. The default value is "stretch-font".
 * @param [root] - The `root` parameter is an optional argument that specifies the root element to search for nodes with
 * the class name `className`. If no `root` element is specified, the function will search the entire document for nodes
 * with the class name `className`.
 */
function useStretchFont(root = document, className = "stretch-font") {
  let Nodes = [];
  let resizeObserver = null;

  /**
   * The function saves the font size of a node and adds a child element with the same text and font size.
   * @param node - The HTML element node that we want to save the font size for and add a new element to.
   * @returns There is no return statement in this code snippet, so nothing is being returned.
   */
  function saveFontSize(node) {
    if (!node.dataset.fz) {
      node.dataset.fz = getFontSize(node).slice(0, -2);
    }

    if (node.firstChild.classList?.contains(className + "__save")) return false;
    const n = document.createElement("i");
    n.classList.add(className + "__save");
    n.innerHTML = node.innerText;
    n.style.fontSize = node.dataset.fz + "px";
    node.insertBefore(n, node.firstChild);

    return true;
  }

  /**
   * The function returns the font size of a given node element.
   * @param node - The node parameter is a reference to a DOM element whose font size is to be retrieved.
   * @returns The function `getFontSize` returns the computed font size of the specified `node` element.
   */
  function getFontSize(node) {
    return self.getComputedStyle(node, null).getPropertyValue("font-size");
  }

  /**
   * The function adjusts the font size of a given node based on its width and specified minimum and maximum sizes.
   * @param node - The HTML element node that needs to have its font size adjusted based on its width and the provided data
   * attributes.
   */
  function formula(node) {
    let { fz, stretchMin: min, stretchMax: max } = node.dataset;
    min !== undefined && (min = +(min || fz));
    max !== undefined && (max = +(max || fz));

    const calc = (node.offsetWidth / node.firstChild.offsetWidth) * +fz * 0.97;
    const size = calc > max ? max : calc < min ? min : calc;
    node.style.fontSize = size + "px";
  }

  /**
   * The function resizes the font of entries using requestAnimationFrame.
   * @param entries - The `entries` parameter is an array of `IntersectionObserverEntry` objects. These objects represent
   * the elements that are being observed by an `IntersectionObserver` instance and contain information about their
   * intersection with the viewport. In this case, the `entries` array is being passed to a function called `entries
   */
  function entriesResize(entries) {
    self.requestAnimationFrame(() => entries.forEach(({ target }) => formula(target)));
  }

  /**
   * The function finds all nodes with a specific class name within a given target element.
   * @param target - The target parameter is a DOM element that is being searched for nodes with a specific class name.
   * @returns The function `findNodes` returns an array of DOM elements that have a class name matching the `className`
   * parameter. If the `target` parameter itself has the matching class name, it will be the only element in the returned
   * array. If there are no matching elements, an empty array will be returned.
   */
  function findNodes(target) {
    if (target.classList?.contains(className)) return [target];
    return target.querySelectorAll("." + className) || [];
  }

  self.addEventListener("DOMContentLoaded", () => {
    Nodes = findNodes(root);
    resizeObserver = new ResizeObserver(entriesResize);

    new MutationObserver((entries) => {
      entries.forEach(({ target }) => {
        findNodes(target).forEach(node => {
          if (!saveFontSize(node)) return;
          formula(node);
          resizeObserver.observe(node);
        })
      })
    }).observe(root, { childList: true, subtree: true });

    Nodes.forEach((node) => {
      if (!saveFontSize(node)) return;
      resizeObserver.observe(node);
    });
  });
}

export default useStretchFont;
