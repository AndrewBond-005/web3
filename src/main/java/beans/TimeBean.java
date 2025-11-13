package beans;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.logging.Logger;

public class TimeBean {
    private static final Logger LOG = Logger.getLogger(TimeBean.class.getName());

    public String getCurrentTime() {
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss"));
        LOG.fine("TimeBean: current time requested - " + currentTime);
        return currentTime;
    }
}