/* global require, __dirname */
/* eslint-disable no-console */
const util = require('util');
const fs = require('fs');
const _ = require('lodash');
util.inspect.defaultOptions.maxArrayLength = null;

const root = require('./typedoc.json');

// console.log(getRows(findNode('ChartPieData')));

// Generate pieProperties
toMarkdown(getRows(findNode('ChartPieData')), {
  filePath: '/chartsAdvanced/pieProperties.md',
  columns: [
    { key: 'chain', name: 'Property' },
    { key: 'description', name: 'Details', format: (cell, row) => {
      // console.log(cell, row)
      return generalDetails(row);
    } }
  ]
});

// Generate sankeyProperties
toMarkdown(getRows(findNode('ChartSankeyData')), {
  filePath: '/chartsAdvanced/sankeyProperties.md',
  columns: [
    { key: 'chain', name: 'Property' },
    { key: 'description', name: 'Details', format: (cell, row) => {
      // console.log(cell, row)
      return generalDetails(row);
    } }
  ]
});

// Generate sunburstProperties
toMarkdown(getRows(findNode('ChartSunburstData')), {
  filePath: '/chartsAdvanced/sunburstProperties.md',
  columns: [
    { key: 'chain', name: 'Property' },
    { key: 'description', name: 'Details', format: (cell, row) => {
      // console.log(cell, row)
      return generalDetails(row);
    } }
  ]
});

// Generate axisProperties
toMarkdown(getRows(findNode('ChartAxisData')), {
  filePath: '/chartsAdvanced/axisProperties.md',
  columns: [
    { key: 'chain', name: 'Property' },
    { key: 'description', name: 'Details', format: (cell, row) => {
      let str = generalDetails(row);
      if (row.generators) str += `<strong>Generators:</strong> ${row.generators}`;
      return str;
    } }
  ]
});

function generalDetails (row) {
  // if (row.name === 'legendIcon') console.log(row.description.replace(/[\n\r]/g, ''));
  let types = row.types.filter(t => t !== 'undefined').join(', ');
  let str = '';
  if (row.description) str += `${row.description}<br><br>`;
  if (types) str += `<strong>Type:</strong> ${types}<br>`;
  if (row.default) str += `<strong>Default:</strong> \`${row.default}\`<br>`;
  if (row.optional) str += `<strong>Optional:</strong> true<br>`;
  // if (row.level) str += `<strong>level:<strong> ${row.level}<br>`;
  return str.replace(/\n/g, ' ');
}

// Find specific node within a root node by name.
function findNode(name, node = root) {
  if (node.name === name) {
    return node;
  } else if (node.children) {
    for (const childNode of node.children) {
      const locatedNode = findNode(name, childNode);
      if (locatedNode) return locatedNode;
    }
  } else {
    return null;
  }
}

// Get array of types that satisfy, this will also trigger additional getRows calls if nested properties exist in the types
function getTypes(type, rows, visited, chain, types = []) {
  let referenced = null;
  switch (type.type) {
    case 'union':
      type.types.map(t => getTypes(t, rows, visited, chain, types));
      break;
    case 'intrinsic':
      types.push(type.name);
      break;
    case 'stringLiteral':
      types.push(`"${type.value}"`);
      break;
    case 'reference':
      referenced = findNode(type.name);
      if (referenced && referenced.children) {
        getRows(referenced, rows, visited, chain);
        types.push('object');
      } else if (referenced) {
        getTypes(referenced.type, rows, visited, chain, types);
      } else {
        if (type.name === 'Array') {
          for (const typeArgument of type.typeArguments) {
            types.push('array');
            getRows(typeArgument, rows, visited, `${chain}[]`);
          }
        } else {
          types.push(type.name);
        }
      }
      break;
    case 'reflection':
      types.push(getReflectionType(type, rows, visited, chain));
      break;
  }
  return types;
}

// Get get reflection type, if there is a signature then return a structured function, otherwise trigger additional getRows
function getReflectionType(type, rows, visited, chain) {
  if (type.declaration.signatures) {
    const signature = type.declaration.signatures[0];
    const returnTypes = getTypes(signature.type, rows, visited, chain);
    return `(${signature.parameters.map(p => p.name).join(', ')}) => ${returnTypes.join(', ')}`;
  } else {
    getRows(type.declaration, rows, visited, chain);
    return 'object';
  }
}

