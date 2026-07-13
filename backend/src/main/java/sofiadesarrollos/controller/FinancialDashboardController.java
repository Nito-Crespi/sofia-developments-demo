package sofiadesarrollos.controller;

import lombok.RequiredArgsConstructor;
import sofiadesarrollos.dto.CategorySummaryDto;
import sofiadesarrollos.dto.DashboardSummaryDto;
import sofiadesarrollos.dto.ProjectsFinanceSummaryDto;
import sofiadesarrollos.dto.TimeSeriesPointDto;
import sofiadesarrollos.service.FinanceService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

//READ-ONLY aggregation API

@RestController
@RequestMapping("/dashboard")
public class FinancialDashboardController {

    private final FinanceService finService;

    public FinancialDashboardController(FinanceService finService) {
        this.finService = finService;
    }


    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDto> summary() {
        return ResponseEntity.ok(finService.getSummary());
    }

    @GetMapping("/evolution")
    public ResponseEntity<List<TimeSeriesPointDto>> evolution(
            @RequestParam LocalDate from,
            @RequestParam LocalDate to) {

        return ResponseEntity.ok(
                finService.getEvolution(from, to));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategorySummaryDto>> categories() {
        return ResponseEntity.ok(
                finService.getCategorySummary());
    }

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectsFinanceSummaryDto>> projects() {
        return ResponseEntity.ok(
                finService.getProjectSummary());
    }
}