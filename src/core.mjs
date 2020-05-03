const KIND_WITH = 'with';
const KIND_ALMOST_WITH = 'almost_with';
const KIND_HAS_BEEN_WITH = 'has_been_with';

const KIND_WITH_OPERAND = '+';
const KIND_ALMOST_WITH_OPERAND = '..';
const KIND_HAS_BEEN_WITH_OPERAND = '+/';

export const KINDS = {
  WITH: KIND_WITH,
  ALMOST_WITH: KIND_ALMOST_WITH,
  HAS_BEEN_WITH: KIND_HAS_BEEN_WITH,
};

export const KIND_OPERANDS = {
  WITH: KIND_WITH_OPERAND,
  ALMOST_WITH: KIND_ALMOST_WITH_OPERAND,
  HAS_BEEN_WITH: KIND_HAS_BEEN_WITH_OPERAND,
};

export const KIND_OPERANDS_ORDER = [
  KIND_ALMOST_WITH_OPERAND,
  KIND_HAS_BEEN_WITH_OPERAND,
  KIND_WITH_OPERAND, // we want to parse this last because KIND_HAS_BEEN_WITH_OPERAND has substring of KIND_WITH_OPERAND
];

const KIND_OPERAND_TO_KIND = {
  [KIND_WITH_OPERAND]: KIND_WITH,
  [KIND_ALMOST_WITH_OPERAND]: KIND_ALMOST_WITH,
  [KIND_HAS_BEEN_WITH_OPERAND]: KIND_HAS_BEEN_WITH,
};

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

export function tokenizeByOperand(line) {
  for (let op of KIND_OPERANDS_ORDER) {
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
      const kind = KIND_OPERAND_TO_KIND[op];
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
