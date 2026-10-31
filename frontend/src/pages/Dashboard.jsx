
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [filter, setFilter] = useState("All");
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editStatus, setEditStatus] = useState("Pending");
    const [editDueDate, setEditDueDate] = useState("");

    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }

        fetchTasks();
    }, [filter]);

    const fetchTasks = async () => {
        try {
            const url = filter === "All"
                ? "/tasks"
                : `/tasks?status=${encodeURIComponent(filter)}`;

            const response = await API.get(url, config);
            setTasks(response.data.tasks);
            setError("");
        } catch (error) {
            setError("Unable to fetch tasks. Please try again.");
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();

        try {
            await API.post(
                "/tasks",
                {
                    title,
                    description,
                    dueDate: dueDate || null
                },
                config
            );

            setTitle("");
            setDescription("");
            setDueDate("");

            fetchTasks();
        } catch (error) {
            setError(error.response?.data?.message || "Unable to add task.");
        }
    };

    const handleEdit = (task) => {
        setEditingId(task._id);
        setEditTitle(task.title);
        setEditDescription(task.description || "");
        setEditStatus(task.status);
        setEditDueDate(
            task.dueDate ? task.dueDate.substring(0, 10) : ""
        );
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();

        try {
            await API.put(
                `/tasks/${editingId}`,
                {
                    title: editTitle,
                    description: editDescription,
                    status: editStatus,
                    dueDate: editDueDate || null
                },
                config
            );

            setEditingId(null);
            fetchTasks();
        } catch (error) {
            setError(error.response?.data?.message || "Unable to update task.");
        }
    };

    const handleDeleteTask = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this task?");

        if (!confirmed) return;

        try {
            await API.delete(`/tasks/${id}`, config);
            fetchTasks();
        } catch (error) {
            setError("Unable to delete task.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div>
            <h1>Task Manager Dashboard</h1>

            <p>Welcome, {user.name || "User"}!</p>

            <button onClick={handleLogout}>Logout</button>

            <hr />

            <h2>Add New Task</h2>

            <form onSubmit={handleAddTask}>
                <input
                    type="text"
                    placeholder="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <br /><br />

                <textarea
                    placeholder="Task description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <br /><br />

                <label>Due Date: </label>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />

                <br /><br />

                <button type="submit">Add Task</button>
            </form>

            <hr />

            <h2>My Tasks</h2>

            <label>Filter by Status: </label>

            <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            >
                <option value="All">All Tasks</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </select>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {tasks.length === 0 ? (
                <p>No tasks found.</p>
            ) : (
                tasks.map((task) => (
                    <div key={task._id}>
                        <hr />

                        {editingId === task._id ? (
                            <form onSubmit={handleUpdateTask}>
                                <input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    required
                                />

                                <br /><br />

                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                />

                                <br /><br />

                                <select
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>

                                <br /><br />

                                <input
                                    type="date"
                                    value={editDueDate}
                                    onChange={(e) => setEditDueDate(e.target.value)}
                                />

                                <br /><br />

                                <button type="submit">Save Changes</button>
                                <button
                                    type="button"
                                    onClick={() => setEditingId(null)}
                                >
                                    Cancel
                                </button>
                            </form>
                        ) : (
                            <>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <p>Status: {task.status}</p>
                                <p>
                                    Due Date: {task.dueDate
                                        ? task.dueDate.substring(0, 10)
                                        : "Not set"}
                                </p>

                                <button onClick={() => handleEdit(task)}>
                                    Edit
                                </button>

                                <button onClick={() => handleDeleteTask(task._id)}>
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default Dashboard;
