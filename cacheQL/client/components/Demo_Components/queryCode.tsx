// import { CopyBlock, dracula } from 'react-code-blocks'
type Querystr = {
  checkbox1: boolean;
  checkbox2: boolean;
  checkbox3: boolean;
  checkbox4: boolean;
  keys: string[];
  currentDropdown: string;
  id: string | undefined;
};

export default function QueryCode({checkbox1, checkbox2, checkbox3, checkbox4, keys, currentDropdown, id}: Querystr) {

  // define what which properties will be displayed (ex: name, mass). These are used for being able to create the query code format to display
  const firstBox:string = checkbox1 ? `${keys[0]}` : "";
  const secondBox: string = checkbox2 ? `${keys[1]}` : "";
  const thirdBox: string = checkbox3 ? `${keys[2]}` : "";
  const fourthBox: string = checkbox4 ? `${keys[3]}` : "";
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
      <div className="second-indent">{fourthBox ? `${fourthBox},` : null}</div>
      <div className="first-indent">{end}</div>
      <div>{"}"}</div>
    </div>
  );
}
