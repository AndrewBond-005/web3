package beans;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.logging.Logger;

public class Result {
    private static final Logger LOG = Logger.getLogger(Result.class.getName());

    private double x;
    private double y;
    private int r;
    private boolean hit;
    private String timestamp;
    private long executionTime;

    public Result(double x, double y, int r, boolean hit, LocalDateTime timestamp, long execTime) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
        this.timestamp = (timestamp).format(formatter);
        this.executionTime = execTime;
        LOG.fine(String.format("New Result created: x=%.2f, y=%.2f, r=%d, hit=%s", x, y, r, hit));
    }

    public double getX() { return x; }
    public void setX(double x) {
        LOG.fine("X changed: " + this.x + " -> " + x);
        this.x = x;
    }

    public double getY() { return y; }
    public void setY(double y) {
        LOG.fine("Y changed: " + this.y + " -> " + y);
        this.y = y;
    }

    public int getR() { return r; }
    public void setR(int r) {
        LOG.fine("R changed: " + this.r + " -> " + r);
        this.r = r;
    }

    public boolean isHit() { return hit; }
    public void setHit(boolean hit) {
        LOG.fine("Hit result changed: " + this.hit + " -> " + hit);
        this.hit = hit;
    }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) {
        LOG.fine("Timestamp changed");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
        this.timestamp = (timestamp).format(formatter);
    }

    public long getExecutionTime() { return executionTime; }
    public void setExecutionTime(long executionTime) {
        LOG.fine("Execution time changed: " + this.executionTime + " -> " + executionTime);
        this.executionTime = executionTime;
    }
}