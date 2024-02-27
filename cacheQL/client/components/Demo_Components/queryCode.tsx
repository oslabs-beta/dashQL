// import { CopyBlock, dracula } from 'react-code-blocks'
type Querystr = {
  checkbox1: boolean;
  checkbox2: boolean;
  checkbox3: boolean;
  checkbox4: boolean;
  nestedBox: boolean;
  nestedBox2: boolean;
  keys: string[];
  currentDropdown: string;
  id: string | undefined;
};

export default function QueryCode({checkbox1, checkbox2, checkbox3, checkbox4, nestedBox, nestedBox2, keys, currentDropdown, id}: Querystr) {

  // define what which properties will be displayed (ex: name, mass). These are used for being able to create the query code format to display
  const firstBox:string = checkbox1 ? `${keys[0]}` : "";
  const secondBox: string = checkbox2 ? `${keys[1]}` : "";
  const thirdBox: string = checkbox3 ? `${keys[2]}` : "";
  let fourthBox: string;
  if (checkbox4 && currentDropdown === 'people'){
    fourthBox = `${keys[3]} {`
  } else if (checkbox4 && currentDropdown !== 'people'){
    fourthBox = `${keys[3]}`
  } else {
    fourthBox = ""
  }


  const firstNestedBox: string = nestedBox && checkbox4 ? `${keys[4]}` : "";
  const secondNestedBox: string = nestedBox2 && checkbox4 ? `${keys[5]}` : "";
  
  const idBox: string = id ? `(_id:${id})` : "";
  const end: null | string = !firstBox && !secondBox && !thirdBox && !fourthBox ? null : `}`;

  return (
    <div className="query-text">
      <div id="query-tag">{`query {`}</div>
      <div className="first-indent">{`${currentDropdown} ${idBox} ${
        !firstBox && !secondBox && !thirdBox && !fourthBox ? "" : "{"
      }`}</div>
      <div className="second-indent">{firstBox ? `${firstBox},` : null}</div>
      <div className="second-indent">{secondBox ? `${secondBox},` : null}</div>
      <div className="second-indent">{thirdBox ? `${thirdBox},` : null}</div>
      <div className="second-indent">{fourthBox ? `${fourthBox}` : null}</div>
      <div className="third-indent">{firstNestedBox ? `name,` : null}</div>
      <div className="third-indent">{secondNestedBox ? `${secondNestedBox}` : null}</div>
      <div className="second-indent">{firstNestedBox || secondNestedBox ? `}` : null}</div>
      <div className="first-indent">{end}</div>
      <div id="query-tag">{"}"}</div>
    </div>
  );
}
