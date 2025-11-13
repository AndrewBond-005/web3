package managers;

import beans.Result;
import util.Checker;
import util.Parser;
import util.Validator;

import javax.annotation.PostConstruct;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.logging.Logger;

public class ResultsManager {
    private static final Logger LOG = Logger.getLogger(ResultsManager.class.getName());

    private Double x;
    private String y;
    private Integer r;
    private boolean hit=false;
    private final List<Result> results = Collections.synchronizedList(new LinkedList<>());
    private final DBManager dbManager = new DBManager();
    private String message = "";
    private String pointJson = "";

    @PostConstruct
    public void init() {
        LOG.info("ResultsManager initialization");
        try {
            this.x=0.0;
            this.y="-5";
            this.r=3;
            //DBManager.createTable();
            //List<Result> dbResults = dbManager.getAllResults();
            //results.addAll(dbResults);
            //LOG.info("Loaded " + dbResults.size() + " results from database");
        } catch (Exception e) {
            LOG.severe("Init error: " + e.getMessage());
        }
    }
    public void checkHitWithValidation(){
        try{
            LOG.info(String.format("Validation request: x=%s, y=%s, r=%s", x, y, r));

            Result result=new Parser().parse(x.toString(),y,r.toString());
            if(Validator.validate(result)){
                LOG.fine("Validation passed");
                submitHit();
            }
        } catch (Exception e) {
            message = e.getMessage();
            LOG.severe("error: " + e.getMessage());
        }
    }
    public void submitHit() {
        try {
            LOG.info(String.format("Processing request: x=%s, y=%s, r=%s", x, y, r));
            long start = System.nanoTime();
            Result result=new Parser().parse(x.toString(),y,r.toString());
            boolean hit = Checker.check(result.getX(), result.getY(), result.getR());
            long executionTime = (System.nanoTime() - start) / 1000;
            result.setHit(hit);
            result.setExecutionTime(executionTime);
            result.setTimestamp(LocalDateTime.now());
            LOG.info(String.format("Hit check: x=%.2f, y=%.2f, r=%d -> hit=%s, time=%dms",
                    result.getX(), result.getY(), result.getR(), hit, executionTime));
            /*dbManager.saveResult(
                    result.getX(), result.getY(), result.getR(),
                    result.isHit(), result.getTimestamp(), result.getExecutionTime());
             */
            this.hit=hit;
            results.add(0, result);
            message = "";
            pointJson = String.format(
                    "{\"x\":%f,\"y\":%f,\"r\":%d,\"hit\":%b}",
                    result.getX(), result.getY(), result.getR(), result.isHit()
            );
            LOG.info("Result saved and added to list");
        } catch (Exception e) {
            message = "Save error: " + e.getMessage();
            LOG.severe("error: " + e.getMessage());
        }
    }

    public void clearResults() {
        LOG.info("Clearing all results");
        //dbManager.clearResults();
        this.results.clear();
        this.message = "";
        LOG.info("All results cleared");
    }

    public Double getX() { return x; }
    public void setX(Double x) {
        LOG.fine("X set to: " + x);
        this.x = x;
    }

    public String getY() { return y; }
    public void setY(String yStr) {
        LOG.fine("Y set to: " + yStr);
        this.y = yStr;
    }

    public Integer getR() { return r; }
    public void setR(Integer r) {
        LOG.fine("R set to: " + r);
        this.r = r;
    }

    public String getMessage() {
        LOG.fine("Message requested: " + message);
        return message;
    }

    public List<Result> getResults() {
        LOG.fine("Results list requested, size: " + results.size());
        return results;
    }
    public String getPointJson() {
        return pointJson;
    }
    public void setPointJson(String pointJson) {
        this.pointJson = pointJson;
    }

    public boolean isHit() {
        return hit;
    }

    public void setHit(boolean hit) {
        this.hit = hit;
    }
}