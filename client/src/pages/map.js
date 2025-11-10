import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Container, Row, Col, Card, Button, ButtonGroup, Alert, Spinner, Badge } from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";
import L from "leaflet";
import { useTranslation } from "react-i18next";
import "leaflet/dist/leaflet.css";

// Fix para los íconos de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.Icon.Default.extend({
  options: {
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }
});

L.Marker.prototype.options.icon = new DefaultIcon();

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const Map = ({ post: postProp }) => {
  const location = useLocation();
  const history = useHistory();
  const { t, i18n } = useTranslation('map');
  
  // 🆕 DETECCIÓN RTL
  const isRTL = i18n.language === 'ar';
  
  const [mapCenter, setMapCenter] = useState([36.5, 3.5]);
  const [markerPosition, setMarkerPosition] = useState([36.5, 3.5]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [mapStyle, setMapStyle] = useState("street");
  const [usedField, setUsedField] = useState(null);
  
  // Obtener post de múltiples fuentes
  const getPostData = () => {
    if (postProp) return postProp;
    if (location.state?.postData) return location.state.postData;
    if (location.state?.post) return location.state.post;
    return null;
  };

  const post = getPostData();

  // Proveedores de mapas
  const mapProviders = {
    street: {
      name: t('map.streetView', 'Vue Rue'),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
    satellite: {
      name: t('map.satelliteView', 'Vue Satellite'),
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: '&copy; <a href="https://www.arcgis.com/">Esri</a>'
    },
    terrain: {
      name: t('map.terrainView', 'Vue Terrain'),
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
    }
  };

  // 🔥 CORRECCIÓN: Agregar traducciones faltantes directamente
  const getTranslatedText = (key, fallback) => {
    return t(key, fallback);
  };

  // FUNCIÓN: Obtener todos los campos de ubicación posibles
  const getLocationFields = () => {
    if (!post) {
      console.log("No post data available");
      return [];
    }
    
    console.log("Available post data for mapping:", post);
    
    const locationFields = [];
    
    // PRIORIDAD 1: DESTINACION (Campo fundamental para todas las categorías)
    if (post.destinacion && post.destinacion.trim() !== "") {
      locationFields.push({
        field: 'destinacion',
        value: post.destinacion,
        label: getTranslatedText('map.destination', 'Destination'),
        priority: 1,
        zoom: 12
      });
    }
    
    // PRIORIDAD 2: CAMPOS DE HAJJ & OMRA (Específicos)
    if (post.hotelMeca && post.hotelMeca.trim() !== "") {
      locationFields.push({
        field: 'hotelMeca',
        value: `${post.hotelMeca}, Mecca, Saudi Arabia`,
        label: getTranslatedText('map.hotelMeca', 'Hôtel à La Mecque'),
        priority: 2,
        zoom: 16
      });
    }
    
    if (post.hotelMedina && post.hotelMedina.trim() !== "") {
      locationFields.push({
        field: 'hotelMedina',
        value: `${post.hotelMedina}, Medina, Saudi Arabia`,
        label: getTranslatedText('map.hotelMedina', 'Hôtel à Médine'),
        priority: 2,
        zoom: 16
      });
    }
    
    // PRIORIDAD 3: CAMPOS GENERALES DE HOTELES
    if (post.nombreHotel && post.nombreHotel.trim() !== "") {
      let query = post.nombreHotel;
      
      if (post.ciudadHotel && post.ciudadHotel.trim() !== "") {
        query += `, ${post.ciudadHotel}`;
      }
      else if (post.destinacion && post.destinacion.trim() !== "" && 
               post.destinacion !== post.nombreHotel) {
        query += `, ${post.destinacion}`;
      }
      
      if (!query.includes('Algeria') && !query.includes('Arabie') && !query.includes('Saudi')) {
        query += ', Algeria';
      }
      
      locationFields.push({
        field: 'nombreHotel',
        value: query,
        label: getTranslatedText('map.hotelName', 'Nom de l\'hôtel'),
        priority: 3,
        zoom: 16
      });
    }
    
    if (post.ciudadHotel && post.ciudadHotel.trim() !== "") {
      locationFields.push({
        field: 'ciudadHotel',
        value: `${post.ciudadHotel}, Algeria`,
        label: getTranslatedText('map.city', 'Ville'),
        priority: 3,
        zoom: 14
      });
    }
    
    // PRIORIDAD 4: CAMPOS DE UBICACIÓN DETALLADA
    if (post.zonaRegion && post.zonaRegion.trim() !== "") {
      locationFields.push({
        field: 'zonaRegion',
        value: `${post.zonaRegion}, Algeria`,
        label: getTranslatedText('map.zoneRegion', 'Zone/Région'),
        priority: 4,
        zoom: 12
      });
    }
    
    if (post.direccionHotel && post.direccionHotel.trim() !== "") {
      let query = post.direccionHotel;
      
      if (post.ciudadHotel && post.ciudadHotel.trim() !== "") {
        query += `, ${post.ciudadHotel}`;
      } else if (post.destinacion && post.destinacion.trim() !== "") {
        query += `, ${post.destinacion}`;
      }
      
      query += ', Algeria';
      
      locationFields.push({
        field: 'direccionHotel',
        value: query,
        label: getTranslatedText('map.address', 'Adresse'),
        priority: 4,
        zoom: 17
      });
    }

    console.log("Location fields found:", locationFields);
    return locationFields.sort((a, b) => a.priority - b.priority);
  };

  // FUNCIÓN MEJORADA: Buscar ubicación
  const searchLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsedField(null);
      
      const locationFields = getLocationFields();
      
      if (locationFields.length === 0) {
        setError(getTranslatedText('map.noLocationData', 'Aucune donnée de localisation disponible.'));
        setLoading(false);
        return;
      }

      console.log('Trying location fields in order:', locationFields);

      for (const locationField of locationFields) {
        try {
          console.log(`🔍 Searching with: ${locationField.field} = "${locationField.value}"`);
          
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            locationField.value
          )}&format=json&addressdetails=1&limit=1`;
          
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'TravelAgencyApp/1.0'
            }
          });
          
          if (!response.ok) {
            console.warn(`❌ Response not OK for ${locationField.field}`);
            continue;
          }
          
          const data = await response.json();
          console.log(`📡 API response for ${locationField.field}:`, data);

          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            
            setMapCenter([lat, lon]);
            setMarkerPosition([lat, lon]);
            setZoomLevel(locationField.zoom);
            setUsedField(locationField);
            
            console.log(`✅ Location found with: ${locationField.field}`);
            setLoading(false);
            return;
          } else {
            console.warn(`❌ No results for: ${locationField.field}`);
          }
        } catch (error) {
          console.warn(`⚠️ Error with ${locationField.field}:`, error);
        }
      }
      
      console.warn('❌ No location found with any field');
      setError(getTranslatedText('map.locationNotFound', 'Localisation non trouvée. Affichage de la carte par défaut.'));
      
    } catch (error) {
      console.error("💥 General location error:", error);
      setError(getTranslatedText('map.generalError', 'Erreur lors du chargement de la localisation.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🗺️ PropertyMap mounted with post:", post);
    
    if (post) {
      searchLocation();
    } else {
      setLoading(false);
      setError(getTranslatedText('map.noPostData', 'Aucune donnée de publication disponible.'));
    }
  }, [post]);

  // Función para volver atrás
  const handleGoBack = () => {
    history.goBack();
  };

  // Para evitar errores de SSR
  if (typeof window === 'undefined') {
    return (
      <Container className="my-4">
        <Row>
          <Col>
            <Alert variant="info">
              {getTranslatedText('map.loading', 'Chargement de la carte...')}
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4" dir={isRTL ? "rtl" : "ltr"}>
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          {/* Header con información - CON RTL */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <Row className={`align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Col>
                  <h4 className="mb-0">
                    {/* 🆕 ICONO RTL */}
                    {isRTL ? (
                      <span>
                        {getTranslatedText('map.locationTitle', 'Localisation sur la Carte')}
                        <i className="fas fa-map-marked-alt ms-2"></i>
                      </span>
                    ) : (
                      <span>
                        <i className="fas fa-map-marked-alt me-2"></i>
                        {getTranslatedText('map.locationTitle', 'Localisation sur la Carte')}
                      </span>
                    )}
                  </h4>
                  {post?.title && (
                    <small className="opacity-75">{post.title}</small>
                  )}
                </Col>
                <Col xs="auto">
                  <Button 
                    variant="light" 
                    size="sm" 
                    onClick={handleGoBack}
                  >
                    {/* 🆕 ICONO RTL */}
                    {isRTL ? (
                      <span>
                        {getTranslatedText('common.back', 'Retour')}
                        <i className="fas fa-arrow-left ms-1"></i>
                      </span>
                    ) : (
                      <span>
                        <i className="fas fa-arrow-left me-1"></i>
                        {getTranslatedText('common.back', 'Retour')}
                      </span>
                    )}
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            
            <Card.Body style={{ textAlign: isRTL ? 'right' : 'left' }}>
              {/* Información de ubicación - CON RTL */}
              {post && (
                <Row className={`mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Col md={6}>
                    <h6 className="text-muted">
                      {getTranslatedText('map.destinationInfo', 'Informations de destination')}:
                    </h6>
                    
                    {/* Destinación principal */}
                    {post.destinacion && (
                      <p className="mb-1">
                        <strong>🎯 {getTranslatedText('map.destination', 'Destination')}:</strong> {post.destinacion}
                      </p>
                    )}
                    
                    {/* Campo usado para la búsqueda */}
                    {usedField && (
                      <p className="mb-1">
                        <strong>📍 {getTranslatedText('map.usedForSearch', 'Utilisé pour la recherche')}:</strong> {usedField.label}
                      </p>
                    )}
                    
                    {/* Información de hoteles */}
                    {(post.nombreHotel || post.ciudadHotel) && (
                      <div className="mt-2 p-2 bg-light rounded">
                        <small>
                          {post.nombreHotel && (
                            <div>
                              <strong>🏨 {getTranslatedText('map.hotelName', 'Hôtel')}:</strong> {post.nombreHotel}
                            </div>
                          )}
                          {post.ciudadHotel && (
                            <div>
                              <strong>🏙️ {getTranslatedText('map.city', 'Ville')}:</strong> {post.ciudadHotel}
                            </div>
                          )}
                        </small>
                      </div>
                    )}
                  </Col>
                  
                  <Col md={6}>
                    <h6 className="text-muted">
                      {getTranslatedText('map.availableFields', 'Champs disponibles')}:
                    </h6>
                    <div className={`d-flex flex-wrap gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {getLocationFields().map((field, index) => (
                        <Badge 
                          key={index} 
                          bg={usedField?.field === field.field ? "success" : "outline-secondary"} 
                          className={`mb-1 ${isRTL ? 'ms-1' : 'me-1'}`}
                        >
                          {field.label}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Campos específicos de Hajj & Omra */}
                    {(post.hotelMeca || post.hotelMedina) && (
                      <div className="mt-2 p-2 bg-warning bg-opacity-10 rounded">
                        <small className="text-muted">
                          <strong>🕋 Hajj & Omra:</strong>
                          {post.hotelMeca && ` ${getTranslatedText('map.hotelMeca', 'Mecque')}: ${post.hotelMeca}`}
                          {post.hotelMedina && ` ${getTranslatedText('map.hotelMedina', 'Médine')}: ${post.hotelMedina}`}
                        </small>
                      </div>
                    )}
                  </Col>
                </Row>
              )}

              {/* Controles del mapa - CON RTL */}
              <Row className={`align-items-center mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Col>
                  <ButtonGroup size="sm" className={isRTL ? 'flex-row-reverse' : ''}>
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
                <Col xs="auto">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={searchLocation}
                    disabled={loading}
                  >
                    {/* 🆕 ICONO RTL */}
                    {isRTL ? (
                      <span>
                        {getTranslatedText('map.reload', 'Actualiser')}
                        <i className="fas fa-sync-alt ms-1"></i>
                      </span>
                    ) : (
                      <span>
                        <i className="fas fa-sync-alt me-1"></i>
                        {getTranslatedText('map.reload', 'Actualiser')}
                      </span>
                    )}
                  </Button>
                </Col>
              </Row>

              {/* Estados de carga y error - CON RTL */}
              {loading && (
                <Alert variant="info" className={`d-flex align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Spinner animation="border" size="sm" className={isRTL ? "ms-2" : "me-2"} />
                  {getTranslatedText('map.searchingLocation', 'Recherche de la localisation...')}
                </Alert>
              )}
              
              {error && (
                <Alert variant="warning" className={isRTL ? 'text-right' : ''}>
                  <i className={`fas fa-exclamation-triangle ${isRTL ? 'ms-2' : 'me-2'}`}></i>
                  {error}
                </Alert>
              )}
            </Card.Body>
          </Card>

          {/* Mapa */}
          <Card className="shadow-sm">
            <div style={{ height: '60vh', width: '100%', position: 'relative' }}>
              <MapContainer 
                center={mapCenter} 
                zoom={zoomLevel} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                doubleClickZoom={true}
                zoomControl={true}
                key={mapStyle}
              >
                <ChangeView center={mapCenter} zoom={zoomLevel} />
                <TileLayer
                  url={mapProviders[mapStyle].url}
                  attribution={mapProviders[mapStyle].attribution}
                />
                
                {!loading && !error && (
                  <Marker position={markerPosition}>
                    <Popup>
                      <div style={{ 
                        minWidth: '250px',
                        direction: isRTL ? 'rtl' : 'ltr',
                        textAlign: isRTL ? 'right' : 'left'
                      }}>
                        <h6 className="fw-bold">
                          {post?.destinacion || getTranslatedText('map.unnamedLocation', 'Destination')}
                        </h6>
                        <hr className="my-2" />
                        
                        {usedField && (
                          <p className="mb-2">
                            <strong>{usedField.label}:</strong><br />
                            {usedField.value}
                          </p>
                        )}
                        
                        <div className="mt-2 p-2 bg-light rounded">
                          <small className="text-muted">
                            {post?.nombreHotel && (
                              <div>
                                <strong>🏨 {getTranslatedText('map.hotelName', 'Hôtel')}:</strong> {post.nombreHotel}
                              </div>
                            )}
                            
                            {post?.ciudadHotel && (
                              <div>
                                <strong>🏙️ {getTranslatedText('map.city', 'Ville')}:</strong> {post.ciudadHotel}
                              </div>
                            )}
                            
                            {post?.direccionHotel && (
                              <div>
                                <strong>📫 {getTranslatedText('map.address', 'Adresse')}:</strong> {post.direccionHotel}
                              </div>
                            )}
                            
                            {(post?.hotelMeca || post?.hotelMedina) && (
                              <div className="mt-1 pt-1 border-top">
                                <strong>🕋 Hajj & Omra:</strong>
                                {post.hotelMeca && (
                                  <div>• {getTranslatedText('map.hotelMeca', 'Mecque')}: {post.hotelMeca}</div>
                                )}
                                {post.hotelMedina && (
                                  <div>• {getTranslatedText('map.hotelMedina', 'Médine')}: {post.hotelMedina}</div>
                                )}
                              </div>
                            )}
                          </small>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Map;