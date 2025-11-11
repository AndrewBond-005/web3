package beans;

import java.time.LocalDateTime;

public class Result {
    private double x;
    private double y;
    private int r;
    private boolean hit;
    private LocalDateTime timestamp;
    private long executionTime;

    public Result(double x, double y, int r, boolean hit, LocalDateTime timestamp, long execTime) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.timestamp = timestamp;
        this.executionTime = execTime;
    }

    public double getX() {
        return x;
    }
    public void setX(double x) {
        this.x = x;
    }
    public double getY() {
        return y;
    }
    public void setY(double y) {
        this.y = y;
    }
    public int getR() {
        return r;
    }
    public void setR(int r) {
        this.r = r;
    }
    public boolean isHit() {
        return hit;
    }
    public void setHit(boolean hit) {
        this.hit = hit;
    }
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    public long getExecutionTime() {
        return executionTime;
    }
    public void setExecutionTime(long executionTime) {
        this.executionTime = executionTime;
    }
}