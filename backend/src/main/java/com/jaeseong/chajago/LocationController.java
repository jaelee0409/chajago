package com.jaeseong.chajago;

import org.springframework.web.bind.annotation.*;

@RestController
public class LocationController {

    // ⭐ 루트 경로 추가
    @GetMapping("/")
    public String home() {
        return "Chajago 백엔드 서버 작동 중! 🚀<br><a href='/api/test'>API 테스트</a>";
    }

    @GetMapping("/api/test")
    public String test() {
        return "Chajago 백엔드 연결 성공! 🚀";
    }
    
    @PostMapping("/api/locations")
    public Location createLocation(@RequestBody Location location) {
        // 임시로 받은 데이터 그대로 반환
        return location;
    }
}