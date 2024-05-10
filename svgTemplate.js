const propTypesTemplate = (
  { componentName, props, interfaces, imports, exports, jsx },
  { tpl },
) => {
  return tpl`
  ${imports};
  import type { SVGRProps } from "../../types/svgProps";
  
  const ${componentName} = (${props}) => (
    ${jsx}
  );
  ${componentName}.displayName='${componentName}';
   
  ${exports};
  `;
};

module.exports = propTypesTemplate;
