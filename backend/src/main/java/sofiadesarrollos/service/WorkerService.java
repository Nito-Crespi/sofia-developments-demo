package sofiadesarrollos.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import sofiadesarrollos.dto.WorkerAttendanceDto;
import sofiadesarrollos.dto.WorkerDto;

public interface WorkerService {

    List<WorkerDto> findAll();

    Optional<WorkerDto> findById(String id);

    WorkerDto save(WorkerDto worker);

    void deleteById(String id);

    Double calculateWeeklyWage(String workerId, LocalDate mondayDate);

    // If corresponding day does not exist, it is created as default
    WorkerAttendanceDto save(WorkerAttendanceDto attendance);
}
