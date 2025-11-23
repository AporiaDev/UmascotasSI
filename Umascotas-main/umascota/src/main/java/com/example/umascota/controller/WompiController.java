package com.example.umascota.controller;

import com.example.umascota.model.dto.WompiRequest;
import com.example.umascota.service.WompiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/wompi")
@CrossOrigin("*")
public class WompiController {

    @Autowired
    private WompiService wompiService;

    @PostMapping("/firma")
    public Map<String, String> generarFirma(@RequestBody WompiRequest body) throws Exception {

        String signature = wompiService.generarFirma(
                body.getReference(),
                body.getAmountInCents()
        );

        Map<String, String> response = new HashMap<>();
        response.put("signature", signature);

        return response;
    }
}
