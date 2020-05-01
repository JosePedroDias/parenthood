const KIND_WITH_OPERAND = '+';
const KIND_ALMOST_WITH_OPERAND = '..';
const KIND_HAS_BEEN_WITH_OPERAND = '+/';

const KIND_WITH = 'with';
const KIND_ALMOST_WITH = 'almost_with';
const KIND_HAS_BEEN_WITH = 'has_been_with';

const KIND_ALMOST_WITH_COLOR = 'cyan';
const KIND_HAS_BEEN_WITH_COLOR = 'red';

const DEFAULT_SHAPE = 'box';
const DEFAULT_FONT = 'Helvetica';
const SHAPE_POINT_ATTR = '[shape=point]';

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
      if (rel === KIND_WITH_OPERAND) {
        kind = KIND_WITH;
      } else if (rel === KIND_ALMOST_WITH_OPERAND) {
        kind = KIND_ALMOST_WITH;
      } else if (rel === KIND_HAS_BEEN_WITH_OPERAND) {
        kind = KIND_HAS_BEEN_WITH;
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
    if (kind === KIND_HAS_BEEN_WITH) {
      relAttrs = ` [color=${KIND_HAS_BEEN_WITH_COLOR}]`;
    } else if (kind === KIND_ALMOST_WITH) {
      relAttrs = ` [color=${KIND_ALMOST_WITH_COLOR}]`;
    }
    part = [
      `  subgraph {
    rank=same
    ${a} -- ${a}_${b} -- ${b}${relAttrs}
    ${a}_${b} ${
        relAttrs ? relAttrs.substring(1, relAttrs.length - 1) + ' ' : '['
      }${SHAPE_POINT_ATTR.substring(1)}`,
    ];
    part.push('  }');

    if (siblings) {
      part.push('');
      part.push(`  ${a}_${b} -- ${a}_${b}_sibs`);
      part.push('');
      part.push(`  ${a}_${b}_sibs ${SHAPE_POINT_ATTR}`);
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
  node [shape=${DEFAULT_SHAPE} fontname=${DEFAULT_FONT}]

${parts.join('\n\n')}

}`;
}
