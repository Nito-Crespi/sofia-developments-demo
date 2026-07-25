package sofiadesarrollos.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sofiadesarrollos.data.Workday;
import sofiadesarrollos.data.WorkdayRepository;
import sofiadesarrollos.data.Worker;
import sofiadesarrollos.data.WorkerAttendance;
import sofiadesarrollos.data.WorkerAttendanceRepository;
import sofiadesarrollos.data.WorkerRepository;
import sofiadesarrollos.dto.WorkerAttendanceDto;
import sofiadesarrollos.dto.WorkerDto;
import sofiadesarrollos.dto.WorkerMapper;

@Service
@Transactional
public class WorkerServiceImpl implements WorkerService {

    private final Double DAILY_MEAL_COST = 1500D;

    private final WorkerRepository repository;
    private final WorkdayRepository dayRepository;
    private final WorkerAttendanceRepository attendanceRepository;

    public WorkerServiceImpl(WorkerRepository repository,
         WorkerAttendanceRepository attendanceRepository,
        WorkdayRepository dayRepository) {
        this.repository = repository;
        this.attendanceRepository = attendanceRepository;
        this.dayRepository = dayRepository;
    }

    @Override
    public List<WorkerDto> findAll() {
        return repository.findAll()
                .stream()
                .map(WorkerMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<WorkerDto> findById(String id) {
        return repository.findById(id).map(WorkerMapper::toDto);
    }

    @Override
    public WorkerDto save(WorkerDto worker) {
        Worker entity = WorkerMapper.toEntity(worker);
        Worker saved = repository.save(entity);
        return WorkerMapper.toDto(saved);
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    @Override
    public Double calculateWeeklyWage(String workerId, LocalDate monday) {

        //Attendances of this worker for the week
        List<WorkerAttendance> attendances = attendanceRepository.findByWorkerIdAndWorkdayDateGreaterThanEqualAndWorkdayDateLessThan(
            workerId,
            monday,
            monday.plusDays(7)
        );

        //WORKED HOURS
        double totalHours = attendances.stream()
                .map(att -> att.computeWorkedHours().toMinutes() / 60.0)
                .mapToDouble(Double::doubleValue).sum();

        //MEAL DEDUCTION
        double mealDeduction = attendances.stream()
                .filter(WorkerAttendance::getMealConsumed)
                .count() * DAILY_MEAL_COST;

        //Get worker to fetch hourly rate
        Worker worker = repository.findById(workerId).orElseThrow(() -> 
                new IllegalArgumentException("Worker not found: " + workerId));

        return totalHours * worker.getHourlyRate() - mealDeduction;

    }

    @Override
    public WorkerAttendanceDto save(WorkerAttendanceDto attendance) {

        String workerId = attendance.getWorkerId();
        LocalDate date = attendance.getDate();

        if (workerId == null || date == null) {
            throw new IllegalArgumentException("Worker id and date are required");
        }

        Worker worker = repository.findById(workerId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Worker not found: " + workerId));

        Workday workday = getOrCreate(date);

        attendanceRepository.findByWorkerAndWorkday(worker, workday)
                .ifPresent(a -> {
                    throw new IllegalStateException(
                            "Attendance already exists for worker "
                                    + workerId + " on " + date);
                });

        WorkerAttendance entity = WorkerAttendance.fulldayAttendance(worker, workday,attendance);

        WorkerAttendance saved = attendanceRepository.save(entity);
        return new WorkerAttendanceDto(); // TODO mapper
    }

    private Workday getOrCreate(LocalDate date) {
    return dayRepository.findByDate(date)
            .orElseGet(() -> {
                Workday day = Workday.builder().date(date).build();
                return dayRepository.save(day);
            });

    }

}
