package beans;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.faces.bean.ManagedBean;
import jakarta.faces.bean.RequestScoped;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@ManagedBean(name="timeBean")
@ApplicationScoped
public class TimeBean {
    public String getCurrentTime() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm"));
    }
}