package beans;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TimeBean {
    public String getCurrentTime() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss"));
    }
}