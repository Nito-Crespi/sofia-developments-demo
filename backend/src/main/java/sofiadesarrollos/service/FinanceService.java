package sofiadesarrollos.service;

import java.time.LocalDate;
import java.util.List;

import sofiadesarrollos.dto.CategorySummaryDto;
import sofiadesarrollos.dto.DashboardSummaryDto;
import sofiadesarrollos.dto.FinancialTransactionDto;
import sofiadesarrollos.dto.ProjectsFinanceSummaryDto;
import sofiadesarrollos.dto.TimeSeriesPointDto;

public interface FinanceService {

    DashboardSummaryDto getSummary();

    List<FinancialTransactionDto> findAllTransactions(
            String type,
            String category,
            String project,
            LocalDate from,
            LocalDate to);

    FinancialTransactionDto findTransactionById(String id);

    FinancialTransactionDto saveTransaction(FinancialTransactionDto dto);

    void deleteTransactionById(String id);

    List<CategorySummaryDto> getCategorySummary();

    List<ProjectsFinanceSummaryDto> getProjectSummary();

    List<TimeSeriesPointDto> getEvolution(LocalDate from, LocalDate to);

}