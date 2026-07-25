package sofiadesarrollos.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sofiadesarrollos.data.ProjectEntity;
import sofiadesarrollos.data.ProjectRepository;
import sofiadesarrollos.dto.ProjectDto;
import sofiadesarrollos.dto.ProjectMapper;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository repository;

    public ProjectServiceImpl(ProjectRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<ProjectDto> findAll() {
        return repository.findAll()
                .stream()
                .map(ProjectMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ProjectDto> findById(String id) {
        return repository.findById(id).map(ProjectMapper::toDto);
    }

    @Override
    public ProjectDto save(ProjectDto project) {
        ProjectEntity entity = ProjectMapper.toEntity(project);
        LocalDateTime now = LocalDateTime.now();
        String currentUser = getCurrentUser();

        if (entity.getId() == null) {
            entity.setCreatedAt(now);
            entity.setCreatedBy(currentUser);
        }

        entity.setUpdatedAt(now);
        ProjectEntity saved = repository.save(entity);
        return ProjectMapper.toDto(saved);
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    private String getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return "system";
    }
}

