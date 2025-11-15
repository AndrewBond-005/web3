package beans;

import org.icefaces.application.PushRenderer;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class TimeBean implements Serializable {

    private static final long serialVersionUID = 1L;
    private Date currentTime = new Date();
    private final SimpleDateFormat fmt = new SimpleDateFormat("HH:mm:ss");
    private ScheduledExecutorService scheduler;

    @javax.annotation.PostConstruct
    public void init() {
        scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.scheduleAtFixedRate(() -> {
            currentTime = new Date();
            PushRenderer.render("timeGroup"); // ← главная строка
        }, 0, 10, TimeUnit.SECONDS); // каждые 10 секунд
    }

    @javax.annotation.PreDestroy
    public void cleanup() {
        if (scheduler != null) {
            scheduler.shutdown();
        }
    }

    public String getCurrentTime() {
        return fmt.format(currentTime);
    }

    // Для отладки — можно убрать
    public long getTimestamp() {
        return currentTime.getTime();
    }
}