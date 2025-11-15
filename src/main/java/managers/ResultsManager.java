package managers;

import beans.Result;
import util.Checker;
import util.Parser;
import util.Validator;

import javax.annotation.ManagedBean;
import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

public class ResultsManager {
    private Double x;
    private String y;
    private Integer r;
    private boolean hit = false;
    private final List<Result> results = Collections.synchronizedList(new LinkedList<>());
    private final DBManager dbManager = new DBManager();
    private String message = "";

    @PostConstruct
    public void init() {
        try {
            this.x = 0.0;
            this.y = "-5";
            this.r = 3;
            DBManager.createTable();
            List<Result> dbResults = dbManager.getAllResults();
            results.addAll(dbResults);
        } catch (Exception ignored) {
        }
    }

    public void checkHitWithValidation() {
        try {
            Result result = new Parser().parse(x.toString(), y, r.toString());
            if (Validator.validate(result)) {
                submitHit();
            }
        } catch (Exception e) {
            message = e.getMessage();
            x = null;
            y = null;
        }
    }

    public void submitHit() {
        try {
            long start = System.nanoTime();
            Result result = new Parser().parse(x.toString(), y, r.toString());
            boolean hit = Checker.check(result.getX(), result.getY(), result.getR());
            long executionTime = (System.nanoTime() - start) / 1000;
            result.setHit(hit);
            result.setExecutionTime(executionTime);
            result.setTimestamp(LocalDateTime.now());
            dbManager.saveResult(
                    result.getX(),
                    result.getY(),
                    result.getR(),
                    result.isHit(),
                    LocalDateTime.parse(result.getTimestamp(), DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss")),
                    result.getExecutionTime());

            this.hit = hit;
            results.add(0, result);
            message = "";
        } catch (Exception e) {
            message = "Ошибка сохранения: " + e.getMessage();
        }
    }

    public void clearResults() {
        try {
            dbManager.clearResults();
            this.results.clear();
            this.message = "";
            x=null;
            y=null;
            r=null;
        } catch (Exception e) {
            message = e.getMessage();
        }
    }

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public String getY() {
        return y;
    }

    public void setY(String yStr) {
        this.y = yStr;
    }

    public Integer getR() {
        return r;
    }

    public void setR(Integer r) {
        this.r = r;
    }

    public String getMessage() {
        return message;
    }

    public List<Result> getResults() {
        return results;
    }

    public boolean isHit() {
        return hit;
    }

    public void setHit(boolean hit) {
        this.hit = hit;
    }
}