package util;

import java.util.logging.Logger;

public class Checker {
    private static final Logger LOG = Logger.getLogger(Checker.class.getName());

    public static boolean check(double x, double y, int r) {
        LOG.fine(String.format("Checking hit: x=%.2f, y=%.2f, r=%d", x, y, r));

        // 1st quarter: rectangle
        if (x >= 0 && y >= 0 && x*2 <= r && y <= r) {
            LOG.fine("Point hit in 1st quarter (rectangle)");
            return true;
        }

        // 2nd quarter: triangle
        if (x <= 0 && y >= 0 && 2*y <= x + r) {
            LOG.fine("Point hit in 2nd quarter (triangle)");
            return true;
        }

        // 3rd quarter: circle
        if (x <= 0 && y <= 0 && x * x + y * y <= r * r) {
            LOG.fine("Point hit in 3rd quarter (circle)");
            return true;
        }

        LOG.fine("Point missed the area");
        return false;
    }
}