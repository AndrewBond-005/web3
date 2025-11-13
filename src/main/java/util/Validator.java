package util;

import beans.Result;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

public class Validator {
    private static final Logger LOG = Logger.getLogger(Validator.class.getName());

    private static final List<Integer> ACCEPTABLE_R = Arrays.asList(1, 2, 3, 4, 5);
    private static final int MIN_X = -2;
    private static final int MAX_X = 2;

    public static boolean validate(Result result) {
        if(result == null) {
            throw new RuntimeException("Empty parameters not allowed!");

        }

        try {
            LOG.info(String.format("Validating parameters: x=%s, y=%s, r=%s", result.getX(), result.getY(), result.getR()));
            var x=(int)result.getX();
            var y=result.getY();
            var r=result.getR();
            LOG.fine(String.format("Parsing success: x=%d, y=%.2f, r=%d", x, y, r));

            if (x <= MIN_X || x >= MAX_X) {
                throw new RuntimeException("X must be from -2 to 2");
            }
            if (!ACCEPTABLE_R.contains(r)) {
                throw new RuntimeException("Possible R values: 1, 2, 3, 4, 5");
            }
            LOG.info("Validation passed");
            return true;

        } catch (NumberFormatException e) {
            LOG.warning("Number parsing error: " + e.getMessage());
            throw new RuntimeException("Cannot parse number");
        } catch (RuntimeException e) {
            LOG.warning("Validation error: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }
}