package sofiadesarrollos.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sofiadesarrollos.dto.WorkerAttendanceDto;
import sofiadesarrollos.dto.WorkerDto;
import sofiadesarrollos.service.WorkerService;

@RestController
@RequestMapping("/workers")
@RequiredArgsConstructor
public class WorkerController {

    private final WorkerService workerService;

    @GetMapping
    public List<WorkerDto> findAll() {
        return workerService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkerDto> findById(@PathVariable String id) {
        return workerService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public WorkerDto save(@RequestBody WorkerDto worker) {
        return workerService.save(worker);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        workerService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/weekly-wage")
    public Double calculateWeeklyWage(
            @RequestParam String workerId,
            @RequestParam LocalDate mondayDate) {

        return workerService.calculateWeeklyWage(workerId, mondayDate);
    }

    @PostMapping("/attendance")
    public WorkerAttendanceDto registerAttendance(
            @RequestBody WorkerAttendanceDto attendance) {
        return workerService.save(attendance);
    }
}