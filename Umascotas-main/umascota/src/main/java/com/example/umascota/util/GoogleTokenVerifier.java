package com.example.umascota.util;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class GoogleTokenVerifier {
    
    @Value("${GOOGLE_CLIENT_ID:}")
    private String clientId;
    
    public GoogleIdToken.Payload verifyToken(String idTokenString) {
        try {
            // Intentar obtener desde variable de entorno primero, luego desde properties
            String finalClientId = System.getenv("GOOGLE_CLIENT_ID");
            if (finalClientId == null || finalClientId.isEmpty()) {
                finalClientId = clientId;
            }
            
            if (finalClientId == null || finalClientId.isEmpty()) {
                throw new IllegalArgumentException("GOOGLE_CLIENT_ID no está configurado. Configúralo como variable de entorno o en application.properties");
            }
            
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), 
                    new GsonFactory())
                    .setAudience(Collections.singletonList(finalClientId))
                    .build();
            
            GoogleIdToken idToken = verifier.verify(idTokenString);
            
            if (idToken != null) {
                return idToken.getPayload();
            } else {
                throw new IllegalArgumentException("Token de Google inválido");
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Error al verificar token de Google: " + e.getMessage());
        }
    }
}

