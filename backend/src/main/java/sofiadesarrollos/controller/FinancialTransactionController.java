package sofiadesarrollos.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import sofiadesarrollos.dto.FinancialTransactionDto;
import sofiadesarrollos.service.FinanceService;

@RestController
@RequestMapping("/transactions")
public class FinancialTransactionController {

    private final FinanceService finService;

    public FinancialTransactionController(FinanceService finService) {
        this.finService = finService;
    }

    @GetMapping
    public ResponseEntity<List<FinancialTransactionDto>> findAll(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String project,
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to) {

        return ResponseEntity.ok(
                finService.findAllTransactions(type, category, project, from, to));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FinancialTransactionDto> findById(
            @PathVariable String id) {

        return ResponseEntity.ok(finService.findTransactionById(id));
    }

    @PostMapping
    public ResponseEntity<FinancialTransactionDto> create(
            @RequestBody FinancialTransactionDto dto) {

        return ResponseEntity.ok(finService.saveTransaction(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FinancialTransactionDto> update(
            @PathVariable String id,
            @RequestBody FinancialTransactionDto dto) {

        dto.setId(id);
        return ResponseEntity.ok(finService.saveTransaction(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id) {

        finService.deleteTransactionById(id);
        return ResponseEntity.noContent().build();
    }
}