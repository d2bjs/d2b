/* global require, __dirname */
/* eslint-disable no-console */
const util = require('util');
const fs = require('fs');
const _ = require('lodash');
util.inspect.defaultOptions.maxArrayLength = null;

const root = require('./typedoc.json');

// console.log(getRows(findNode('ChartPieData')));

// Generate pieProperties
toMarkdown(cleanRows(getRows(findNode('ChartPieData'))), {
  filePath: '/chartsAdvanced/pieProperties.md',
  columns: [
    { key: 'chain', name: 'Property', format: generalProperty },
    { key: 'description', name: 'Details', format: generalDetails }
  ]
});

// Generate sankeyProperties
toMarkdown(cleanRows(getRows(findNode('ChartSankeyData'))), {
  filePath: '/chartsAdvanced/sankeyProperties.md',
  columns: [
    { key: 'chain', name: 'Property', format: generalProperty },
    { key: 'description', name: 'Details', format: generalDetails }
  ]
});

// Generate sunburstProperties
toMarkdown(cleanRows(getRows(findNode('ChartSunburstData'))), {
  filePath: '/chartsAdvanced/sunburstProperties.md',
  columns: [
    { key: 'chain', name: 'Property', format: generalProperty },
    { key: 'description', name: 'Details', format: generalDetails }
  ]
});

// Generate axisProperties
toMarkdown(cleanRows(getRows(findNode('ChartAxisData'))), {
  filePath: '/chartsAdvanced/axisProperties.md',
  columns: [
    { key: 'chain', name: 'Property', format: generalProperty },
    { key: 'description', name: 'Details', format: (cell, row) => {
      let str = generalDetails(cell, row);
      if (row.generators) str += `<strong>Generators:</strong> ${row.generators}`;
      return str;
    } }
  ]
});

function generalDetails (cell, row) {
  // if (row.name === 'legendIcon') console.log(row.description.replace(/[\n\r]/g, ''));
  let types = row.types.filter(t => t !== 'undefined').join(', ');
  let str = '';
  if (row.description) str += `${row.description}<br><br>`;
  if (types) str += `<strong>Type:</strong> <code>${types}</code><br>`;
  if (row.default) str += `<strong>Default:</strong> <code>${row.default.trim()}</code><br>`;
  if (row.required) str += `<strong>Required:</strong> true<br>`;
  if (row.optional) str += `<strong>Optional:</strong> true<br>`;
  // if (row.level) str += `<strong>level:<strong> ${row.level}<br>`;
  return str.replace(/\n/g, ' ');
}

function generalProperty (cell, row) {
  const property = row.chain.split('.').slice(-2).join('.').replace('s[]', '').replace('children[]', 'child');
  return `<div style="margin-left:${row.level * 15}px;" class="${row.optional ? 'optional' : 'required'}">${property}</div>`;
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
  return rows;
  // return mergeSimilarRows(_.uniqWith(_.orderBy(rows, ['optional', row => row.children.length > 0 , 'chain'], ['desc', 'asc', 'asc']), _.isEqual));
}

// Join similar rows together and sort them by optional flag, then children existence, then chain
function cleanRows(rows) {
  return _.uniqWith(_.orderBy(Object.values(_.groupBy(rows, row => `${row.chain}:${row.description}`)).map(group => {
    return {
      chain: group[0].chain,
      level: group[0].level,
      optional: group[0].optional,
      required: group[0].required,
      description: group[0].description,
      name: group[0].name,
      default: group[0].default,
      children: cleanRows(_.flatten(group.map(row => row.children || []))),
      generators: _.uniq(_.flatten(group.map(row => (row.generators || '').split(',').map(gen => gen.trim())))).join(', ').replace(/\n/g, ' '),
      types: _.uniq(_.flatten(group.map(row => row.types)))
    };
  }), ['optional', row => row.children.length > 0 , 'chain'], ['desc', 'asc', 'asc']), _.isEqual);
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
  .optional {
    opacity: 0.8;
  }

  .required {
    font-weight: bold;
  }

  .parent td:first-child > div::before {
    position: absolute;
    left: -12px;
    content: '\\f0da';
    font-family: FontAwesome;
  }

  .expanded td:first-child > div::before {
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

  tr td:first-child > div {
    position: relative;
  }

  tr {
    background-color: white !important;
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

  markdown += rowsMarkdown(rows, options);

  // for (const row of rows) {
  //   markdown += `<tr ${row.children.length ? 'class="parent" onclick="toggleNextRow(this)"' : null}>`;
  //   for (const column of options.columns) {
  //     markdown += cellMarkdown(row, column);
  //   }
  //   markdown += `</tr>`;

  //   if (row.children.length) {
  //     markdown += `<tr class="child hidden">
  //       <td colspan="2"><table><tbody>${childrenMarkdown(row, options)}</tbody></table></td>
  //     </tr>`;
  //   }
  // }
  markdown += `</tbody></table>`;

  fs.writeFile(__dirname + options.filePath, markdown, function(err) {
    if(err) {
      return console.log(err);
    }
  });
}

function rowsMarkdown (rows, options) {
  let markdown = '';

  for (const row of (rows || [])) {
    markdown += `<tr ${row.children.length ? 'class="parent" onclick="toggleNextRow(this)"' : null}>`;
    for (const column of options.columns) {
      markdown += cellMarkdown(row, column);
    }
    markdown += `</tr>`;

    if (row.children.length) {
      markdown += `<tr class="child hidden">
        <td colspan="2"><table><tbody>${rowsMarkdown(row.children, options)}</tbody></table></td>
      </tr>`;
    }
  }
  return markdown;
}

// function childrenMarkdown(row, options) {
//   let markdown = '';
//   for (const childRow of (row.children || [])) {
//     markdown += `<tr>`;
//     for (const column of options.columns) {
//       markdown += cellMarkdown(childRow, column);
//     }
//     markdown += `</tr>${rowsMarkdown(childRow.children, options)}`;
//   }
//   return markdown;
// }

function cellMarkdown(row, column) {
  return `<td>${((column.format || (cell => cell))(row[column.key], row) || '').replace(/\n/g, '<br>')}</td>`;
}