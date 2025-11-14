import React, { useState, useEffect } from "react";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  ButtonGroup, 
  Alert, 
  Spinner,
  Badge,
  Carousel
} from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useHistory } from "react-router-dom";
import L from "leaflet";
import { useTranslation } from "react-i18next";
import "leaflet/dist/leaflet.css";

// Fix para los íconos de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Íconos
import { 
  FaStore, 
  FaUser, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaSyncAlt,
  FaGlobe,
  FaCity,
  FaHome,
  FaIdCard,
  FaRuler,
  FaLocationArrow
} from "react-icons/fa";

// 🆕 FUNCIÓN PARA CALCULAR DISTANCIA (Fórmula Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distancia en km
  return distance;
};

// 🆕 HOOK PARA OBTENER UBICACIÓN ACTUAL DEL USUARIO
const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada'));
        return;
      }

      setIsGettingLocation(true);
      setLocationError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setUserLocation(location);
          setIsGettingLocation(false);
          resolve(location);
        },
        (error) => {
          let errorMessage = 'Error obteniendo ubicación';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permiso de ubicación denegado';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Información de ubicación no disponible';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tiempo de espera agotado';
              break;
          }
          setLocationError(errorMessage);
          setIsGettingLocation(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  };

  return { userLocation, locationError, isGettingLocation, getUserLocation };
};

// 🆕 COMPONENTE DE CÁLCULO DE DISTANCIA
const DistanceCalculator = ({ shopPosition }) => {
  const { t } = useTranslation('map');
  const { userLocation, locationError, isGettingLocation, getUserLocation } = useUserLocation();
  const [distance, setDistance] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const calculateDistanceToShop = async () => {
    if (!shopPosition) return;
    
    try {
      setCalculating(true);
      
      // Obtener ubicación actual del usuario
      const currentLocation = await getUserLocation();
      
      if (currentLocation && shopPosition.lat && shopPosition.lng) {
        const calculatedDistance = calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          shopPosition.lat,
          shopPosition.lng
        );
        
        setDistance(calculatedDistance);
      }
    } catch (error) {
      console.error('Error calculando distancia:', error);
    } finally {
      setCalculating(false);
    }
  };

  // Formatear distancia de manera legible
  const formatDistance = (km) => {
    if (km < 1) {
      return `${Math.round(km * 1000)} m`; // Mostrar en metros si es menos de 1km
    } else if (km < 1000) {
      return `${km.toFixed(1)} km`;
    } else {
      return `${Math.round(km)} km`; // Redondear para distancias largas
    }
  };

  if (!shopPosition || !shopPosition.lat) {
    return null;
  }

  return (
    <div className="mt-3 p-3 bg-light rounded border">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center">
          <FaRuler className="text-primary me-2" size={20} />
          <h6 className="mb-0 fw-bold">{t('map.distanceToShop', 'Distancia a la tienda')}</h6>
        </div>
        
        <Button
          variant={distance ? "outline-success" : "primary"}
          size="sm"
          onClick={calculateDistanceToShop}
          disabled={calculating || isGettingLocation}
        >
          {calculating || isGettingLocation ? (
            <Spinner animation="border" size="sm" />
          ) : distance ? (
            <FaSyncAlt />
          ) : (
            <FaLocationArrow />
          )}
          <span className="ms-2">
            {distance ? t('map.recalculate', 'Recalcular') : t('map.calculate', 'Calcular')}
          </span>
        </Button>
      </div>
      
      {distance !== null ? (
        <div className="text-center">
          <Badge   className="fs-6 p-2">
           <h4>{formatDistance(distance)} </h4> 
          </Badge>
          <p className="text-muted small mb-0 mt-1">
            {t('map.distanceDescription', 'Distancia en línea recta desde tu ubicación actual')}
          </p>
        </div>
      ) : locationError ? (
        <Alert variant="warning" className="py-2 mb-0">
          <small>{locationError}</small>
        </Alert>
      ) : (
        <p className="text-muted small mb-0">
          {t('map.getDistance', 'Haz clic en "Calcular" para conocer la distancia desde tu ubicación actual')}
        </p>
      )}
      
      {userLocation && (
        <small className="text-muted d-block mt-2">
          {t('map.yourLocation', 'Tu ubicación actual')}: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
        </small>
      )}
    </div>
  );
};

