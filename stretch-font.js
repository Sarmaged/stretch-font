/**
 * The `useStretchFont` function adjusts the font size of HTML elements based on their width and specified minimum and
 * maximum font size values.
 * @param [className=stretch-font] - The class name that identifies the elements that should have their font size
 * stretched. The default value is "stretch-font".
 * @param [root] - The `root` parameter is an optional argument that specifies the root element to search for nodes with
 * the class name `className`. If no `root` element is specified, the function will search the entire document for nodes
 * with the class name `className`.
 */
function useStretchFont(root = document, className = 'stretch-font') {
  const tmplClass = 'stretch-font__tmpl'
  const store = new Map()
  let resizeObserver = null

  // Create template for width container
  const body = document.getElementsByTagName('body')[0]
  const tmpl = document.createElement('div')
  tmpl.classList.add(tmplClass)
  body.appendChild(tmpl)

  // Helpers
  function uniqArrayKeys(array) {
    return [...new Set(array)]
  }
  function getWidth(node) {
    return node.getBoundingClientRect().width
  }
  function storeSave(node, payload = {}) {
    if (!payload && !Object.keys(payload).length) return
    const o = store.get(node)
    store.set(node, { ...o, ...payload })
  }

  // Get and save to store
  function setSize(node) {
    if (store.get(node)?.size) return
    const size = getFontSize(node)

    storeSave(node, { size })
  }
  function setMin(node) {
    if (store.get(node)?.min) return
    let { stretchMin: min } = node.dataset

    storeSave(node, { min: +min })
  }
  function setMax(node) {
    if (!('stretchMax' in node.dataset)) return
    if (!node.dataset.stretchMax) return

    if (store.get(node)?.max) return
    let { stretchMax: max } = node.dataset

    storeSave(node, { max: +max })
  }
  function setWidth(node) {
    const o = store.get(node)

    const n = document.createElement('span')
    n.innerHTML = node.innerHTML
    n.style.fontSize = o.size + 'px'
    tmpl.appendChild(n)

    const { width } = n.getBoundingClientRect()
    const freeze = 'stretch' in node.dataset ? 0 : !o.freeze ? width : o.freeze

    storeSave(node, { width, freeze })

    n.remove()
  }

  /**
   * The function returns the font size of a given node element.
   * @param node - The node parameter is a reference to a DOM element whose font size is to be retrieved.
   * @returns The function `getFontSize` returns the computed font size of the specified `node` element.
   */
  function getFontSize(node) {
    return +self.getComputedStyle(node, null).getPropertyValue('font-size').slice(0, -2)
  }

  /**
   * The function adjusts the font size of a given node based on its width and predefined size, minimum and maximum values.
   * @param node - The HTML element node that we want to apply the font size formula to.
   */
  function formula(node) {
    let { size, min, max, width, freeze } = store.get(node)

    const calc = ((freeze || node.getBoundingClientRect().width) / width) * size * 0.985
    const x = calc > max ? max : calc < min ? min : calc

    node.style.fontSize = x + 'px'
  }

  /**
   * The function resizes the font of entries using requestAnimationFrame.
   * @param entries - The `entries` parameter is an array of `IntersectionObserverEntry` objects. These objects represent
   * the elements that are being observed by an `IntersectionObserver` instance and contain information about their
   * intersection with the viewport. In this case, the `entries` array is being passed to a function called `entries
   */
  function entriesResize(entries) {
    self.requestAnimationFrame(() => entries.forEach(({ target }) => formula(target)))
  }

  /**
   * The function finds all nodes with a specific class name within a given target element.
   * @param target - The target parameter is a DOM element that is being searched for nodes with a specific class name.
   * @returns The function `findNodes` returns an array of DOM elements that have a class name matching the `className`
   * parameter. If the `target` parameter itself has the matching class name, it will be the only element in the returned
   * array. If there are no matching elements, an empty array will be returned.
   */
  function getNodes(target) {
    return target.querySelectorAll('.' + className) || []
  }

  /**
   * The function "rebuild" performs various operations on a given node element, including setting its minimum and maximum
   * size, calculating its size and width, applying a formula, and observing its resizing.
   * @param node - The node parameter is a reference to a DOM element that needs to be rebuilt. The function rebuild() is
   * responsible for setting various properties and attributes of the node, such as its minimum and maximum size, its size,
   * and its width. It also calls a formula() function and sets up a resizeObserver
   */
  function rebuild(node) {
    if ('stretchMin' in node.dataset) setMin(node)
    if ('stretchMax' in node.dataset) setMax(node)
    setSize(node)
    setWidth(node)

    formula(node)
    resizeObserver.observe(node)
  }

  self.addEventListener('DOMContentLoaded', () => {
    // Watch resize
    resizeObserver = new ResizeObserver(entriesResize)

    // init
    getNodes(root).forEach(rebuild)

    // Watch mutation
    new MutationObserver(entries => {
      const manipulate = entries
        .filter(({ type, target }) => type === 'childList' && !target.classList?.contains(tmplClass))
        .map(({ target }) => {
          if (target.classList?.contains(className)) return target
          return [...Array.from(getNodes(target)).filter(node => !store.has(node))]
        })
        .flat()

      const mutation = entries
        .filter(({ type, target: { parentNode } }) => {
          if (type !== 'characterData') return
          if (!parentNode.classList?.contains(className)) return
          if (!store.has(parentNode)) return
          return store.get(parentNode).width !== getWidth(parentNode)
        })
        .map(({ target }) => target.parentNode)

      uniqArrayKeys([...mutation, ...manipulate]).forEach(rebuild)
    }).observe(root, { characterData: true, childList: true, subtree: true })
  })
}

export default useStretchFont
