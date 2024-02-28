// import { expect, test } from 'vitest';
// import QueryResult from '../../../client/components/Demo_Components/QueryResult';
// import { render, screen } from '@testing-library/react';

// test('QueryResult renders correctly with selected ID', async () => {
//   // Mock data and props
//   const data = {
//     res: '{"data":{"people":{"name":"Luke Skywalker","mass":"77","hair_color":"blond","eye_color":"blue"}}}',
//   };
//   const keys = ['name', 'mass', 'hair_color', 'eye_color'];
//   const currentDropdown = 'people';
//   const checkbox1 = true;
//   const checkbox2 = true;
//   const checkbox3 = true;
//   const checkbox4 = true;
//   const id = '1';
//   const dataField = 'people';

//   // Render the QueryResult component with props
//   const { getByText } = render(
//     <QueryResult
//       data={data}
//       keys={keys}
//       currentDropdown={currentDropdown}
//       checkbox1={checkbox1}
//       checkbox2={checkbox2}
//       checkbox3={checkbox3}
//       checkbox4={checkbox4}
//       id={id}
//       dataField={dataField}
//     />
//   );
  
//   // expected output
//   expect(getByText('query {')).toBeInTheDocument();
//   expect(getByText('people (_id:1) {')).toBeInTheDocument();
//   expect(getByText('name: Luke Skywalker,')).toBeInTheDocument();
//   expect(getByText('mass: 77,')).toBeInTheDocument();
//   expect(getByText('hair_color: blond,')).toBeInTheDocument();
//   // expect(getByText('eye_color: blue,')).toBeInTheDocument();
//   // expect(getByText('}')).toBeInTheDocument();
// });

// test('QueryResult renders correctly without selected ID', async () => {
//   // Mock data and props
//   const data: any = {
//     res: {
//       data: {
//         peopleNoId: {
//           name: ["Luke Skywalker", "C-3PO", "R2-D2"]
//         }
//       }
//     }
//   }
//   const stringData = JSON.stringify(data.res)
//   data.res = stringData

//   const keys = ['name', 'mass', 'hair_color', 'eye_color'];
//   const currentDropdown = 'people';
//   const checkbox1 = true;
//   const checkbox2 = false;
//   const checkbox3 = false;
//   const checkbox4 = false;
//   const dataField = 'peopleNoId';

//   // Render the QueryResult component with props
//   const { getByText } = render(
//     <QueryResult
//       data={data}
//       keys={keys}
//       currentDropdown={currentDropdown}
//       checkbox1={checkbox1}
//       checkbox2={checkbox2}
//       checkbox3={checkbox3}
//       checkbox4={checkbox4}
//       dataField={dataField}
//     />
//   );

//   // Assert the expected output
//   expect(getByText('query {')).toBeInTheDocument();
//   expect(getByText('people {')).toBeInTheDocument();
//   expect(getByText('names:')).toBeInTheDocument();
//   expect(getByText('Luke Skywalker')).toBeInTheDocument();
//   expect(getByText('C-3PO')).toBeInTheDocument();
// });