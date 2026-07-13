package sofiadesarrollos.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Arrays;
import java.util.List;
import java.util.TreeMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import sofiadesarrollos.data.FinancialTransaction;
import sofiadesarrollos.data.FinancialTransactionRepository;
import sofiadesarrollos.data.ProjectEntity;
import sofiadesarrollos.data.ProjectRepository;
import sofiadesarrollos.data.TransactionCategory;
import sofiadesarrollos.data.TransactionType;
import sofiadesarrollos.dto.CategorySummaryDto;
import sofiadesarrollos.dto.DashboardSummaryDto;
import sofiadesarrollos.dto.FinancialTransactionDto;
import sofiadesarrollos.dto.FinancialTransactionMapper;
import sofiadesarrollos.dto.ProjectsFinanceSummaryDto;
import sofiadesarrollos.dto.TimeSeriesPointDto;

@Service
public class FinanceServiceImpl implements FinanceService {

        private final FinancialTransactionRepository transactionRepository;
        private final ProjectRepository projectRepository;
        private final FinancialTransactionMapper transactionMapper = new FinancialTransactionMapper();

        public FinanceServiceImpl(FinancialTransactionRepository financialTransactionRepository, ProjectRepository projectRepository) {
                this.transactionRepository = financialTransactionRepository;
                this.projectRepository = projectRepository;
        }

        // ------------------------------------------------------------------
        // DASHBOARD
        // ------------------------------------------------------------------

        @Override
        public DashboardSummaryDto getSummary() {

                List<FinancialTransaction> transactions = transactionRepository.findAll();

                BigDecimal income = transactions.stream()
                                .filter(t -> t.getType() == TransactionType.INCOME)
                                .map(FinancialTransaction::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal expenses = transactions.stream()
                                .filter(t -> t.getType() == TransactionType.EXPENSE)
                                .map(FinancialTransaction::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                return DashboardSummaryDto.builder()
                                .income(income)
                                .expenses(expenses)
                                .balance(income.subtract(expenses))
                                .build();
        }

        @Override
        public List<TimeSeriesPointDto> getEvolution(LocalDate from, LocalDate to) {

                Map<YearMonth, List<FinancialTransaction>> grouped = transactionRepository.findAll().stream()
                                .filter(t -> !t.getTransactionDate().isBefore(from))
                                .filter(t -> !t.getTransactionDate().isAfter(to))
                                .collect(Collectors.groupingBy(
                                                t -> YearMonth.from(t.getTransactionDate()),
                                                TreeMap::new,
                                                Collectors.toList()));

                return grouped.entrySet().stream()
                                .map(entry -> {

                                        BigDecimal income = entry.getValue().stream()
                                                        .filter(t -> t.getType() == TransactionType.INCOME)
                                                        .map(FinancialTransaction::getAmount)
                                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                                        BigDecimal expenses = entry.getValue().stream()
                                                        .filter(t -> t.getType() == TransactionType.EXPENSE)
                                                        .map(FinancialTransaction::getAmount)
                                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                                        return TimeSeriesPointDto.builder()
                                                        .period(entry.getKey().toString()) // yyyy-MM
                                                        .income(income)
                                                        .expenses(expenses)
                                                        .balance(income.subtract(expenses))
                                                        .build();
                                })
                                .toList();
        }

        @Override
        public List<ProjectsFinanceSummaryDto> getProjectSummary() {

                Map<ProjectEntity, List<FinancialTransaction>> grouped = transactionRepository.findAll().stream()
                                .filter(t -> t.getProject() != null)
                                .collect(Collectors.groupingBy(FinancialTransaction::getProject));

                return grouped.entrySet().stream()
                                .map(entry -> {

                                        BigDecimal income = entry.getValue().stream()
                                                        .filter(t -> t.getType() == TransactionType.INCOME)
                                                        .map(FinancialTransaction::getAmount)
                                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                                        BigDecimal expenses = entry.getValue().stream()
                                                        .filter(t -> t.getType() == TransactionType.EXPENSE)
                                                        .map(FinancialTransaction::getAmount)
                                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                                        return ProjectsFinanceSummaryDto.builder()
                                                        .projectId(entry.getKey().getId())
                                                        .projectName(entry.getKey().getName())
                                                        .income(income)
                                                        .expenses(expenses)
                                                        .balance(income.subtract(expenses))
                                                        .build();
                                })
                                .toList();
        }

        // ------------------------------------------------------------------
        // TRANSACTIONS
        // ------------------------------------------------------------------

        @Override
        public List<FinancialTransactionDto> findAllTransactions(
                        String type,
                        String category,
                        String project,
                        LocalDate from,
                        LocalDate to) {

                // TODO Temporary: ignore filters
                return transactionRepository.findAll().stream()
                                .map(transactionMapper::toDto)
                                .toList();
        }

        @Override
        public FinancialTransactionDto findTransactionById(String id) {

                return transactionRepository.findById(id)
                                .map(transactionMapper::toDto)
                                .orElseThrow();
        }

        @Override
        public FinancialTransactionDto saveTransaction(FinancialTransactionDto dto) {

                FinancialTransaction entity = transactionMapper.toEntity(dto);

                ProjectEntity project = projectRepository.findById(dto.getProjectId())
                                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

                entity.setProject(project);

                return transactionMapper.toDto(
                                transactionRepository.save(entity));
        }

        @Override
        public void deleteTransactionById(String id) {

                transactionRepository.deleteById(id);
        }

        // ------------------------------------------------------------------
        // CATEGORIES
        // ------------------------------------------------------------------r
        @Override
        public List<CategorySummaryDto> getCategorySummary() {

                Map<TransactionCategory, BigDecimal> totals = transactionRepository.findAll().stream()
                                .collect(Collectors.groupingBy(
                                                FinancialTransaction::getCategory,
                                                Collectors.mapping(
                                                                FinancialTransaction::getAmount,
                                                                Collectors.reducing(BigDecimal.ZERO,
                                                                                BigDecimal::add))));

                return Arrays.stream(TransactionCategory.values())
                                .map(category -> buildDto(category, totals))
                                .toList();
        }

        private CategorySummaryDto buildDto(
                        TransactionCategory category,
                        Map<TransactionCategory, BigDecimal> totals) {

                return CategorySummaryDto.builder()
                                .category(category.name())
                                .amount(totals.getOrDefault(category, BigDecimal.ZERO))
                                .build();
        }

}
