type Querystr = {
  data: any;
  keys:string[];
  currentDropdown: string;
  checkbox1?:boolean;
  checkbox2?: boolean;
  checkbox3?:boolean;
  checkbox4?:boolean
  id?: string | undefined
}

export default function QueryResult({data, keys, currentDropdown, checkbox1, checkbox2, checkbox3, checkbox4, id}: Querystr) {
  const res = JSON.parse(data.res)
  // console.log('IN QUERY RESULT-----','data is', data)

  // define what which properties will be displayed (ex: name, mass). These are used for being able to create the query code format to display
  const firstBox:string | null = checkbox1 ? `${keys[0]}` : null;
  const secondBox: string | null = checkbox2 ? `${keys[1]}` : null;
  const thirdBox: string | null = checkbox3 ? `${keys[2]}` : null;
  const fourthBox: string | null = checkbox4 ? `${keys[3]}` : null;
  const idBox: string = id ? `(_id:${id})` : "";
  const end: null | string = !firstBox && !secondBox && !thirdBox && !fourthBox ? null : `}`;

  // define values to be displayed for each property
  const firstValue: string = res.data.people[keys[0]];
  const secondValue: string = res.data.people[keys[1]];
  const thirdValue: string = res.data.people[keys[2]];
  const fourthValue: string = res.data.people[keys[3]];
  

  return (
    <div className="query-text">
      <div id="query-tag">{`query {`}</div>
      <div className="first-indent">{`${currentDropdown} ${idBox} {`}</div>
      <div className="second-indent">{firstBox ? `${firstBox}: ${firstValue},` : null}</div>
      <div className="second-indent">{secondBox ? `${secondBox}: ${secondValue},` : null}</div>
      <div className="second-indent">{thirdBox ? `${thirdBox}: ${thirdValue},` : null}</div>
      <div className="second-indent">{fourthBox ? `${fourthBox}: ${fourthValue},` : null}</div>
      <div className="first-indent">{end}</div>
      <div>{"}"}</div>
    </div>
  );
}