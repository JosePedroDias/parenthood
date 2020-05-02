const KIND_WITH_OPERAND = '+';
const KIND_ALMOST_WITH_OPERAND = '..';
const KIND_HAS_BEEN_WITH_OPERAND = '+/';

const KIND_WITH = 'with';
const KIND_ALMOST_WITH = 'almost_with';
const KIND_HAS_BEEN_WITH = 'has_been_with';

const KIND_ALMOST_WITH_COLOR = 'cyan';
const KIND_HAS_BEEN_WITH_COLOR = 'red';

const MAX_NAME_LENGTH = 15;
const NODE_FONT_SIZE = 10;
const NODE_FONT_SIZE2 = 6;
const NODE_MARGIN = 0.02;

// custom to allow labelling
const SHAPE_POINT = 'shape=circle style=filled width=0.05 fixedsize=true';
const SHAPE_POINT2 = 'shape=none width=0 height=0 label=""';

const DEFAULT_SHAPE = 'rect'; // box plain rect
const DEFAULT_FONT = 'Helvetica';

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
      relAttrs = ` color=${KIND_HAS_BEEN_WITH_COLOR}`;
    } else if (kind === KIND_ALMOST_WITH) {
      relAttrs = ` color=${KIND_ALMOST_WITH_COLOR}`;
    }
    part = [
      `  subgraph {
    rank=same
    "${a}" -- "${a}_${b}" -- "${b}" [${relAttrs} penwidth=1.5 weight=2 len=0.7]
    "${a}" [label="${a.substring(0, MAX_NAME_LENGTH)}" tooltip="${a}"]
    "${b}" [label="${b.substring(0, MAX_NAME_LENGTH)}" tooltip="${b}"]
    "${a}_${b}" [${relAttrs} ${SHAPE_POINT2}]`, // label="${kind}" fontsize=${NODE_FONT_SIZE2}
    ];
    part.push('  }');

    if (siblings) {
      part.push('');
      part.push(`  "${a}_${b}" -- "${a}_${b}_sibs"`);
      part.push('');
      part.push(`  "${a}_${b}_sibs" [${SHAPE_POINT2}]`);
      part.push('');
      for (const s of siblings) {
        part.push(
          `  "${a}_${b}_sibs" -- "${s}" [dir=forward arrowType=open arrowsize=0.5]` // penwidth=0.1
        );
      }
      part.push('');
      part.push('  subgraph {');
      part.push('    rank=same');
      for (const s of siblings) {
        part.push(
          `    "${s}" [label="${s.substring(
            0,
            MAX_NAME_LENGTH
          )}" tooltip="${s}"]`
        );
      }
      part.push('  }');
    }

    parts.push(part.join('\n'));
  }

  return `graph {
  node [shape=${DEFAULT_SHAPE} style=rounded fontname=${DEFAULT_FONT} fontsize=${NODE_FONT_SIZE} margin=${NODE_MARGIN}]
  splines=true
  overlap=false
  #pack=true
  #packMode="node"
  #ratio=1.5
  #rankdir="LR"
  #newrank=true


${parts.join('\n\n')}

}`;
}
