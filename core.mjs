const shapePointAttr = '[shape=point]';

export function processPplString(s) {
  return relationshipsToDot(pplStringToRelationships(s));
}

export function pplStringToRelationships(s) {
  const lines = s.split('\n');

  const relationships = [];

  let randomI = 1;

  let lastRelationship;

  for (const l of lines) {
    const lt = l.trim();
    if (lt[0] === '#' || lt === '') {
    } else if (l[0] === ' ') {
      if (!lastRelationship.siblings) {
        lastRelationship.siblings = [];
      }
      lastRelationship.siblings.push(l.trim());
    } else {
      const firstSpaceIdx = l.indexOf(' ');
      const lastSpaceIdx = l.lastIndexOf(' ');
      let personA = l.substring(0, firstSpaceIdx);
      let personB = l.substring(lastSpaceIdx + 1);
      if (personA === '?') {
        personA = `random${randomI++}`;
      }
      if (personB === '?') {
        personB = `random${randomI++}`;
      }
      const rel = l.substring(firstSpaceIdx, lastSpaceIdx).trim();
      let kind;
      if (rel === '+') {
        kind = 'with';
      } else if (rel === '+...') {
        kind = 'almost_with';
      } else if (rel === '+/') {
        kind = 'has_been_with';
      }
      lastRelationship = {
        a: personA,
        b: personB,
        kind,
      };
      relationships.push(lastRelationship);
    }
  }

  return relationships;
}

function relationshipsToDot(relationships) {
  const parts = [];
  let part;

  for (const { a, b, kind, siblings } of relationships) {
    let relAttrs = '';
    if (kind === 'has_been_with') {
      relAttrs = ' [color=red]';
    } else if (kind === 'almost_with') {
      relAttrs = ' [color=rose]';
    }
    part = [
      `  subgraph {
    rank=same
    ${a} -- ${a}_${b} -- ${b}${relAttrs}
    ${a}_${b} ${
        relAttrs ? relAttrs.substring(1, relAttrs.length - 1) + ' ' : '['
      }${shapePointAttr.substring(1)}`,
    ];
    part.push('  }');

    if (siblings) {
      part.push('');
      part.push(`  ${a}_${b} -- ${a}_${b}_sibs`);
      part.push('');
      part.push(`  ${a}_${b}_sibs ${shapePointAttr}`);
      part.push('');
      for (const s of siblings) {
        part.push(`  ${a}_${b}_sibs -- ${s}`);
      }
      part.push('');
      part.push('  subgraph {');
      part.push('    rank=same');
      for (const s of siblings) {
        part.push(`    ${s}`);
      }
      part.push('  }');
    }

    parts.push(part.join('\n'));
  }

  return `graph {
  node [shape=box fontname=Helvetica]

${parts.join('\n\n')}

}`;
}
