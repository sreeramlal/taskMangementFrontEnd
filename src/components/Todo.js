import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; 

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ task: '', status: '', deadline: '', description: '' });
    const [editMode, setEditMode] = useState(null);
    const [editTodo, setEditTodo] = useState({ task: '', status: '', deadline: '', description: '' });

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://localhost:3001/getTodoList');
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const handleChange = (e) => {
        setNewTodo({
            ...newTodo,
            [e.target.name]: e.target.value
        });
    };

    const handleEditChange = (e) => {
        setEditTodo({
            ...editTodo,
            [e.target.name]: e.target.value
        });
    };

    const addTodo = async () => {  // For adding the list
        try {
            const response = await axios.post('http://localhost:3001/addTodoList', newTodo);
            setTodos([...todos, response.data]);
            setNewTodo({ task: '', status: '', deadline: '', description: '' });
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const updateTodo = async (id) => {  // for updating the list
        try {
            const response = await axios.put(`http://localhost:3001/updateTodoList/${id}`, editTodo);
            setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
            setEditMode(null);
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const deleteTodo = async (id) => {  // for deleting the list
        try {
            await axios.delete(`http://localhost:3001/deleteTodoList/${id}`);
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm p-4 mb-5 bg-white rounded">
                        <h2 className="mb-4">Add Task</h2>
                        <div className="mb-3">
                            <input
                                type="text"
                                name="task"
                                value={newTodo.task}
                                onChange={handleChange}
                                placeholder="Task"
                                className="form-control mb-2"
                            />
                            <input
                                type="text"
                                name="status"
                                value={newTodo.status}
                                onChange={handleChange}
                                placeholder="Status"
                                className="form-control mb-2"
                            />
                            <input
                                type="date"
                                name="deadline"
                                value={newTodo.deadline}
                                onChange={handleChange}
                                placeholder="Deadline"
                                className="form-control mb-2"
                            />
                            <input
                                type="text"
                                name="description"
                                value={newTodo.description}
                                onChange={handleChange}
                                placeholder="Description"
                                className="form-control mb-2"
                            />
                            <button onClick={addTodo} className="btn btn-primary w-100">Add Todo</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm p-4 bg-white rounded">
                        <h2 className="mb-4">Task List</h2>
                        <table className="table table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Task</th>
                                    <th>Status</th>
                                    <th>Deadline</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todos.map(todo => (
                                    <tr key={todo._id}>
                                        <td>
                                            {editMode === todo._id ? (
                                                <input
                                                    type="text"
                                                    name="task"
                                                    value={editTodo.task}
                                                    onChange={handleEditChange}
                                                    className="form-control"
                                                />
                                            ) : (
                                                todo.task
                                            )}
                                        </td>
                                        <td>
                                            {editMode === todo._id ? (
                                                <input
                                                    type="text"
                                                    name="status"
                                                    value={editTodo.status}
                                                    onChange={handleEditChange}
                                                    className="form-control"
                                                />
                                            ) : (
                                                todo.status
                                            )}
                                        </td>
                                        <td>
                                            {editMode === todo._id ? (
                                                <input
                                                    type="date"
                                                    name="deadline"
                                                    value={editTodo.deadline}
                                                    onChange={handleEditChange}
                                                    className="form-control"
                                                />
                                            ) : (
                                                todo.deadline ? new Date(todo.deadline).toLocaleDateString() : ''
                                            )}
                                        </td>
                                        <td>
                                            {editMode === todo._id ? (
                                                <input
                                                    type="text"
                                                    name="description"
                                                    value={editTodo.description}
                                                    onChange={handleEditChange}
                                                    className="form-control"
                                                />
                                            ) : (
                                                todo.description
                                            )}
                                        </td>
                                        <td>
                                            {editMode === todo._id ? (
                                                <>
                                                    <button onClick={() => updateTodo(todo._id)} className="btn btn-success mr-2">Save</button>
                                                    <button onClick={() => setEditMode(null)} className="btn btn-secondary">Reset</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => { setEditMode(todo._id); setEditTodo(todo); }} className="btn btn-warning mr-2">Edit</button>
                                                    <button onClick={() => deleteTodo(todo._id)} className="btn btn-danger">Delete</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Todo;
