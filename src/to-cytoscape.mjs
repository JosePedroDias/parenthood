// https://js.cytoscape.org/

import { pplStringToRelationships, KINDS } from './core.mjs';

export function relationshipsToCytoscape(relationships) {
  const elements = [];

  let nI = 0;
  let eI = 0;

  const knownPeople = new Map(); // person to node id

  function processNode(name, extra = {}) {
    let id = knownPeople.get(name);
    if (!id) {
      id = `n${nI++}`;
      knownPeople.set(name, id);
      elements.push({
        group: 'nodes',
        data: { id, ...extra },
      });
    }
    return id;
  }

  function processEdge(n1id, n2id, extra = {}) {
    const id = `e${eI++}`;
    elements.push({
      group: 'edges',
      data: { id, source: n1id, target: n2id, ...extra },
    });
  }

  for (const { a, b, kind, siblings } of relationships) {
    const aNodeId = processNode(a, { label: a });
    const bNodeId = processNode(b, { label: b });

    processEdge(aNodeId, bNodeId, {
      label: kind,
      color: 'red',
      arrowShape: 'none',
    });

    for (const sib of siblings) {
      const sNodeId = processNode(sib, { label: sib });

      processEdge(aNodeId, sNodeId, {
        label: 'parent_of',
        color: 'green',
        arrowShape: 'vee',
      });
      processEdge(bNodeId, sNodeId, {
        label: 'parent_of',
        color: 'green',
        arrowShape: 'vee',
      });
    }
  }

  return elements;
}

export function processPplString(s) {
  return relationshipsToCytoscape(pplStringToRelationships(s));
}
