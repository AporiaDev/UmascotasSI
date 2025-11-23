package com.example.umascota.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@Service
public class WompiService {

    @Value("${WOMPI_INTEGRITY_SECRET}")
    private String integritySecret;

    public String generarFirma(String reference, Integer amountInCents) throws Exception {

        String currency = "COP";
        String cadena = reference + amountInCents + currency + integritySecret;

        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(cadena.getBytes(StandardCharsets.UTF_8));

        StringBuilder hex = new StringBuilder();
        for (byte b : hash) {
            hex.append(String.format("%02x", b));
        }

        return hex.toString();
    }
}
