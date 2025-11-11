package util;
public class Checker {
    public static boolean check(double x,double y,int r) {
        if (x <= 0 && y <= 0 && x * x + y * y <= r * r) return true;
        if (x >= 0 && y >= 0 && x*2 <= r  && y <= r) return true;
        if (x <= 0 && y >= 0 && 2*y <= x+r) return true;
        return false;
    }
}
