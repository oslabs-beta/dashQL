type Querystr = {
  data: any
  keys:string[];
  currentDropdown: string
  checkbox1:boolean
  checkbox2: boolean
  checkbox3:boolean;
  checkbox4:boolean
  id: string
}


export default function QueryResult({data, keys, currentDropdown, checkbox1, checkbox2, checkbox3, checkbox4, id}: Querystr) {
  const res = JSON.parse(data.res)
  console.log('IN QUERY RESULT-----','data is', res, 'response time is', data.time)

  let firstValue;
  let secondValue;
  let thirdValue;
  let fourthValue

  const firstBox = checkbox1 ? `${keys[0]}` : "";
  const secondBox = checkbox2 ? `${keys[1]}` : "";
  const thirdBox = checkbox3 ? `${keys[2]}` : "";
  const fourthBox = checkbox4 ? `${keys[3]}` : "";
  const idBox = id ? `(_id:${id})` : "";
  const end = !firstBox && !secondBox && !thirdBox && !fourthBox ? null : `}`;
  
  if (res){
    firstValue = res.data.people[keys[0]]
    secondValue = res.data.people[keys[1]]
    thirdValue =res.data.people[keys[2]]
    fourthValue = res.data.people[keys[3]]
  } 

  return (
    <div className="query-text">
      <div id="query-tag">{`query {`}</div>
      <div className="first-indent">{`${currentDropdown} ${idBox} {`}</div>
      <div className="second-indent">{firstValue ? `${firstBox}: ${firstValue},` : null}</div>
      <div className="second-indent">{secondValue ? `${secondBox}: ${secondValue},` : null}</div>
      <div className="second-indent">{thirdValue ? `${thirdBox}: ${thirdValue},` : null}</div>
      <div className="second-indent">{fourthValue ? `${fourthBox}: ${fourthValue},` : null}</div>
      <div className="first-indent">{end}</div>
      <div>{"}"}</div>
    </div>
  );
}