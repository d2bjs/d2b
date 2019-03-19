// Advanced charts are used by supplying the `advanced = true` flag to the d2b chart generators
// advanced charts are simply d2b chart wrappers that provide additional chart configuration 
// in the supplied chart datum

export {default as chartPieAdvanced} from './pie';
export {default as chartAxisAdvanced} from './axis';
export {default as chartSunburstAdvanced} from './sunburst';
export {default as chartSankeyAdvanced} from './sankey';
