import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosApiInstance from "../../interceptors/axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import AddIcon from "@mui/icons-material/Add"; // Import Add Icon
import CreateToDoListModal from "./CreateToDoListModal";
import EditToDoListDialog from "./EditToDoListDialog";

function ToDoListIndex() {
  const [toDoLists, setToDoLists] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedToDoListId, setSelectedToDoListId] = useState(null);
  //const [taskModalOpen, setTaskModalOpen] = useState(false); // State for task modal
  const navigate = useNavigate();

  useEffect(() => {
    fetchToDoLists();
  }, []);

  const fetchToDoLists = async () => {
    try {
      const { data } = await axiosApiInstance.get("/api/ToDoList/all");
      setToDoLists(data);
    } catch (error) {
      console.error("Failed to fetch ToDo Lists", error);
    }
  };

  const handleEdit = (id) => {
    setSelectedToDoListId(id);
    setEditModalOpen(true);
    //navigate(`/ToDoList/toDoListById/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axiosApiInstance.delete(`/api/ToDoList/delete/${id}`);
      fetchToDoLists();
    } catch (error) {
      console.error("Failed to delete ToDo List", error);
    }
  };

  const handleViewTasks = (id) => {
    navigate(`/ToDoList/${id}/tasks`);
  };

  const handleCreateModalOpen = () => {
    setCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
    fetchToDoLists();
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedToDoListId(null);
    fetchToDoLists();
  };

  return (
    <div >
      <div style={{ paddingTop: '5px', paddingBottom: '5px' }}>
      <Button  variant="contained" color="primary" onClick={handleCreateModalOpen}>
        Create To-Do List
      </Button>
      </div>
      <CreateToDoListModal open={createModalOpen} handleClose={handleCreateModalClose} />
      <EditToDoListDialog open={editModalOpen} handleClose={handleEditModalClose} toDoListId={selectedToDoListId} />
    
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Task Count</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {toDoLists.map((toDoList) => (
              <TableRow key={toDoList.id}>
                <TableCell>{toDoList.name}</TableCell>
                <TableCell>{toDoList.tasks ? toDoList.tasks.count : 0}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(toDoList.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(toDoList.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleViewTasks(toDoList.id)}>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ToDoListIndex;
