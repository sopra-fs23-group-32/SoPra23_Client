import React from 'react';
import { IconButton } from '@mui/material';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';



const Table = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Correct/Wrong</th>
          <th>More</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.date}</td>
            <td>{item.correct}/{item.wrong}({(item.correct/item.wrong)*100}%)</td>
            <td> <IconButton title="Get Info on Game" color="primary" ><ArrowDropDownCircleIcon/></IconButton></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;