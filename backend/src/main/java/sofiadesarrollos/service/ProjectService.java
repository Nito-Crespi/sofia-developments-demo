package sofiadesarrollos.service;

import java.util.List;
import java.util.Optional;
import sofiadesarrollos.dto.ProjectDto;

public interface ProjectService {

    List<ProjectDto> findAll();

    Optional<ProjectDto> findById(String id);

    ProjectDto save(ProjectDto project);

    void deleteById(String id);
}
