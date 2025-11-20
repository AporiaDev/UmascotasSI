package com.umascotas.umascota.controller;

import org.springframework.web.bind.annotation.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;

@RestController
@RequestMapping("/api/wompi")
public class WompiController {

    private static final String INTEGRITY_KEY = "prod_integrity_9HnRoNX4OkNyex6Jsay8qKM2OU29TyIJ";

    @PostMapping("/donacion")
    public Map<String, String> crearDonacion(@RequestBody Map<String, Object> body) {
        Integer amount = (Integer) body.get("amount"); // en pesos
        int amountInCents = amount * 100;

        String reference = "donacion-" + System.currentTimeMillis();
        String currency = "COP";

        // Generar signature
        String signature = sha256(reference + amountInCents + currency + INTEGRITY_KEY);

        return Map.of(
            "reference", reference,
            "amountInCents", String.valueOf(amountInCents),
            "currency", currency,
            "signature", signature
        );
    }

    private String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();

        } catch (Exception e) {
            throw new RuntimeException("Error generando SHA-256");
        }
    }
}
