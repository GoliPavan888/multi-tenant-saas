import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function UserDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get(`/tasks?assignedTo=${user.id}`)
      .then(res => setTasks(res.data.data.tasks));
  }, [user.id]);

  return (
    <>
      <Navbar />
      <h2>My Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks assigned</p>
      ) : (
        <ul>
          {tasks.map(t => (
            <li key={t.id}>
              <strong>{t.title}</strong> — {t.status}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
