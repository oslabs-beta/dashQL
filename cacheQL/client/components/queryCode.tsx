// import { CopyBlock, dracula } from 'react-code-blocks'
type Querystr = {
  checkbox1:boolean;
  checkbox2:boolean;
  checkbox3:boolean;
  checkbox4:boolean
  keys:string[];
  currentDropdown: string
  id: string
}

export default function QueryCode({checkbox1, checkbox2, checkbox3, checkbox4, keys, currentDropdown, id}: Querystr) {
  const firstBox = checkbox1 ? `${keys[0]}` : "";
  const secondBox = checkbox2 ? `${keys[1]}` : "";
  const thirdBox = checkbox3 ? `${keys[2]}` : "";
  const fourthBox = checkbox4 ? `${keys[3]}` : "";
  const idBox = id ? `(_id:${id})` : "";
  const end = !firstBox && !secondBox && !thirdBox && !fourthBox ? null : `}`;

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
