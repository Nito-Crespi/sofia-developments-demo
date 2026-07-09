package sofiadesarrollos.service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import sofiadesarrollos.dto.WorkerAttendanceDto;

@Service
public class AttendanceImportServiceImpl implements AttendanceImportService{

    private final WorkerService workerService;

    public AttendanceImportServiceImpl(WorkerService workerService) {
        this.workerService = workerService;
    }

    public void importExcel(MultipartFile file) {
        //PARAMETERS for initial cell of the table
        int initialColumn = 0;
        int initialRow = 14  - 1;
        int endRow = 15   - 1;
        int[] datecoords = {9 - 1,((int) 'D') - 65};


        // Parse workbook
        Workbook workbook;
        try{
            workbook = WorkbookFactory.create(file.getInputStream());
        }
        catch(IOException e){
            workbook = null;
        }

        Sheet sheet = workbook.getSheetAt(0);


        LocalDate date =  sheet.getRow(datecoords[0]).getCell(datecoords[1]).getLocalDateTimeCellValue().toLocalDate();

        

        for (int i = initialRow; i < endRow; i++) {
            Row row = sheet.getRow(i);

            String id = row.getCell(initialColumn + 0).getStringCellValue(); //TODO findbydni

            int dni = (int)(row.getCell(initialColumn + 03).getNumericCellValue());


            LocalTime start = row.getCell(initialColumn + 4).getLocalDateTimeCellValue().toLocalTime();

            LocalTime end = row.getCell(initialColumn + 5).getLocalDateTimeCellValue().toLocalTime();
            boolean meal = row.getCell(initialColumn + 6).getBooleanCellValue();

            // Build DTO
            WorkerAttendanceDto dto = WorkerAttendanceDto.builder()
                    .workerId(id)
                    .date(date)
                    .startTime(start)
                    .endTime(end)
                    .mealConsumed(meal)
                    .build();

            workerService.save(dto);

        }

       
    }


}
