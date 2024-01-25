const FSSMath = {
    PIM2: Math.PI * 2,
    PID2: Math.PI / 2,
    randomInRange(min: number, max: number) {
        return min + (max - min) * Math.random();
    },
    clamp(value: number, min: number, max: number) {
        value = Math.max(value, min);
        value = Math.min(value, max);
        return value;
    }
}
