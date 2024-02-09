// import { CopyBlock, dracula } from 'react-code-blocks'
type Querystr = {
  checkbox1:boolean;
  checkbox2:boolean;
  keys:string[];
  currentDropdown: string
  id: string
}

export default function QueryCode({checkbox1, checkbox2, keys, currentDropdown, id}: Querystr) {
  const firstBox = checkbox1 ? `${keys[0]}` : "";
  const secondBox = checkbox2 ? `${keys[1]}` : "";
  const end = !firstBox && !secondBox ? null : `}`;

  return (
    <div className="query-text">
      <div id="query-tag">{`query {`}</div>
      <div className="first-indent">{`${currentDropdown} (_id: ${id}) ${
        !firstBox && !secondBox ? "" : "{"
      }`}</div>
      <div className="second-indent">{firstBox ? `${firstBox},` : null}</div>
      <div className="second-indent">{secondBox ? `${secondBox},` : null}</div>
      <div className="first-indent">{end}</div>
      <div>{"}"}</div>
    </div>
  );
}
