import { useParams } from "react-router-dom";

export default function ProjectDetails() {
  const { id } = useParams();
  return <h2>Project Details: {id}</h2>;
}
