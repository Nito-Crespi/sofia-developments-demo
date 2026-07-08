import { Button, Segmented, Space, Typography } from "antd";
import {
  PlusOutlined,
  TableOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useMemo, useState } from "react";
import { useAuthStore } from "../auth/store/authStore";
import { useProjectsStore } from "../project/store/projectsStore";
import type { Project, ProjectFormData } from "../project/dto/project.dto";
import ProjectsKanbanBoard from "./ProjectsKanbanBoard";
import ProjectsTable from "../project/components/ProjectsTable";
import ProjectDrawer from "../project/components/ProjectDrawer";
import ProjectDetailDrawer from "../project/components/ProjectDetailDrawer";

const { Title } = Typography;

type ViewMode = "board" | "table";

export default function ProjectsKanbanPage() {
  const session = useAuthStore((s) => s.session);
  const projects = useProjectsStore((s) => s.getAll());
  const createProject = useProjectsStore((s) => s.create);
  const updateProject = useProjectsStore((s) => s.update);
  const deleteProject = useProjectsStore((s) => s.delete);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("board");

  const headerTitle = useMemo(() => {
    return viewMode === "board"
      ? "Gestión de Proyectos (Tablero)"
      : "Gestión de Proyectos";
  }, [viewMode]);

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
      return;
    }

    createProject({
      ...data,
      createdBy: session?.user.username || "unknown",
    });
  };

  const handleMove = (projectId: string, nextStatus: Project["status"]) => {
    const project = useProjectsStore.getState().getById(projectId);
    if (!project) return;
    if (project.status === nextStatus) return;
    updateProject(projectId, { status: nextStatus });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          {headerTitle}
        </Title>

        <Space wrap>
          <Segmented<ViewMode>
            value={viewMode}
            onChange={(v) => setViewMode(v)}
            options={[
              { label: "Tablero", value: "board", icon: <AppstoreOutlined /> },
              { label: "Tabla", value: "table", icon: <TableOutlined /> },
            ]}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            size="large"
          >
            Nuevo Proyecto
          </Button>
        </Space>
      </Space>

      {viewMode === "board" ? (
        <ProjectsKanbanBoard
          projects={projects}
          onMove={handleMove}
          onEdit={handleEdit}
          onDelete={deleteProject}
          onView={handleView}
        />
      ) : (
        <ProjectsTable
          projects={projects}
          onEdit={handleEdit}
          onDelete={deleteProject}
          onView={handleView}
        />
      )}

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
          if (selectedProject) handleEdit(selectedProject);
        }}
      />
    </Space>
  );
}
