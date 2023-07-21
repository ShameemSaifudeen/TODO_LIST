import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./App.css";

import Swal from "sweetalert2"; // Import SweetAlert2 library

const API_URL = "http://localhost:4000/api/todos"; // Replace with your backend URL

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    try {
      if (newTodo.trim() === "") return;

      // Check if the task already exists
      if (todos.some((todo) => todo.task === newTodo.trim())) {
        Swal.fire({
          icon: "warning",
          title: "Task Already Exists!",
          text: "Please add a new task.",
          confirmButtonText: "OK",
        });
        return;
      }

      const response = await axios.post(API_URL, { task: newTodo.trim(), completed: false });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      // Show SweetAlert confirmation before deleting
      const result = await Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: "You will not be able to recover this task!",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#f44336",
        cancelButtonColor: "#bdbdbd",
      });

      if (result.isConfirmed) {
        await axios.delete(`${API_URL}/${id}`);
        const updatedTodos = todos.filter((todo) => todo._id !== id);
        setTodos(updatedTodos);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleTodoCompletion = async (id) => {
    try {
      const todoToUpdate = todos.find((todo) => todo._id === id);
      if (!todoToUpdate) return;

      const updatedTodo = await axios.put(`${API_URL}/${id}`, {
        completed: !todoToUpdate.completed,
      });

      setTodos((prevTodos) => {
        const updatedTodos = prevTodos.map((todo) =>
          todo._id === id ? updatedTodo.data : todo
        );
        return updatedTodos;
      });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <Container maxWidth="sm" className="app-container">
      <Box className="app" sx={{ padding: "20px", backgroundColor: "#fff", borderRadius: 10, boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }}>
        <Typography variant="h4" align="center" gutterBottom>
          To-Do List
        </Typography>
        <Box sx={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <TextField
            variant="outlined"
            size="small"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            sx={{ flex: 1 }}
          />
          <Button variant="contained" color="primary" size="large" onClick={addTodo}>
            Add
          </Button>
        </Box>
        <List>
          {todos.map((todo) => (
            <ListItem key={todo._id} button onClick={() => toggleTodoCompletion(todo._id)} sx={{ backgroundColor: "#f5f5f5", borderRadius: 5, marginBottom: "10px", cursor: "pointer" }}>
              <ListItemText
                primary={todo.task}
                primaryTypographyProps={{
                  sx: {
                    textDecoration: todo.completed ? "line-through" : "none",
                    color: todo.completed ? "red" : "initial",
                    opacity: todo.completed ? 0.7 : 1,
                  },
                }}
              />
              <ListItemSecondaryAction>
                <Checkbox
                  edge="end"
                  onChange={() => toggleTodoCompletion(todo._id)}
                  checked={todo.completed}
                />
                <Button
                  edge="end"
                  color="error"
                  onClick={() => deleteTodo(todo._id)}
                  // sx={{ visibility: todo.completed ? "visible" : "hidden" }}
                >
                  <DeleteIcon />
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default App;
