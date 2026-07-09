package sofiadesarrollos.service;

import org.springframework.web.multipart.MultipartFile;

public interface AttendanceImportService {

    void importExcel(MultipartFile file);

}
