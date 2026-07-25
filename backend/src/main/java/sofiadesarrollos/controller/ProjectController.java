package sofiadesarrollos.controller;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import sofiadesarrollos.dto.ProjectDto;
import sofiadesarrollos.service.ProjectService;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<ProjectDto> getAll() {
        return projectService.findAll();
    }

    @GetMapping("/{id}")
    public ProjectDto getById(@PathVariable String id) {
        return projectService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectDto create(@Valid @RequestBody ProjectDto project) {
        return projectService.save(project);
    }

    @PutMapping("/{id}")
    public ProjectDto update(@PathVariable String id, @Valid @RequestBody ProjectDto project) {
        project.setId(id);
        return projectService.save(project);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        projectService.deleteById(id);
    }
}