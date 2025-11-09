package com.example.umascota.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;

public class JwtUtil {

  private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
  // Estableceremos la validez de nuestro token por un lapso de 6 horas (milisegundos)
  private static final long expirationTime = 21600000;

  public static String generateToken(String subject) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + expirationTime);
    return Jwts.builder()//Sirve para crear objetos de forma clara y compacta
            .setSubject(subject)//correo electronico .setSubject(silbacrack@gmail.com)
            .setIssuedAt(now)// Momento en el que el Token fue emitido
            .setExpiration(expiryDate)//Momento de vencimiento del Token
            .signWith(key)//Firma digital
            .compact();//Termina la construccion del token, convierte en Base64
  } //builder() = "quiero empezar a construir un JWT"
    //y después, cada método que sigue agrega algo al token.
    //Al final, .compact() termina el proceso y devuelve el token listo para usar.
  
  public static String getSubjectFromToken(String token) {
    Claims claims = Jwts.parserBuilder()//Lector que abre el token para hacer la lectura de lo que tiene dentro
            .setSigningKey(key)//Clave secreta con la que se firmo el original
            .build()//Construye el parser final para usarse...
            .parseClaimsJws(token)//Aqui comienza el verdadero analisis del TOKEN, SI LA FIRMA ES VALIDA SEPARA LAS TRES PARTES DEL TOKEN
            .getBody();//Obtiene los claims(metadatos)
    return claims.getSubject();//Extrae el subject
  }

  public static boolean validateToken(String token) {
    try {
      Jwts.parserBuilder()//Descompone define como se van a parsetar los datos
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token);
      return true;//si no hay error significa que no hubo alteracion del token o la firma
    } catch (Exception e) {
      return false;
    }
  }

}