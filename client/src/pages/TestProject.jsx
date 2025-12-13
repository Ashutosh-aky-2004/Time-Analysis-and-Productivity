import { useProjectDetails } from "../hooks/projects/useProjectDetails";

const TestProject = () => {
  const projectId = "6932e805dc619e785e769bf2";

  const { project, members, loading } = useProjectDetails(projectId);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Project</h2>
      <pre>{JSON.stringify(project, null, 2)}</pre>

      <h2>Members</h2>
      <pre>{JSON.stringify(members, null, 2)}</pre>
    </div>
  );
};

export default TestProject;
