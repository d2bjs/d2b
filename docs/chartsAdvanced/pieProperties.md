

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
    content: '\f0da';
    font-family: FontAwesome;
  }

  .expanded td:first-child > div::before {
    content: '\f0d7';
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

<table><thead><tr><th>Property</th><th>Details</th></tr></thead><tbody><tr class="parent" onclick="toggleNextRow(this)"><td><div style="margin-left:15px;" class="required">data.values</div></td><td>Array of pie values.<br><br><strong>Type:</strong> <code>array</code><br><strong>Required:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr null><td><div style="margin-left:30px;" class="required">value.label</div></td><td>Pie arc label.<br><br><strong>Type:</strong> <code>string</code><br><strong>Required:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="required">value.value</div></td><td>Pie arc value.<br><br><strong>Type:</strong> <code>number</code><br><strong>Required:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">value.color</div></td><td>Arc color, if set, this will override the pie's arc color accessor.<br><br><strong>Type:</strong> <code>string</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">value.empty</div></td><td>Initial arc visibility state, this will be modified internally by the pie chart.<br><br><strong>Type:</strong> <code>boolean</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">value.legendIcon</div></td><td>Legend icon symbol type. This can either be a font awesome character code (e.g. '\uf111' for a circle), [d3 symbol](https://github.com/d3/d3-shape#symbols) or [d2b symbol](https://docs.d2bjs.org/shape/symbols.html). If set, this will override the legend's icon property.<br><br><strong>Type:</strong> <code>string, SymbolType</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">value.tooltip</div></td><td>Arc tooltip content, if set, this will override the pie's arc tooltip accessor. Use null to disable the tooltip for this arc.<br><br><strong>Type:</strong> <code>string, null</code><br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr><tr null><td><div style="margin-left:15px;" class="optional">data.at</div></td><td>This specifies where the pie chart will reside within the chart frame. It can either be specified as a location descriptor or a center position computator.<br><br><strong>Type:</strong> <code>"top left", "top center", "top right", "center left", "center center", "center right", "bottom center", "bottom right", (width, height, radius) => number</code><br><strong>Default:</strong> <code>(width, height, radius) => { return { x: width / 2, y: height / 2 } }</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:15px;" class="optional">data.color</div></td><td>Pie arc color accessor function.<br><br><strong>Type:</strong> <code>string, (data) => string</code><br><strong>Default:</strong> <code>d => colorGenerator(d.label)</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:15px;" class="optional">data.cornerRadius</div></td><td>Corner radius of pie arcs in pixels.<br><br><strong>Type:</strong> <code>number</code><br><strong>Default:</strong> <code>0</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:15px;" class="optional">data.donutRatio</div></td><td>Ratio of the pie's inner radius to outer radius. Given as a decimal between 0 and 1.<br><br><strong>Type:</strong> <code>number</code><br><strong>Default:</strong> <code>0</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:15px;" class="optional">data.duration</div></td><td>The internal chart duration in miliseconds.<br><br><strong>Type:</strong> <code>number</code><br><strong>Default:</strong> <code>250</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:15px;" class="optional">data.endAngle</div></td><td>Pie chart end angle in radians.<br><br><strong>Type:</strong> <code>number</code><br><strong>Default:</strong> <code>2 * Math.PI</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:15px;" class="optional">data.padAngle</div></td><td>Pie chart angle padding in radians.<br><br><strong>Type:</strong> <code>number</code><br><strong>Default:</strong> <code>0</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:15px;" class="optional">data.radius</div></td><td>Pie chart outer radius computator. Usually relative to the container height and width.<br><br><strong>Type:</strong> <code>(width, height) => number</code><br><strong>Default:</strong> <code>(width, height) => Math.min(width, height) / 2</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:15px;" class="optional">data.sort</div></td><td>Pie arc sort comparator. Use null to order arcs according to the values array.<br><br><strong>Type:</strong> <code>null, (a, b) => number</code><br><strong>Default:</strong> <code>null</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:15px;" class="optional">data.startAngle</div></td><td>Pie chart start angle in radians.<br><br><strong>Type:</strong> <code>number</code><br><strong>Default:</strong> <code>0</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:15px;" class="optional">data.updated</div></td><td>Event hook for d2b charts. Will be after the chart is rendered. Note: Transitions may still occur after this lifecycle hook fires.<br><br><strong>Type:</strong> <code>(this, data) => void</code><br><strong>Optional:</strong> true<br></td></tr><tr class="parent" onclick="toggleNextRow(this)"><td><div style="margin-left:15px;" class="optional">data.chartPadding</div></td><td>The chart's inner padding (excluding the legend) in pixels.<br><br><strong>Type:</strong> <code>number, object</code><br><strong>Default:</strong> <code>10</code><br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr null><td><div style="margin-left:30px;" class="required">chartPadding.bottom</div></td><td><strong>Type:</strong> <code>number</code><br><strong>Required:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="required">chartPadding.left</div></td><td><strong>Type:</strong> <code>number</code><br><strong>Required:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="required">chartPadding.right</div></td><td><strong>Type:</strong> <code>number</code><br><strong>Required:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="required">chartPadding.top</div></td><td><strong>Type:</strong> <code>number</code><br><strong>Required:</strong> true<br></td></tr></tbody></table></td>
      </tr><tr class="parent" onclick="toggleNextRow(this)"><td><div style="margin-left:15px;" class="optional">data.legend</div></td><td>Chart legend configuration options.<br><br><strong>Type:</strong> <code>object</code><br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr null><td><div style="margin-left:30px;" class="optional">legend.clickable</div></td><td>Whether the legend will hide / show arcs on click.<br><br><strong>Type:</strong> <code>boolean</code><br><strong>Default:</strong> <code>true</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">legend.dblclickable</div></td><td>Whether the legend will hide / show arcs on dblclick.<br><br><strong>Type:</strong> <code>boolean</code><br><strong>Default:</strong> <code>true</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">legend.enabled</div></td><td>Enable or disable the legend.<br><br><strong>Type:</strong> <code>boolean</code><br><strong>Default:</strong> <code>true</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">legend.icon</div></td><td>Legend icon symbol type. This can either be a font awesome character code (e.g. '\uf111' for a circle), [d3 symbol](https://github.com/d3/d3-shape#symbols) or [d2b symbol](https://docs.d2bjs.org/shape/symbols.html). This can also be provided as an accessor to the pie value.<br><br><strong>Type:</strong> <code>string, SymbolType, (data) => string, SymbolType</code><br><strong>Default:</strong> <code>d3.symbolCircle</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">legend.orient</div></td><td>Legend orientation, relative to the chart.<br><br><strong>Type:</strong> <code>"top", "left", "right", "bottom"</code><br><strong>Default:</strong> <code>'bottom'</code><br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr><tr class="parent" onclick="toggleNextRow(this)"><td><div style="margin-left:15px;" class="optional">data.padding</div></td><td>The chart's outer padding (including the legend) in pixels.<br><br><strong>Type:</strong> <code>number, object</code><br><strong>Default:</strong> <code>10</code><br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr null><td><div style="margin-left:30px;" class="required">padding.bottom</div></td><td><strong>Type:</strong> <code>number</code><br><strong>Required:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="required">padding.left</div></td><td><strong>Type:</strong> <code>number</code><br><strong>Required:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="required">padding.right</div></td><td><strong>Type:</strong> <code>number</code><br><strong>Required:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="required">padding.top</div></td><td><strong>Type:</strong> <code>number</code><br><strong>Required:</strong> true<br></td></tr></tbody></table></td>
      </tr><tr class="parent" onclick="toggleNextRow(this)"><td><div style="margin-left:15px;" class="optional">data.size</div></td><td>The pixel size of the chart.<br><br><strong>Type:</strong> <code>object</code><br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr null><td><div style="margin-left:30px;" class="optional">size.height</div></td><td>The pixel height of the chart. If not given, the container height will be used.<br><br><strong>Type:</strong> <code>number</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">size.width</div></td><td>The pixel width of the chart. If not given, the container width will be used.<br><br><strong>Type:</strong> <code>number</code><br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr><tr class="parent" onclick="toggleNextRow(this)"><td><div style="margin-left:15px;" class="optional">data.tooltip</div></td><td>Chart tooltip configuration options.<br><br><strong>Type:</strong> <code>object</code><br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr null><td><div style="margin-left:30px;" class="optional">tooltip.at</div></td><td>This specifies where the tooltip will be positioned relative to the hovered item. By default, this will alternate between 'center left' and 'center right' depending on the position of the cursor relative to the viewport.<br><br><strong>Type:</strong> <code>"top left", "top center", "top right", "center left", "center center", "center right", "bottom center", "bottom right"</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">tooltip.followMouse</div></td><td>Tooltip will follow the mouse instead of being placed in a static position relative to the hovered element.<br><br><strong>Type:</strong> <code>boolean</code><br><strong>Default:</strong> <code>true</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">tooltip.html</div></td><td>Html content to be displayed in the arc's tooltip. A null value will disable the arc's tooltip.<br><br><strong>Type:</strong> <code>null, string, (data, value, percent) => string, null</code><br><strong>Default:</strong> <code>(d, percent) => `<b>${d.label}</b>: ${d.value} (${d3.format('.0%')(percent)})`</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">tooltip.my</div></td><td>Orientation of the tooltip. By default, this will alternate between 'left' and 'right' depending on the position of the cursor relative to the viewport.<br><br><strong>Type:</strong> <code>"top", "left", "right", "bottom"</code><br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr></tbody></table>