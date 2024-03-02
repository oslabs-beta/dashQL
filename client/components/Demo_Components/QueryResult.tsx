type Querystr = {
  data: any;
  keys: string[];
  currentDropdown: string;
  checkboxes: boolean[];
  nestedCheckboxes: boolean[];
  id?: string | undefined;
  dataField: string;
};

export default function QueryResult({
  data,
  keys,
  currentDropdown,
  checkboxes,
  nestedCheckboxes,
  id,
  dataField,
}: Querystr) {
  const res = JSON.parse(data.res);

  // define what which properties will be displayed (ex: name, mass). These are used for being able to create the query code format to display
  const firstBox: string | null = checkboxes[0] ? `${keys[0]}` : null;
  const secondBox: string | null = checkboxes[1] ? `${keys[1]}` : null;
  const thirdBox: string | null = checkboxes[2] ? `${keys[2]}` : null;
  const fourthBox: string | null = checkboxes[3] ? `${keys[3]}` : null;
  const idBox: string = id ? `(_id:${id})` : "";
  const end: null | string =
    !firstBox && !secondBox && !thirdBox && !fourthBox ? null : `}`;

  // define values to be displayed for each property

  const firstValue = res.data[dataField][keys[0]];
  const secondValue: string = res.data[dataField][keys[1]];
  const thirdValue: string = res.data[dataField][keys[2]];
  const fourthValue: string = res.data[dataField][keys[3]];

  const boxes = [firstBox, secondBox, thirdBox, fourthBox];
  const values = [firstValue, secondValue, thirdValue, fourthValue];

  const divBoxes = [];
  if (id) {
    for (let i = 0; i < 4; i++) {
      if (i === 3 && currentDropdown == "people") {
        divBoxes.push(
          <div className="second-indent">
            {values[i] ? `${boxes[i]} {` : null}
          </div>
        );
      } else {
        divBoxes.push(
          <div className="second-indent">
            {values[i] ? `${boxes[i]}: ${values[i]},` : null}
          </div>
        );
      }
    }
  } else {
    for (let i = 0; i < 4; i++) {
      if (values[i]) {
        const jsonValues: string = values[i];
        divBoxes.push(<div className="second-indent">{`${boxes[i]}s:`}</div>);
        for (let j = 0; j < 10; j++) {
          divBoxes.push(<div className="second-indent">{jsonValues[j]}</div>);
        }
      }
    }
  }

  const nestedDivBoxes = [];
  if (checkboxes[3]) {
    nestedCheckboxes[0]
      ? nestedDivBoxes.push(
          <div className="third-indent">{`name: ${
            res.data[dataField][keys[3]]["name"]
          },`}</div>
        )
      : null;
    nestedCheckboxes[1]
      ? nestedDivBoxes.push(
          <div className="third-indent">{`classification: ${
            res.data[dataField][keys[3]]["classification"]
          },`}</div>
        )
      : null;
  }

  const nestedEnd: string =
    checkboxes[3] && currentDropdown === "people" ? "}" : "";

  return (
    <div className="query-text">
      <div id="query-tag">{`query {`}</div>
      <div className="first-indent">{`${currentDropdown} ${idBox} {`}</div>
      {divBoxes}
      {nestedDivBoxes}
      <div className="second-indent">{nestedEnd}</div>
      <div className="first-indent">{end}</div>
      <div id="query-tag">{"}"}</div>
    </div>
  );
}
