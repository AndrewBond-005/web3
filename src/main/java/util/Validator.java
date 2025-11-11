package util;

import beans.Result;

import java.util.Arrays;
import java.util.List;

public class Validator {
    // private static final List<Double> ACCEPTABLE_Y = Arrays.asList(-5d, -4d, -3d, -2d, -1d, 0d, 1d, 2d, 3d);
    private static final List<Integer> ACCEPTABLE_R = Arrays.asList(1, 2, 3, 4, 5);
    private static final int MIN_X = -2;
    private static final int MAX_X = 2;

    public static Result validate(String x, String y, String r) {
        try {
            if(x==null || y==null || r==null) {throw new RuntimeException("Пустые параметры недопустимы!");}
            var x1 = (int)Double.parseDouble(x.replace(",", "."));
            var y1 = Double.parseDouble(y.replace(",", "."));
            var r1 = Integer.parseInt(r.replace(",", "."));
            // if (!ACCEPTABLE_Y.contains(y1)) return false;
            var res= new Result(x1,y1,r1,false,null,-1);
            if (x1 < MIN_X || x1 > MAX_X) throw new RuntimeException("X должен быть от -2 до 2");
            if (!ACCEPTABLE_R.contains(r1)) throw new RuntimeException("Возможные R: 1, 2, 3, 4, 5");
            return res;
        }catch (NumberFormatException e) {
            throw new RuntimeException("Не удалось распознать число");
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
