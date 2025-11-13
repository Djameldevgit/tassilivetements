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
  Badge
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
  FaIdCard
} from "react-icons/fa";

// Avatar component mejorado
const Avatar = ({ user, size = 100 }) => {
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

const map = () => {
  const history = useHistory();
  const { t, i18n } = useTranslation('map');
  
  const [mapCenter, setMapCenter] = useState([36.5, 3.5]);
  const [markerPosition, setMarkerPosition] = useState([36.5, 3.5]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [mapStyle, setMapStyle] = useState("street");
  
  // Obtener datos del post desde location.state
  const post = history.location.state?.postData;
  const isRTL = i18n.language === 'ar';

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

  // Buscar ubicación
  const searchLocation = async () => {
    if (!post) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const locationFields = [];
      
      // Combinar wilaya + commune + address
      if (post.wilaya) {
        let query = post.wilaya;
        if (post.commune) query += `, ${post.commune}`;
        if (post.location) query += `, ${post.location}`;
        query += ', Algeria';
        
        locationFields.push({ value: query, zoom: 14 });
      }
      
      // Solo wilaya
      if (post.wilaya && !post.commune) {
        locationFields.push({ value: `${post.wilaya}, Algeria`, zoom: 10 });
      }
      
      // Solo commune
      if (post.commune && !post.wilaya) {
        locationFields.push({ value: `${post.commune}, Algeria`, zoom: 12 });
      }

      for (const field of locationFields) {
        try {
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(field.value)}&format=json&limit=1`;
          const response = await fetch(url, { headers: { 'User-Agent': 'ShopApp/1.0' } });
          
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lon = parseFloat(data[0].lon);
              
              setMapCenter([lat, lon]);
              setMarkerPosition([lat, lon]);
              setZoomLevel(field.zoom);
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.warn('Error searching location:', error);
        }
      }
      
      setError(t('map.locationNotFound', 'Location not found'));
      
    } catch (error) {
      console.error('Location error:', error);
      setError(t('map.generalError', 'Error loading location'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (post) {
      searchLocation();
    } else {
      setLoading(false);
      setError(t('map.noData', 'No shop data available'));
    }
  }, [post]);

  const handleGoBack = () => {
    history.goBack();
  };

  if (!post) {
    return (
      <Container className="py-4">
        <Alert variant="warning" className="text-center">
          <h5>{t('map.noData', 'No shop data available')}</h5>
          <Button variant="primary" onClick={handleGoBack} className="mt-2">
            {t('common.back', 'Back')}
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4" dir={isRTL ? "rtl" : "ltr"}>
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          
          {/* PRIMERA FILA: AVATAR Y NOMBRE PRINCIPAL */}
          <Card className="shadow-sm mb-4 border-0 bg-light">
            <Card.Body className="text-center p-4">
              <Row className={`align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Col>
                  {/* Avatar grande centrado */}
                  <div className="mb-3">
                    <Avatar user={post.user} size={120} />
                  </div>
                  
                  {/* Nombre de la boutique */}
                  {post.bootiquename && (
                    <div className="mb-2">
                      <h2 className="text-primary fw-bold">
                        <FaStore className={isRTL ? "ms-3" : "me-3"} />
                        {post.bootiquename}
                      </h2>
                      <Badge bg="outline-primary" className="fs-6">
                        {t('shop.boutique', 'Boutique')}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Username del propietario */}
                  {post.user?.username && (
                    <div className="mb-3">
                      <h5 className="text-muted">
                        <FaUser className={isRTL ? "ms-2" : "me-2"} />
                        {post.user.username}
                      </h5>
                      <small className="text-muted">{t('user.owner', 'Propriétaire')}</small>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* SEGUNDA FILA: INFORMACIÓN DETALLADA - CADA CAMPO EN SU FILA */}
          <Card className="shadow-sm mb-4 border-0">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">
                <FaIdCard className={isRTL ? "ms-2" : "me-2"} />
                {t('shop.information', 'Informations de la boutique')}
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              
              {/* Wilaya - Fila individual */}
              {post.wilaya && (
                <div className={`border-bottom p-3 ${isRTL ? 'text-right' : ''}`}>
                  <Row className={`align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Col xs={12} md={4}>
                      <div className="d-flex align-items-center">
                        <FaMapMarkerAlt className={`text-success ${isRTL ? "ms-2" : "me-2"}`} size={20} />
                        <strong className="text-dark">{t('location.wilaya', 'Wilaya')}</strong>
                      </div>
                    </Col>
                    <Col xs={12} md={8}>
                      <span className="fs-5 text-dark">{post.wilaya}</span>
                    </Col>
                  </Row>
                </div>
              )}
              
              {/* Commune - Fila individual */}
              {post.commune && (
                <div className={`border-bottom p-3 ${isRTL ? 'text-right' : ''}`}>
                  <Row className={`align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Col xs={12} md={4}>
                      <div className="d-flex align-items-center">
                        <FaCity className={`text-info ${isRTL ? "ms-2" : "me-2"}`} size={20} />
                        <strong className="text-dark">{t('location.commune', 'Commune')}</strong>
                      </div>
                    </Col>
                    <Col xs={12} md={8}>
                      <span className="fs-5 text-dark">{post.commune}</span>
                    </Col>
                  </Row>
                </div>
              )}
              
              {/* Address - Fila individual */}
              {post.location && (
                <div className={`border-bottom p-3 ${isRTL ? 'text-right' : ''}`}>
                  <Row className={`align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Col xs={12} md={4}>
                      <div className="d-flex align-items-center">
                        <FaHome className={`text-warning ${isRTL ? "ms-2" : "me-2"}`} size={20} />
                        <strong className="text-dark">{t('location.address', 'Adresse')}</strong>
                      </div>
                    </Col>
                    <Col xs={12} md={8}>
                      <span className="fs-5 text-dark">{post.location}</span>
                    </Col>
                  </Row>
                </div>
              )}
              
              {/* Teléfono - Fila individual */}
              {post.phone && (
                <div className={`border-bottom p-3 ${isRTL ? 'text-right' : ''}`}>
                  <Row className={`align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Col xs={12} md={4}>
                      <div className="d-flex align-items-center">
                        <FaPhone className={`text-primary ${isRTL ? "ms-2" : "me-2"}`} size={20} />
                        <strong className="text-dark">{t('contact.phone', 'Téléphone')}</strong>
                      </div>
                    </Col>
                    <Col xs={12} md={8}>
                      <span className="fs-5 text-dark">{post.phone}</span>
                    </Col>
                  </Row>
                </div>
              )}
              
              {/* Email - Fila individual */}
              {post.email && (
                <div className={`p-3 ${isRTL ? 'text-right' : ''}`}>
                  <Row className={`align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Col xs={12} md={4}>
                      <div className="d-flex align-items-center">
                        <FaEnvelope className={`text-danger ${isRTL ? "ms-2" : "me-2"}`} size={20} />
                        <strong className="text-dark">{t('contact.email', 'Email')}</strong>
                      </div>
                    </Col>
                    <Col xs={12} md={8}>
                      <span className="fs-5 text-dark">{post.email}</span>
                    </Col>
                  </Row>
                </div>
              )}
              
            </Card.Body>
          </Card>

          {/* TERCERA FILA: MAPA */}
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-bottom">
              <Row className={`align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Col>
                  <h5 className="mb-0">
                    <FaGlobe className={isRTL ? "ms-2" : "me-2"} />
                    {t('map.location', 'Localisation sur la carte')}
                  </h5>
                </Col>
                <Col xs="auto">
                  <ButtonGroup size="sm">
                    {Object.keys(mapProviders).map(style => (
                      <Button
                        key={style}
                        variant={mapStyle === style ? "primary" : "outline-primary"}
                        onClick={() => setMapStyle(style)}
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
                  <p className="mt-3 fs-5">{t('map.searching', 'Recherche de la localisation...')}</p>
                </div>
              )}
              
              {error && !loading && (
                <Alert variant="warning" className="m-4">
                  <i className={`fas fa-exclamation-triangle ${isRTL ? "ms-2" : "me-2"}`}></i>
                  {error}
                </Alert>
              )}

              {/* Mapa */}
              {!loading && !error && (
                <div style={{ height: '400px', width: '100%' }}>
                  <MapContainer 
                    center={mapCenter} 
                    zoom={zoomLevel} 
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
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
                          {post.commune && <div className="mb-1"><strong>🏘️ {t('location.commune', 'Commune')}:</strong> {post.commune}</div>}
                          {post.location && <div className="mb-1"><strong>🏠 {t('location.address', 'Adresse')}:</strong> {post.location}</div>}
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </Card.Body>
            
            <Card.Footer className="bg-white">
              <Row className={`align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Col>
                  <small className="text-muted">
                    {post.wilaya && `${post.wilaya}`}
                    {post.commune && `, ${post.commune}`}
                    {post.location && `, ${post.location}`}
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
                      {t('map.reload', 'Actualiser')}
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleGoBack}
                    >
                      {t('common.back', 'Retour')}
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

export default map;