// Get doc row structure.
function getRow(node, rows, visited, chain) {
  const comment = node.comment || {};
  const tags = comment.tags || [];
  const def = tags.find(t => t.tag === 'default');
  const generators = tags.find(t => t.tag === 'generators');
  const flags = node.flags || {};
  const optional = flags.isOptional;
  const level = chain.split('.').length - 1;
  const children = [];
  const row = {
    chain,
    level,
    optional,
    children,
    required: !optional,
    description: comment.shortText,
    name: node.name,
    types: getTypes(node.type, children, visited, chain)
  };
  if (def) row.default = def.text;
  if (generators) row.generators = generators.text;
  return row;
}

function nodeKey(node) {
  return `${node.id}:${node.name}`;
}

// Get doc rows starting at a root node.
function getRows(node, rows = [], visited = [], chain = 'data') {
  if (node && node.type === 'reference') node = findNode(node.name);
  // if (node) console.log(node.name, chain, visited.includes(nodeKey(node)));
  if (node && !visited.includes(nodeKey(node))) {
    if (node.id) visited.push(nodeKey(node));

    for (const child of (node.children || [])) {
      const childChain = `${chain}.${child.name}`;
      rows.push(getRow(child, rows, visited.slice(0), childChain));
    }

    let childNodes = node.types || [];
    if (node.type && node.type.typeArguments) childNodes = childNodes.concat(node.type.typeArguments);
    if (node.type && node.type.types) {
      childNodes = childNodes.concat(node.type.types);
    }
    for (const childNode of childNodes) {
      getRows(childNode, rows, visited.slice(0), chain);
    }
  }
  return _.uniqWith(_.orderBy(rows, ['optional', 'chain'], ['desc', 'asc']), _.isEqual);
}

function toMarkdown(rows, options) {
  const tableLogic = `

<script>
  function toggleNextRow(el) {
    const nextRow = el.nextElementSibling;
    nextRow.classList.toggle('hidden');
    el.classList.toggle('expanded');
  } 
</script>

<style>
  .parent td:first-child::before {
    position: absolute;
    left: 8px;
    content: '\\f0da';
    font-family: FontAwesome;
  }

  .expanded td:first-child::before {
    content: '\\f0d7';
    font-family: FontAwesome;
  }

  .child > td {
    padding: 0 !important;
    border: none !important;
  }

  .child table {
    margin: 0 !important;
    border: 0 !important;
  }

  tr td:first-child {
    min-width: 250px;
    max-width: 250px;
    width: 250px;
  }

  tr.hidden {
    display: none;
  }

  td {
    position: relative;
  }

  tbody tr td:first-child {
    padding-left: 20px;
  }
</style>

`;
  let markdown = tableLogic + '<table><thead><tr>';

  for (const column of options.columns) {
    markdown += `<th>${column.name}</th>`;
  }

  markdown += `</tr></thead><tbody>`;

  for (const row of rows) {
    markdown += `<tr ${row.children.length ? 'class="parent" onclick="toggleNextRow(this)"' : null}>`;
    for (const column of options.columns) {
      markdown += cellMarkdown(row, column);
    }
    markdown += `</tr>`;

    if (row.children.length) {
      markdown += `<tr class="child hidden">
        <td colspan="2"><table><tbody>${childrenMarkdown(row, options)}</tbody></table></td>
      </tr>`;
    }
  }
  markdown += `</tbody></table>`;

  fs.writeFile(__dirname + options.filePath, markdown, function(err) {
    if(err) {
      return console.log(err);
    }
  });
}

function childrenMarkdown(row, options) {
  let markdown = '';
  for (const childRow of (row.children || [])) {
    markdown += `<tr>`;
    for (const column of options.columns) {
      markdown += cellMarkdown(childRow, column);
    }
    markdown += `</tr>${childrenMarkdown(childRow, options)}`;
  }
  return markdown;
}

function cellMarkdown(row, column) {
  return `<td>${((column.format || (cell => cell))(row[column.key], row) || '').replace(/\n/g, '<br>')}</td>`;
}