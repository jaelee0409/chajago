package com.jaeseong.chajago;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "locations")
@Data
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private Double lat;
    private Double lng;
    
    // Lombok이 자동으로 생성해줌:
    // - 기본 생성자
    // - getter/setter
    // - equals/hashCode
    // - toString
}