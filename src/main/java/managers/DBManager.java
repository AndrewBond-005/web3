package managers;

import beans.Result;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class DBManager {
    private static final String url = "jdbc:postgresql://192.168.10.80:5432/studs";
    private static final String user = "s465259";
    private static final String password = "2dfu5kbMjK6gHPuC";

    static {
        try {
            Class.forName("org.postgresql.Driver");
            createTable();
        } catch (SQLException | ClassNotFoundException e) {
        }
    }

    public void saveResult(double x, double y, int r, boolean hit, LocalDateTime timestamp, long executionTime)
            throws SQLException {

        String sql = "INSERT INTO results (x, y, r, hit, timestamp, execution_time) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            assert conn != null;
            conn.setAutoCommit(false);
            try {
                ps.setDouble(1, x);
                ps.setDouble(2, y);
                ps.setInt(3, r);
                ps.setBoolean(4, hit);
                ps.setTimestamp(5, Timestamp.valueOf(timestamp));
                ps.setLong(6, executionTime);
                int rows = ps.executeUpdate();
                conn.commit();
            } catch (Exception e) {
                conn.rollback();
                throw e;
            }
        }
    }

    public List<Result> getAllResults() throws SQLException {
        String sql = "SELECT x, y, r, hit, timestamp, execution_time " +
                "FROM results " +
                "ORDER BY timestamp DESC";
        List<Result> results = new ArrayList<>();
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            int count = 0;
            while (rs.next()) {
                double x = rs.getDouble("x");
                double y = rs.getDouble("y");
                int r = rs.getInt("r");
                boolean hit = rs.getBoolean("hit");
                LocalDateTime timestamp = rs.getTimestamp("timestamp").toLocalDateTime();
                long execTime = rs.getLong("execution_time");
                results.add(new Result(x, y, r, hit, timestamp, execTime));
                count++;
            }
        }
        return results;
    }

    public static void createTable() throws SQLException {
        var scriptFileName = "create.sql";
        try {
            var conn = getConnection();
            Statement stmt = conn.createStatement();
            conn.setAutoCommit(false);
            if (!Files.exists(Paths.get(scriptFileName))) {
                String sql = """
                        CREATE TABLE IF NOT EXISTS results (
                            id SERIAL PRIMARY KEY,
                            x DOUBLE PRECISION NOT NULL,
                            y DOUBLE PRECISION NOT NULL,
                            r INTEGER NOT NULL,
                            hit BOOLEAN NOT NULL,
                            timestamp TIMESTAMP NOT NULL,
                            execution_time BIGINT NOT NULL
                        )
                        """;
                stmt.execute(sql);
                conn.commit();
                return;
            }
            String sql = Files.readString(Paths.get(scriptFileName));
            String[] commands = sql.split(";\\s*");
            for (String command : commands) {
                try {
                    String tcom = command.trim();
                    if (!tcom.isEmpty()) {
                        stmt.execute(tcom);
                    }
                } catch (SQLException ignored) {
                }
            }
            conn.commit();
        } catch (SQLException | IOException ignored) {
        }
    }

    public void clearResults() throws SQLException {
        String sql = "DELETE FROM results";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            conn.setAutoCommit(false);
            try {
                int rows = ps.executeUpdate();
                conn.commit();
            } catch (Exception e) {
                conn.rollback();
                throw e;
            }
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, user, password);
    }
}