import { useEffect, useState } from "react";
import api from "../services/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await api.get("/projects");
        console.log("Projects API response:", res.data);

        // ✅ BACKEND RETURNS ARRAY IN data
        setProjects(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Failed to load projects", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) return <p>Loading projects...</p>;
  if (projects.length === 0) return <p>No projects found</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Projects</h2>

      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.status}</td>
              <td>{new Date(p.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
