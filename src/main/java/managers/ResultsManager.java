package managers;

import beans.Result;
import util.Checker;
import util.Validator;

import javax.annotation.PostConstruct;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;


public class ResultsManager {
    private Double x;
    private String y;
    private Integer r;
    private final List<Result> results = Collections.synchronizedList(new LinkedList<>());
    private final DBManager dbManager = new DBManager();
    private String message = "";

    @PostConstruct
    public void init() {
        try {
            DBManager.createTable();
            results.addAll(dbManager.getAllResults());
        } catch (Exception ignored) {
        }
    }

    public void submitHit() {
        Result result;
        try {
            result = Validator.validate(x.toString(), y, r.toString());
        } catch (Exception e) {
            message = e.getMessage();
            return;
        }
        long start = System.nanoTime();
        boolean hit = Checker.check(result.getX(), result.getY(), result.getR());
        long executionTime = (System.nanoTime() - start) / 1_000_000;
        result.setHit(hit);
        result.setExecutionTime(executionTime);
        result.setTimestamp(LocalDateTime.now());

        try {
            dbManager.saveResult(
                    result.getX(), result.getY(), result.getR(),
                    result.isHit(), result.getTimestamp(), result.getExecutionTime()
            );
            results.add(0, result); // новые — сверху
        } catch (Exception e) {
            message = "Ошибка сохранения: " + e.getMessage();
        }
    }
    public void clearResults() {
        try {
            dbManager.clearResults();
            this.results.clear();
            this.message = "";
        } catch ( SQLException e) {
            this.message = "Ошибка при очистке результатов: " + e.getMessage();
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
}