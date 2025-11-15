package util;

import beans.Result;

import java.util.Arrays;
import java.util.List;

public class Validator {
    private static final List<Integer> ACCEPTABLE_R = Arrays.asList(1, 2, 3, 4, 5);
    private static final double MIN_X = -2.0;
    private static final double MAX_X = 2.0;
    private static final double MIN_Y = -5.0;
    private static final double MAX_Y = 3.0;

    public static boolean validate(Result result) {
        if (result == null) {
            throw new RuntimeException("Пустые параметры недопустимы");
        }
        try {
            var x = result.getX();
            var y = result.getY();
            var r = result.getR();
            if (x != Math.floor(x)) {
                throw new RuntimeException("X должен быть числом");
            }
            if (x < MIN_X || x > MAX_X) {
                throw new RuntimeException("X должен быть от -2 до 2");
            }
            if (y < MIN_Y || y > MAX_Y) {
                throw new RuntimeException("Y должен быть от -5 до 3");
            }
            if (!ACCEPTABLE_R.contains(r)) {
                throw new RuntimeException("Возможные значения R: 1, 2, 3, 4, 5");
            }
            return true;

        } catch (NumberFormatException e) {
            throw new RuntimeException("Не удалось определить число");
        } catch (RuntimeException e) {
            throw new RuntimeException("Ошибка валидации: " + e.getMessage());
        }
    }
}