import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]); // ✅ FIX
  const [title, setTitle] = useState("");

  const loadTasks = () => {
    api.get(`/projects/${projectId}/tasks`)
      .then(res => {
        setTasks(res.data?.data?.tasks || []); // ✅ FIX
      })
      .catch(() => setTasks([]));
  };

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const createTask = async () => {
    await api.post(`/projects/${projectId}/tasks`, { title });
    setTitle("");
    loadTasks();
  };

  return (
    <>
      <Navbar />
      <h2>Project Tasks</h2>

      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button onClick={createTask}>Add Task</button>

      {tasks.length === 0 && <p>No tasks found</p>}

      <ul>
        {tasks.map(t => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </>
  );
}
