type Querystr = {
  data: any
  keys:string[];
  currentDropdown: string
  checkbox1:boolean
  checkbox2: boolean
  id: string
}


export default function QueryResult({data, keys, currentDropdown, checkbox1, checkbox2, id}: Querystr) {
  // const useData = data.data.people
  console.log(' IN QUERY RESULT', data, keys, currentDropdown, checkbox1, checkbox2)
  let firstValue;
  let secondValue;

  const firstBox = checkbox1 ? `${keys[0]}` : "";
  const secondBox = checkbox2 ? `${keys[1]}` : "";
  const idBox = id ? `(_id:${id})` : "";
  const end = !firstBox && !secondBox ? null : `}`;

  if (data){
    firstValue = data.data.people[keys[0]]
    secondValue = data.data.people ? data.data.people[keys[1]] : data
  } 

  return (
    <div className="query-text">
      <div id="query-tag">{`query {`}</div>
      <div className="first-indent">{`${currentDropdown} ${idBox} {`}</div>
      <div className="second-indent">{firstValue && checkbox1 ? `${firstBox}: ${firstValue},` : null}</div>
      <div className="second-indent">{secondValue && checkbox2 ? `${secondBox}: ${secondValue},` : null}</div>
      <div className="first-indent">{end}</div>
      <div>{"}"}</div>
    </div>
  );
}