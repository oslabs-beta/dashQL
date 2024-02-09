type boxValue = {
  str: string
}

export default function Dropdown({str}: boxValue) {
  return (
    <div>
      <select>
        <option value={"people"}>People</option>
        <option value={"planets"}>Planets</option>
      </select>
    </div>
  );
}