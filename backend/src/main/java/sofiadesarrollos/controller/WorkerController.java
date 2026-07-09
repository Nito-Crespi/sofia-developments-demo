package sofiadesarrollos.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import sofiadesarrollos.dto.WorkerAttendanceDto;
import sofiadesarrollos.dto.WorkerDto;
import sofiadesarrollos.service.AttendanceImportService;
import sofiadesarrollos.service.WorkerService;

@RestController
@RequestMapping("/workers")
@RequiredArgsConstructor
public class WorkerController {

    private final WorkerService workerService;
    private final AttendanceImportService attendanceImportService;

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

    @PostMapping(value = "/attendance/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> importAttendance(
            @RequestParam("file") MultipartFile file) {

        attendanceImportService.importExcel(file);

        return ResponseEntity.ok().build();
    }
}