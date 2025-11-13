package util;

import beans.Result;

import java.time.LocalDateTime;

public class Parser {
    public Result parse(String x, String y, String r) throws Exception {
        try {
            var x1 = Double.parseDouble(x.replace(",", "."));
            var y1 = Double.parseDouble(y.replace(",", "."));
            var r1 = Integer.parseInt(r.replace(",", "."));
            return new Result(x1, y1, r1, false, LocalDateTime.now(), -1);
        }catch (NumberFormatException e) {
            throw new Exception("Не удалось распарсить параметры");
        }
    }
}
