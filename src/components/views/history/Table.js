import React from "react";
import { IconButton } from "@mui/material";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: '#2196f3',
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Table = ({ data }) => {
  const [open, setOpen] = React.useState(false);
  const [id, setID] = React.useState("");
  const handleOpen = (id) => {
    setID(id);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

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
            <td>
              {item.correct}/{item.wrong}({(item.correct / item.wrong) * 100}%)
            </td>
            <td>
              {" "}
              <IconButton
                title={item.id}
                color="primary"
                onClick={() => handleOpen(item.id)}
              >
                <ArrowDropDownCircleIcon />
              </IconButton>
            </td>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box color="primary" sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  {id}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  This is where the the game info will go
                </Typography>
              </Box>
            </Modal>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
