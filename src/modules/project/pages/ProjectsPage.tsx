import { Button, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { Project, ProjectFormData } from "../dto/project.dto";
import { useProjectsStore } from "../store/projectsStore";
import ProjectDetailDrawer from "../components/ProjectDetailDrawer";
import ProjectDrawer from "../components/ProjectDrawer";
import ProjectsTable from "../components/ProjectsTable";
import { useAuthStore } from "../../auth/store/authStore";

const { Title } = Typography;

export default function ProjectsPage() {
  const session = useAuthStore((s) => s.session);
  const projects = useProjectsStore((s) => s.getAll());
  const createProject = useProjectsStore((s) => s.create);
  const updateProject = useProjectsStore((s) => s.update);
  const deleteProject = useProjectsStore((s) => s.delete);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleCreate = () => {
    setSelectedProject(null);
    setDrawerOpen(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setDrawerOpen(true);
  };

  const handleView = (project: Project) => {
    setSelectedProject(project);
    setDetailDrawerOpen(true);
  };

  const handleSave = (data: ProjectFormData) => {
    if (selectedProject) {
      updateProject(selectedProject.id, data);
    } else {
      const newData = {
        ...data,
        createdBy: session?.user.username || "unknown",
      };
      createProject(newData);
    }
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Gestión de Proyectos
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          Nuevo Proyecto
        </Button>
      </Space>

      <ProjectsTable
        projects={projects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      <ProjectDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedProject(null);
        }}
        onSave={handleSave}
        project={selectedProject}
      />

      <ProjectDetailDrawer
        open={detailDrawerOpen}
        onClose={() => {
          setDetailDrawerOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
        onEdit={() => {
          setDetailDrawerOpen(false);
          if (selectedProject) {
            handleEdit(selectedProject);
          }
        }}
      />
    </Space>
  );
}
