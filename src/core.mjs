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

export function handleWhitespaceAndComment(line) {
  let data = line.trim();
  const indexOfHash = data.indexOf('#');
  if (indexOfHash !== -1) {
    data = data.substring(0, indexOfHash).trim();
  }
  return data;
}

const ops = [
  KIND_ALMOST_WITH_OPERAND,
  KIND_HAS_BEEN_WITH_OPERAND,
  KIND_WITH_OPERAND, // we want to parse this last because KIND_HAS_BEEN_WITH_OPERAND has substring of KIND_WITH_OPERAND
];
const opToKind = {
  [KIND_WITH_OPERAND]: KIND_WITH,
  [KIND_ALMOST_WITH_OPERAND]: KIND_ALMOST_WITH,
  [KIND_HAS_BEEN_WITH_OPERAND]: KIND_HAS_BEEN_WITH,
};

export function tokenizeByOperand(line) {
  for (let op of ops) {
    const i = line.indexOf(op);
    if (i !== -1) {
      return [
        line.substring(0, i).trim(),
        op,
        line.substring(i + op.length).trim(),
      ];
    }
  }
}

export function pplStringToRelationships(s) {
  const lines = s.split('\n');

  const relationships = [];

  let randomI = 1;

  let lastRelationship;

  for (const l_ of lines) {
    const l = handleWhitespaceAndComment(l_);
    if (l === '') {
    } else if (l_[0] === ' ' || l_[0] === '\t') {
      if (!lastRelationship.siblings) {
        lastRelationship.siblings = [];
      }
      lastRelationship.siblings.push(l);
    } else {
      let [a, op, b] = tokenizeByOperand(l);
      if (!op) {
        throw new Error(`Unsupported syntax: "${l_}"`);
      }
      if (a === '?') {
        a = `random${randomI++}`;
      }
      if (b === '?') {
        b = `random${randomI++}`;
      }
      const kind = opToKind[op];
      lastRelationship = {
        a,
        b,
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
