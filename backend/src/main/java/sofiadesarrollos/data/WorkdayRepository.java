package sofiadesarrollos.data;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkdayRepository extends JpaRepository<Workday, String> {

    Optional<Workday> findByDate(
            LocalDate date
    );

}
