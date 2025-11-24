package com.example.umascota.service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class WompiService {

    @Value("${wompi.integrity.key}")
    private String integrityKey;

    public boolean validarIntegridad(String payload, String signature) throws Exception {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(integrityKey.getBytes(), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        String hash = bytesToHex(sha256_HMAC.doFinal(payload.getBytes()));
        return hash.equals(signature);
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}