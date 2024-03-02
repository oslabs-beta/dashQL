// import { CopyBlock, dracula } from 'react-code-blocks'
type Querystr = {
  checkboxes: boolean[];
  nestedCheckboxes: boolean[];
  keys: string[];
  currentDropdown: string;
  id: string | undefined;
};

export default function QueryCode({
  checkboxes,
  nestedCheckboxes,
  keys,
  currentDropdown,
  id,
}: Querystr) {
  // define what which properties will be displayed (ex: name, mass). These are used for being able to create the query code format to display
  const firstBox: string | null = checkboxes[0] ? `${keys[0]}` : null;
  const secondBox: string | null = checkboxes[1] ? `${keys[1]}` : null;
  const thirdBox: string | null = checkboxes[2] ? `${keys[2]}` : null;
  let fourthBox: string;
  if (checkboxes[3] && currentDropdown === "people") {
    fourthBox = `${keys[3]} {`;
  } else if (checkboxes[3] && currentDropdown !== "people") {
    fourthBox = `${keys[3]}`;
  } else {
    fourthBox = "";
  }

  const firstNestedBox: string =
    nestedCheckboxes[0] && checkboxes[3] ? `${keys[4]}` : "";
  const secondNestedBox: string =
    nestedCheckboxes[1] && checkboxes[3] ? `${keys[5]}` : "";

  const idBox: string = id ? `(_id:${id})` : "";
  const end: null | string =
    !firstBox && !secondBox && !thirdBox && !fourthBox ? null : `}`;

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
      <div className="third-indent">
        {secondNestedBox ? `${secondNestedBox}` : null}
      </div>
      <div className="second-indent">
        {firstNestedBox || secondNestedBox ? `}` : null}
      </div>
      <div className="first-indent">{end}</div>
      <div id="query-tag">{"}"}</div>
    </div>
  );
}
