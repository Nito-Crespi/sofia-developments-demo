package sofiadesarrollos.data;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkerAttendanceRepository extends JpaRepository<WorkerAttendance, String> {

    List<WorkerAttendance> findByWorkerIdAndWorkdayDateGreaterThanEqualAndWorkdayDateLessThan(
            String workerId,
            LocalDate startDate,
            LocalDate endDate
    );

    Optional<WorkerAttendance> findByWorkerAndWorkday(Worker worker, Workday workday);

}