// Avatar component mejorado
const Avatar = ({ user, size = 60 }) => {
  return (
    <div
      className="rounded-circle bg-gradient-primary d-flex align-items-center justify-content-center text-white shadow"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
    </div>
  );
};

// Ícono personalizado para tienda
const ShopIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1IDI3LjVDMTUuODI4NCAyNy41IDE2LjUgMjYuODI4NCAxNi41IDI2VjI0LjVIMTMuNVYyNkMxMy41IDI2LjgyODQgMTQuMTcxNiAyNy41IDE1IDI3LjVaIiBmaWxsPSIjREQyRTM2Ii8+CjxwYXRoIGQ9Ik0yMSAyNkgyMUgyMUgyMVoiIGZpbGw9IiNGRjVCMzYiLz4KPHBhdGggZD0iTTkgNkg5SDIxSDIxVjI2SDlWNloiIGZpbGw9IiNGRjVCMzYiLz4KPHBhdGggZD0iTTcgOUg3SDIzSDIzVjI2SDdWOVoiIGZpbGw9IiNGRjVCMzYiLz4KPHBhdGggZD0iTTUgMTJINVYyNkg1VjEyWiIgZmlsbD0iI0ZGNUIzNiIvPgo8cGF0aCBkPSJNMjUgMTJIMjVWMjZIMjVWMTJaIiBmaWxsPSIjRkY1QjM2Ii8+CjxwYXRoIGQ9Ik0xOC41IDE2LjVMMTguNSAxNi41TDE4LjUgMTYuNUwxOC41IDE2LjVaIiBmaWxsPSIjRkY1QjM2Ii8+CjxwYXRoIGQ9Ik0xNSAxOS41QzE0LjE3MTYgMTkuNSAxMy41IDE4LjgyODQgMTMuNSAxOFYxNi41SDE2LjVWMThDMTYuNSAxOC44Mjg0IDE1LjgyODQgMTkuNSAxNSAxOS41WiIgZmlsbD0iI0ZGNUIzNiIvPgo8cGF0aCBkPSJNMTEuNSAxNi41VjE2LjVIMTguNVYxNi41IiBzdHJva2U9IiNGRjVCMzYiIHN0cm9rZS13aWR0aD0iMS41Ii8+CjxwYXRoIGQ9Ik0xMS41IDE5LjVWMTkuNUgxOC41VjE5LjUiIHN0cm9rZT0iI0ZGNUIzNiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHBhdGggZD0iTTExLjUgMTMuNVYxMy41SDE4LjVWMTMuNSIgc3Ryb2tlPSIjRkY1QjM2IiBzdHJva2Utd2lkdGg9IjEuNSIvPgo8L3N2Zz4K',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Componente de carousel de imágenes simplificado
const ImageCarousel = ({ images }) => {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-4 bg-light rounded">
        <FaStore size={32} className="text-muted mb-2" />
        <p className="text-muted mb-0">No hay imágenes disponibles</p>
      </div>
    );
  }

  return (
    <Carousel fade interval={3000} controls={images.length > 1} indicators={images.length > 1}>
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <div 
            className="d-flex justify-content-center align-items-center"
            style={{ height: '250px', overflow: 'hidden' }}
          >
            <img
              className="d-block w-100 h-100 object-fit-cover"
              src={image}
              alt={`Imagen de la tienda ${index + 1}`}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

const Map = () => {
  const history = useHistory();
  const { t, i18n } = useTranslation('map');
  
  const [mapCenter, setMapCenter] = useState([36.5, 3.5]);
  const [markerPosition, setMarkerPosition] = useState([36.5, 3.5]);
  const [shopPosition, setShopPosition] = useState(null); // 🆕 Guardar posición de la tienda
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [mapStyle, setMapStyle] = useState("street");
  
  // Obtener datos del post desde location.state
  const post = history.location.state?.postData;
  const isRTL = i18n.language === 'ar';

  // Imágenes del carousel - rutas en la carpeta public/images/
  const carouselImages = [
    '/images/shop1.jpg',
    '/images/shop2.jpg', 
    '/images/shop3.jpg',
    '/images/shop4.jpg',
    '/images/shop5.jpg'
  ];

  // Proveedores de mapas
  const mapProviders = {
    street: {
      name: t('map.street', 'Street'),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '© OpenStreetMap'
    },
    satellite: {
      name: t('map.satellite', 'Satellite'),
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: '© Esri'
    },
    terrain: {
      name: t('map.terrain', 'Terrain'),
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: '© OpenTopoMap'
    }
  };

  // Función mejorada para buscar ubicación - acepta cualquier campo disponible
  const searchLocation = async () => {
    if (!post) return;
    
    try {
      setLoading(true);
      setError(null);
      setShopPosition(null); // 🆕 Resetear posición
      
      const locationFields = [];
      
      // Prioridad 1: Wilaya + commune + address (más específico)
      if (post.wilaya) {
        let query = post.wilaya;
        if (post.commune) query += `, ${post.commune}`;
        if (post.location) query += `, ${post.location}`;
        query += ', Algeria';
        
        locationFields.push({ value: query, zoom: 14, priority: 1 });
      }
      
      // Prioridad 2: Solo wilaya + commune
      if (post.wilaya && post.commune) {
        locationFields.push({ 
          value: `${post.wilaya}, ${post.commune}, Algeria`, 
          zoom: 12, 
          priority: 2 
        });
      }
      
      // Prioridad 3: Solo wilaya
      if (post.wilaya) {
        locationFields.push({ 
          value: `${post.wilaya}, Algeria`, 
          zoom: 10, 
          priority: 3 
        });
      }
      
      // Prioridad 4: Solo commune
      if (post.commune && !post.wilaya) {
        locationFields.push({ 
          value: `${post.commune}, Algeria`, 
          zoom: 12, 
          priority: 4 
        });
      }
      
      // Prioridad 5: Solo address/location
      if (post.location && !post.wilaya && !post.commune) {
        locationFields.push({ 
          value: `${post.location}, Algeria`, 
          zoom: 14, 
          priority: 5 
        });
      }

      // Ordenar por prioridad (menor número = mayor prioridad)
      locationFields.sort((a, b) => a.priority - b.priority);

      for (const field of locationFields) {
        try {
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(field.value)}&format=json&limit=1`;
          const response = await fetch(url, { 
            headers: { 
              'User-Agent': 'ShopApp/1.0',
              'Accept-Language': i18n.language || 'en'
            } 
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lon = parseFloat(data[0].lon);
              
              setMapCenter([lat, lon]);
              setMarkerPosition([lat, lon]);
              setShopPosition({ lat, lng: lon }); // 🆕 GUARDAR POSICIÓN DE LA TIENDA
              setZoomLevel(field.zoom);
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.warn('Error searching location:', error);
          continue; // Continuar con el siguiente campo si este falla
        }
      }
      
      // Si no se encontró ninguna ubicación
      if (post.wilaya || post.commune || post.location) {
        setError(t('map.locationNotFound', 'Ubicación no encontrada para los datos proporcionados'));
      } else {
        setError(t('map.noLocationData', 'No hay datos de ubicación disponibles'));
      }
      
    } catch (error) {
      console.error('Location error:', error);
      setError(t('map.generalError', 'Error cargando la ubicación'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (post) {
      searchLocation();
    } else {
      setLoading(false);
      setError(t('map.noData', 'No hay datos de la tienda disponibles'));
    }
  }, [post, i18n.language]);

  const handleGoBack = () => {
    history.goBack();
  };

  // Función para cambiar el estilo del mapa
  const handleMapStyleChange = (style) => {
    setMapStyle(style);
  };

  if (!post) {
    return (
      <Container className="py-4">
        <Alert variant="warning" className="text-center">
          <h5>{t('map.noData', 'No hay datos de la tienda disponibles')}</h5>
          <Button variant="primary" onClick={handleGoBack} className="mt-2">
            {t('common.back', 'Atrás')}
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4" dir={isRTL ? "rtl" : "ltr"}>
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          
          {/* PRIMERA FILA: CAROUSEL DE IMÁGENES - ALTURA REDUCIDA Y SIN TEXTO */}
          <Card className="shadow-sm mb-1 border-0">
            <Card.Body className="p-0">
              <ImageCarousel images={carouselImages} />
            </Card.Body>
          </Card>

          {/* SEGUNDA FILA: INFORMACIÓN DEL USUARIO EN LÍNEA - CAMPO Y VALOR EN MISMA LÍNEA */}
          <Card className="shadow-sm mb-1 border-0">
            <Card.Body>
              <Row className={`g-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                
                {/* Propietario */}
                <Col xs={12} lg={6}>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-user mr-2"></i>
                    <div className={`d-flex align-items-center ${isRTL ? "me-3" : "ms-3"}`}>
                      <strong className="text-dark me-2">{t('user.owner', 'Dueño')}:</strong>
                      <span className="text-primary"> <strong className="ml-2">{post.user?.username || 'Propietario'}</strong>   </span>
                    </div>
                  </div>
                </Col>

                {/* Nombre de la Boutique */}
                {post.bootiquename && (
                  <Col xs={12} lg={6}>
                    <div className="d-flex align-items-center">
                      <FaStore className={`text-primary ${isRTL ? "ms-2" : "me-2 mr-2"}`} size={18} />
                      <strong className="text-dark me-2">{t('shop.boutiqueName', 'Boutique')}:</strong>
                      <span className="ml-2"> <strong>{post.bootiquename}</strong>  </span>
                    </div>
                  </Col>
                )}

                {/* Teléfono */}
                {post.phone && (
                  <Col xs={12} lg={6}>
                    <div className="d-flex align-items-center">
                      <FaPhone className={`text-success ${isRTL ? "ms-2" : "me-2 mr-2"}`} size={16} />
                      <strong className="text-dark me-2">{t('contact.phone', 'Teléfono')}:</strong>
                   <span className="ml-2"> <strong>{post.phone}</strong>  </span>
                    </div>
                  </Col>
                )}

                {/* Email */}
                {post.email && (
                  <Col xs={12} lg={6}>
                    <div className="d-flex align-items-center">
                      <FaEnvelope className={`text-danger ${isRTL ? "ms-2" : "me-2 mr-2 "}`} size={16} />
                      <strong className="text-dark me-2">{t('contact.email', 'Email')}:</strong>
                      <span className="ml-2"> <strong>{post.email}</strong>  </span>
                    </div>
                  </Col>
                )}

                {/* Wilaya */}
                {post.wilaya && (
                  <Col xs={12} lg={6}>
                    <div className="d-flex align-items-center">
                      <FaMapMarkerAlt className={`text-warning ${isRTL ? "ms-2" : "me-2 mr-2"}`} size={16} />
                      <strong className="text-dark me-2">{t('location.wilaya', 'Wilaya')}:</strong>
                      <span className="ml-2"> <strong>{post.wilaya}</strong>  </span>
                    </div>
                  </Col>
                )}

                {/* Commune */}
                {post.commune && (
                  <Col xs={12} lg={6}>
                    <div className="d-flex align-items-center">
                      <FaCity className={`text-info ${isRTL ? "ms-2" : "me-2 mr-2"}`} size={16} />
                      <strong className="text-dark me-2">{t('location.commune', 'Comuna')}:</strong>
                      <span className="ml-2"> <strong>{post.commune}</strong>  </span>
                    </div>
                  </Col>
                )}

                {/* Dirección */}
                {post.location && (
                  <Col xs={12}>
                    <div className="d-flex align-items-center">
                      <FaHome className={`text-secondary ${isRTL ? "ms-2" : "me-2 mr-2"}`} size={16} />
                      <strong className="text-dark me-2">{t('location.address', 'Dirección')}:</strong>
                      <span className="ml-2"> <strong>{post.location}</strong>  </span>
                    </div>
                  </Col>
                )}

              </Row>
            </Card.Body>
          </Card>

          {/* TERCERA FILA: MAPA CON CALCULADOR DE DISTANCIA */}
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-bottom">
              <Row className={`align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Col>
                  <h5 className="mb-0">
                    <FaGlobe className={isRTL ? "ms-2" : "me-2"} />
                    {t('map.location', 'Ubicación en el Mapa')}
                  </h5>
                  <small className="text-muted">
                    {post.wilaya && `${post.wilaya}`}
                    {post.commune && `, ${post.commune}`}
                    {post.location && `, ${post.location}`}
                  </small>
                </Col>
                <Col xs="auto">
                  <ButtonGroup size="sm">
                    {Object.keys(mapProviders).map(style => (
                      <Button
                        key={style}
                        variant={mapStyle === style ? "primary" : "outline-primary"}
                        onClick={() => handleMapStyleChange(style)}
                      >
                        {mapProviders[style].name}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Col>
              </Row>
            </Card.Header>
            
            <Card.Body className="p-0">
              {/* Estados de carga y error */}
              {loading && (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" size="lg" />
                  <p className="mt-3 fs-5">{t('map.searching', 'Buscando ubicación...')}</p>
                </div>
              )}
              
              {error && !loading && (
                <Alert variant="warning" className="m-4">
                  <div className="d-flex align-items-center">
                    <i className={`fas fa-exclamation-triangle ${isRTL ? "ms-2" : "me-2"}`}></i>
                    <div>
                      <strong>Ubicación no disponible</strong>
                      <p className="mb-0">{error}</p>
                    </div>
                  </div>
                </Alert>
              )}

              {/* Mapa - Solo mostrar si hay al menos un campo de ubicación */}
              {!loading && !error && (post.wilaya || post.commune || post.location) && (
                <>
                  <div style={{ height: '400px', width: '100%' }}>
                    <MapContainer 
                      center={mapCenter} 
                      zoom={zoomLevel} 
                      style={{ height: '100%', width: '100%' }}
                      scrollWheelZoom={true}
                      key={`${mapStyle}-${mapCenter[0]}-${mapCenter[1]}`} // Force re-render on style change
                    >
                      <ChangeView center={mapCenter} zoom={zoomLevel} />
                      <TileLayer
                        url={mapProviders[mapStyle].url}
                        attribution={mapProviders[mapStyle].attribution}
                      />
                      
                      <Marker position={markerPosition} icon={ShopIcon}>
                        <Popup>
                          <div style={{ minWidth: '250px', textAlign: isRTL ? 'right' : 'left' }}>
                            <h6 className="fw-bold text-primary mb-2">{post.bootiquename}</h6>
                            {post.wilaya && <div className="mb-1"><strong>📍 {t('location.wilaya', 'Wilaya')}:</strong> {post.wilaya}</div>}
                            {post.commune && <div className="mb-1"><strong>🏘️ {t('location.commune', 'Comuna')}:</strong> {post.commune}</div>}
                            {post.location && <div className="mb-1"><strong>🏠 {t('location.address', 'Dirección')}:</strong> {post.location}</div>}
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                  
                  {/* 🆕 COMPONENTE DE CÁLCULO DE DISTANCIA */}
                  <DistanceCalculator shopPosition={shopPosition} />
                </>
              )}
            </Card.Body>
            
            <Card.Footer className="bg-white">
              <Row className={`align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Col>
                  <small className="text-muted">
                    {t('map.usingData', 'Usando datos de')}:{' '}
                    {post.wilaya && `Wilaya: ${post.wilaya}`}
                    {post.commune && `, Comuna: ${post.commune}`}
                    {post.location && `, Dirección: ${post.location}`}
                  </small>
                </Col>
                <Col xs="auto">
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={searchLocation}
                      disabled={loading}
                    >
                      <FaSyncAlt className={isRTL ? "ms-1" : "me-1"} />
                      {t('map.reload', 'Actualizar')}
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleGoBack}
                    >
                      {t('common.back', 'Volver')}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Map;