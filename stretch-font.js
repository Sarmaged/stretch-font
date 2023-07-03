function useStretchFont(root = document, className = 'stretch-font') {
  let $tmpl

  const $weight = [0.99, 0.99, 0.99, 0.98, 0.98, 0.92, 0.92, 0.92, 0.92]
  const $class = 'stretch-font__tmpl'
  const $store = new Map()

  const resizeObserver = new ResizeObserver(entries => {
    self.requestAnimationFrame(() => entries.forEach(({ target, contentRect }) => formula(target, contentRect)))
  })

  const mutationObserver = new MutationObserver(entries => {
    const search = [...new Set(entries.map(x => x.target))]
    if (!search.length) return

    let nodes = []
    for (const target of search) {
      if (target.classList.contains(className)) {
        nodes.push(target)
      }
      nodes = [...nodes, ...getNodes(target)]
    }

    for (const node of nodes.values()) build(node)
  })

  function setDisplay(node) {
    const display = self.getComputedStyle(node).display
    if (display === 'inline') node.classList.add('stretch-font__inline')
  }

  function store(node, payload = {}) {
    if (!payload && !Object.keys(payload).length) return
    const o = $store.get(node)
    $store.set(node, { ...o, ...payload })
  }
  function setSize(node) {
    if ($store.get(node)?.size) return
    const size = +self.getComputedStyle(node).fontSize.slice(0, -2)

    store(node, { size })
  }
  function setWeight(node) {
    if ($store.get(node)?.weight) return
    const weight = self.getComputedStyle(node).fontWeight

    store(node, { weight })
  }
  function setMin(node) {
    if ($store.get(node)?.min) return
    let { stretchMin: min } = node.dataset

    store(node, { min: +min })
  }
  function setMax(node) {
    if ($store.get(node)?.max) return
    let { stretchMax: max } = node.dataset

    store(node, { max: +max })
  }
  function setParams(node) {
    const n = document.createElement('span')
    n.innerHTML = node.innerHTML
    n.style.fontSize = $store.get(node)?.size
    $tmpl.appendChild(n)

    let { freeze } = $store.get(node)
    let { width, height } = n.getBoundingClientRect()
    const isStretch = 'stretch' in node.dataset || 'stretchX' in node.dataset || 'stretchY' in node.dataset

    if (isStretch) {
      freeze = [0, 0]
    } else {
      freeze ??= [width, height]
    }

    store(node, { width, height, freeze })

    n.remove()
  }

  function hasTmpl() {
    let node = document.querySelector('.' + $class)

    if (!node) {
      node = document.createElement('div')
      node.classList.add($class)
      document.querySelector('body').appendChild(node)
    }

    return node
  }

  function formula(node, rect = null) {
    if (!rect) rect = node.getBoundingClientRect()
    const { size, min, max, width, height, freeze, weight } = $store.get(node)
    const V = $weight.at(weight / 100 - 1)

    const X = ((freeze[0] || rect.width) / width) * size * V
    const Y = ((freeze[1] || rect.height) / height) * size * V

    let fz = X > max || Y > max ? max : X < min || Y < min ? min : X < Y ? X : Y
    if ('stretchX' in node.dataset && !('stretchY' in node.dataset)) fz = X > max ? max : X < min ? min : X
    if ('stretchY' in node.dataset && !('stretchX' in node.dataset)) fz = Y > max ? max : Y < min ? min : Y

    node.style.fontSize = fz + 'px'
  }

  function getNodes(target) {
    return target.querySelectorAll('.' + className) || []
  }

  function saveNode(node) {
    setDisplay(node)
    if ('stretchMin' in node.dataset) setMin(node)
    if ('stretchMax' in node.dataset) setMax(node)
    setSize(node)
    setWeight(node)
    setParams(node)
  }

  function build(node) {
    saveNode(node)
    formula(node)
    resizeObserver.observe(node)
  }

  self.addEventListener('DOMContentLoaded', () => {
    $tmpl = hasTmpl()

    for (const node of getNodes(root).values()) build(node)

    mutationObserver.observe(root, { childList: true, subtree: true })
  })
}

export default useStretchFont
