package com.example.umascota.controller;

import com.example.umascota.service.WompiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wompi")
public class WompiController {

    @Autowired
    private WompiService wompiService;

    @PostMapping("/webhook")
    public String recibirWebhook(@RequestBody String payload,
                                 @RequestHeader("X-Integrity-Signature") String signature) {
        try {
            boolean valido = wompiService.validarIntegridad(payload, signature);
            if (valido) {
                // Aquí procesas la donación (guardar en BD, actualizar estado, etc.)
                return "OK";
            } else {
                return "Firma inválida";
            }
        } catch (Exception e) {
            return "Error en validación";
        }
    }
}