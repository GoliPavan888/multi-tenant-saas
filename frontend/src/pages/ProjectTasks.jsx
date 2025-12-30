import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function ProjectTasks() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const loadTasks = async () => {
    const res = await api.get(`/tasks/project/${projectId}`);
    setTasks(res.data.data);
  };

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const createTask = async () => {
    if (!title) return;
    await api.post("/tasks", { title, projectId });
    setTitle("");
    loadTasks();
  };

  const markDone = async (taskId) => {
    await api.patch(`/tasks/${taskId}`, { status: "done" });
    loadTasks();
  };

  return (
    <div>
      <h2>Tasks</h2>

      <input
        placeholder="New task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={createTask}>Add Task</button>

      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.title} — <b>{t.status}</b>
            {t.status !== "done" && (
              <button onClick={() => markDone(t.id)}>Done</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
