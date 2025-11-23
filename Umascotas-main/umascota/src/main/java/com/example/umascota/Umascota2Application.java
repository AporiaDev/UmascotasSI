package com.example.umascota;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.example.umascota")
public class Umascota2Application {

    public static void main(String[] args) {
        SpringApplication.run(Umascota2Application.class, args);
    }
}
