/**
 * Patches `parent`'s children to match an HTML string, reusing existing nodes.
 * Keeping nodes alive preserves focus, scroll positions, CSS transitions and running animations.
 */
export function morph(parent, html) {
  const next = document.createElement('template');
  next.innerHTML = html;
  patchChildren(parent, next.content);
}

function patchChildren(target, source) {
  const current = [...target.childNodes];
  const wanted = [...source.childNodes];

  wanted.forEach((node, i) => {
    const existing = current[i];
    if (!existing) target.append(document.importNode(node, true));
    else if (sameKind(existing, node)) patchNode(existing, node);
    else existing.replaceWith(document.importNode(node, true));
  });
  current.slice(wanted.length).forEach((node) => node.remove());
}

const sameKind = (a, b) => a.nodeType === b.nodeType && a.nodeName === b.nodeName;

function patchNode(existing, node) {
  if (existing.nodeType !== Node.ELEMENT_NODE) {
    if (existing.data !== node.data) existing.data = node.data;
    return;
  }
  patchAttributes(existing, node);
  patchChildren(existing, node);
  patchFormState(existing, node);
}

function patchAttributes(existing, node) {
  for (const { name } of [...existing.attributes]) {
    if (!node.hasAttribute(name)) existing.removeAttribute(name);
  }
  for (const { name, value } of node.attributes) {
    if (existing.getAttribute(name) !== value) existing.setAttribute(name, value);
  }
}

function patchFormState(existing, node) {
  const tag = existing.tagName;
  if (tag !== 'INPUT' && tag !== 'SELECT') return;
  const value = node.getAttribute('value') ?? '';
  if (existing !== document.activeElement && existing.value !== value) existing.value = value;
}
