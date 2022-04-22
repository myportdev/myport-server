import rateLimit from "express-rate-limit";

export const api_limiter = rateLimit({
    windowMs: 1000, // 이 시간 동안
    max: 15, // 최대 횟수
    delayMs: 0, // 요청 간 간격
    handler(req, res) {
        // 어겼을 경우 메시지
        res.status(this.statusCode).json({
            code: this.statusCode, // 기본 429
            message: "1초에 한번만 요청할 수 있습니다.",
        });
    },
});
