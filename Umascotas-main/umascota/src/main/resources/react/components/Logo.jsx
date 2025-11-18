import React from 'react';

const Logo = ({ size = 80, className = '', showText = true }) => {
  // Ruta del logo PNG - debe estar en src/main/resources/static/images/
  const logoPath = '/images/logo-umascotas.png';
  
  const [useImage, setUseImage] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);
  
  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {useImage && !imageError ? (
          <img
            src={logoPath}
            alt="U-Mascota Logo"
            className="drop-shadow-2xl floating-animation"
            style={{
              width: size,
              height: size,
              objectFit: 'contain',
            }}
            onError={() => {
              setImageError(true);
              setUseImage(false);
            }}
          />
        ) : (
          <svg
            width={size}
            height={size}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg floating-animation"
          >
        {/* Fondo redondeado verde */}
        <rect
          x="5"
          y="5"
          width="190"
          height="120"
          rx="15"
          fill="#4ADE80"
          stroke="#22C55E"
          strokeWidth="3"
        />
        
        {/* Letra U estilizada */}
        <g transform="translate(100, 65)">
          {/* U principal */}
          <path
            d="M -40 0 L -40 -30 Q -40 -40, -30 -40 L 30 -40 Q 40 -40, 40 -30 L 40 0"
            fill="white"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Gato (izquierda) - integrado con la U */}
          {/* Cuerpo del gato formando el lado izquierdo de la U */}
          <path
            d="M -50 -20 Q -50 -35, -45 -40 Q -40 -45, -35 -40 Q -30 -35, -30 -20"
            fill="white"
          />
          {/* Cabeza del gato */}
          <circle cx="-45" cy="-25" r="8" fill="white" />
          {/* Orejas del gato */}
          <path
            d="M -52 -30 L -48 -38 L -45 -30 Z"
            fill="white"
          />
          <path
            d="M -45 -30 L -42 -38 L -38 -30 Z"
            fill="white"
          />
          {/* Cola del gato */}
          <path
            d="M -50 -10 Q -55 -5, -50 0"
            fill="white"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Perro (derecha) - integrado con la U */}
          {/* Cuerpo del perro formando el lado derecho de la U */}
          <path
            d="M 50 -20 Q 50 -35, 45 -40 Q 40 -45, 35 -40 Q 30 -35, 30 -20"
            fill="white"
          />
          {/* Cabeza del perro */}
          <circle cx="45" cy="-25" r="8" fill="white" />
          {/* Orejas caídas del perro */}
          <ellipse cx="42" cy="-30" rx="4" ry="6" fill="white" />
          <ellipse cx="48" cy="-30" rx="4" ry="6" fill="white" />
          {/* Hocico del perro */}
          <ellipse cx="50" cy="-22" rx="3" ry="2" fill="white" />
        </g>
        
            {/* Texto MASCOTAS */}
            {showText && (
              <text
                x="100"
                y="150"
                fontSize="20"
                fontWeight="bold"
                fill="#4ADE80"
                textAnchor="middle"
                fontFamily="Inter, sans-serif"
                letterSpacing="2"
              >
                MASCOTAS
              </text>
            )}
          </svg>
        )}
      </div>
    </div>
  );
};

export default Logo;

