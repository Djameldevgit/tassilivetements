import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { getDataAPI } from "../utils/fetchData";
import Posts from "../components/home/Posts";
import LoadIcon from "../images/loading.gif";

import {
  Container,
  Form,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Card,
  Badge,
  Collapse,
} from "react-bootstrap";

export default function SearchPage() {
  // 🔹 CORREGIDO: Namespaces correctos
  const { t, i18n } = useTranslation(['search', 'createpost']);
  const languageReducer = useSelector(state => state.languageReducer);
  
  // 🆕 DETECCIÓN RTL
  const isRTL = i18n.language === 'ar';
  
  // 🆕 ESTADO PARA TOGGLE DE BÚSQUEDA AVANZADA
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
  useEffect(() => {
    const lang = languageReducer?.language || 'fr';
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [languageReducer?.language, i18n]);

  // 🔹 Estados para filtros de ropa - USANDO CLAVES EN INGLÉS
  const [filters, setFilters] = useState({
    category: "clothing", // Clave en inglés
    subCategory: "",    
    subSubCategory: "",
    brand: "",
    condition: "",
    gender: "",
    size: "",
    color: "",
    material: "",
    season: "",
    minPrice: "",
    maxPrice: "",
    location: "",
    latest: false       
  });

  // Estados para resultados
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const { auth } = useSelector((state) => state);

  // 🔹 Arrays para selects (claves en inglés)
  const conditions = ['new', 'like_new', 'good', 'satisfactory'];
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '36', '38', '40', '42', '44', '46', '48', '50'];
  const allColors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'pink', 'purple', 'orange', 'brown', 'gray', 'beige', 'multicolor'];
  const materials = ['cotton', 'polyester', 'wool', 'silk', 'denim', 'leather', 'synthetic', 'linen', 'cashmere', 'velvet'];
  const genders = ['man', 'woman', 'unisex', 'boy', 'girl', 'baby'];
  const seasons = ['spring', 'summer', 'autumn', 'winter', 'all_year'];

  // 🔹 CORREGIDO: Función de traducción unificada
  const translateOption = useCallback((optionKey, namespace = 'createpost', fallback = '') => {
    if (!optionKey) return fallback;
    
    console.log(`Buscando traducción: ${optionKey} en namespace: ${namespace}`);
    
    // Intentar desde createpost primero (porque tiene todas las categorías)
    let translation = t(`createpost:options.${optionKey}`, { defaultValue: '' });
    
    // Si no se encuentra en createpost, intentar en search
    if (!translation && namespace === 'search') {
      translation = t(`search:options.${optionKey}`, { defaultValue: '' });
    }
    
    // Si todavía no se encuentra, usar el fallback o la clave
    const result = translation || fallback || optionKey;
    console.log(`Resultado para ${optionKey}:`, result);
    
    return result;
  }, [t]);

  // 🔹 Categorías y subcategorías (estructura con claves en inglés - IGUAL QUE createpost)
  const categories = {
    'clothing': {
      'man_clothing': [
        'tops_shirts', 'jeans_pants', 'shorts_capris', 
        'jackets_vests', 'suits_blazers', 'sportswear', 'kamiss',
        'underwear', 'pajamas', 'swimwear', 'caps_hats',
        'socks', 'belts', 'gloves', 'ties'
      ],
      'woman_clothing': [
        'tops_shirts', 'jeans_pants', 'shorts_capris',
        'jackets_vests', 'sets', 'abayas_hijabs', 'wedding_party',
        'maternity', 'dresses', 'skirts', 'sportswear', 'leggings',
        'lingerie', 'pajamas', 'robes', 'swimwear',
        'caps_hats', 'tights', 'scarves', 'belts', 'gloves'
      ],
      'man_shoes': [
        'sneakers', 'boots', 'classic', 'moccasins', 'sandals', 'slippers'
      ],
      'woman_shoes': [
        'sneakers', 'sandals', 'boots', 'heels', 'ballet', 'slippers'
      ],
      'boys': [
        'sneakers', 'tops_shirts', 'jeans_pants', 'shorts_capris', 'jackets_vests',
        'suits_blazers', 'sportswear', 'pajamas', 'underwear',
        'swimwear', 'kamiss', 'caps_hats'
      ],
      'girls': [
        'sneakers', 'tops_shirts', 'jeans_pants', 'shorts_capris', 'jackets_vests',
        'dresses', 'skirts', 'sets', 'sportswear', 'pajamas',
        'underwear', 'leggings', 'swimwear', 'caps_hats'
      ],
      'baby': ['tops_shirts', 'sneakers', 'accessories'],
      'professional_wear': ['suits_blazers'],
      'bags_luggage': [
        'wallets', 'handbags', 'backpacks', 'professional_bags', 'suitcases', 'sport_bags'
      ]
    }
  };

  // 🔹 Buscar posts con filtros de ropa
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      
      // Filtros básicos - ENVIAR CLAVES EN INGLÉS AL BACKEND
      if (filters.subCategory.trim()) {
        queryParams.append('subCategory', filters.subCategory.trim());
      }
      
      if (filters.subSubCategory.trim()) {
        queryParams.append('subSubCategory', filters.subSubCategory.trim());
      }
      
      if (filters.brand.trim()) {
        queryParams.append('brand', filters.brand.trim());
      }
      
      if (filters.condition.trim()) {
        queryParams.append('condition', filters.condition.trim());
      }
      
      if (filters.gender.trim()) {
        queryParams.append('gender', filters.gender.trim());
      }
      
      if (filters.size.trim()) {
        queryParams.append('sizes', filters.size.trim());
      }
      
      if (filters.color.trim()) {
        queryParams.append('colors', filters.color.trim());
      }
      
      if (filters.material.trim()) {
        queryParams.append('material', filters.material.trim());
      }
      
      if (filters.season.trim()) {
        queryParams.append('season', filters.season.trim());
      }
      
      if (filters.location.trim()) {
        queryParams.append('location', filters.location.trim());
      }
      
      // Rango de precios
      if (filters.minPrice.trim()) {
        queryParams.append('minPrice', filters.minPrice.trim());
      }
      
      if (filters.maxPrice.trim()) {
        queryParams.append('maxPrice', filters.maxPrice.trim());
      }
      
      // Ordenamiento
      if (filters.latest) {
        queryParams.append('sort', '-createdAt');
      }
      
      const queryString = queryParams.toString();
      const url = `posts${queryString ? `?${queryString}` : ''}`;
      
      console.log("Buscando con filtros:", filters);
      console.log("URL:", url);
      
      const res = await getDataAPI(url, auth.token);
      setResults(res.data.posts || []);
      
    } catch (err) {
      console.error("Error en búsqueda:", err);
      setError(
        err.response?.data?.message || err.message || t('search:errors.searchError')
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Buscar últimos productos automáticamente
  const handleLatestProducts = () => {
    setFilters(prev => ({
      ...prev,
      latest: true,
      subCategory: "",
      subSubCategory: "",
      brand: "",
      condition: "",
      gender: "",
      size: "",
      color: "",
      material: "",
      season: "",
      minPrice: "",
      maxPrice: "",
      location: ""
    }));
  };

  // 🔹 Efecto para búsqueda automática de últimos productos
  useEffect(() => {
    if (filters.latest) {
      handleSearch();
    }
  }, [filters.latest]);

  // 🔹 Manejo de filtros optimizado
  const updateFilter = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      // Limpiar subSubCategory cuando cambia subCategory
      ...(field === 'subCategory' && { subSubCategory: "" })
    }));
  };

  // 🔹 Limpiar todos los filtros
  const handleClearFilters = () => {
    setFilters({
      category: "clothing",
      subCategory: "",
      subSubCategory: "",
      brand: "",
      condition: "",
      gender: "",
      size: "",
      color: "",
      material: "",
      season: "",
      minPrice: "",
      maxPrice: "",
      location: "",
      latest: false
    });
    setResults([]);
    setError(null);
    setShowAdvancedSearch(false);
  };

  // 🔹 Contador de filtros activos
  const activeFiltersCount = [
    filters.subCategory,
    filters.subSubCategory,
    filters.brand,
    filters.condition,
    filters.gender,
    filters.size,
    filters.color,
    filters.material,
    filters.season,
    filters.minPrice,
    filters.maxPrice,
    filters.location,
    filters.latest
  ].filter(Boolean).length;

  // 🔹 Obtener opciones de sub-subcategoría
  const getSubSubCategoryOptions = () => {
    if (!filters.subCategory) return [];
    return categories[filters.category]?.[filters.subCategory] || [];
  };

  return (
    <Container fluid className="px-0" dir={isRTL ? "rtl" : "ltr"}>
      {/* 🔹 BÚSQUEDA PRINCIPAL CON FILTROS - CON RTL */}
      <Card className="shadow-sm border-0 rounded-0 mb-3">
        <Card.Body className="p-3">
          <Form onSubmit={handleSearch}>
            {/* 🆕 FILA 1: CATEGORÍA Y SUBCATEGORÍA EN MISMA FILA */}
            <Row className={`g-3 align-items-stretch mb-3 ${isRTL ? 'flex-row-reverse' : ''}`} style={{ minHeight: '80px' }}>
              {/* SUBCATEGORÍA PRINCIPAL */}
              <Col xl={6} lg={6} md={6} sm={12} className="d-flex flex-column">
                <Form.Group className="h-100 d-flex flex-column">
                  <Form.Label className="small fw-semibold mb-1">
                    {isRTL ? (
                      <span>
                        {t('search:labels.subCategory')} 
                        <i className="fas fa-tags text-info ms-1"></i>
                      </span>
                    ) : (
                      <span>
                        <i className="fas fa-tags text-info me-1"></i>
                        {t('search:labels.subCategory')}
                      </span>
                    )}
                  </Form.Label>
                  <Form.Select
                    value={filters.subCategory}
                    onChange={(e) => updateFilter('subCategory', e.target.value)}
                    size="sm"
                    disabled={loading}
                    className="flex-grow-1"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    <option value="">{t('search:placeholders.allSubCategories')}</option>
                    {Object.keys(categories[filters.category] || {}).map(subCat => (
                      <option key={subCat} value={subCat}>
                        {/* 🔹 CORREGIDO: Acceso correcto a las categorías */}
                        {translateOption(`categories.${subCat}`, 'createpost')}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* SUBCATEGORÍA ESPECÍFICA */}
              <Col xl={6} lg={6} md={6} sm={12} className="d-flex flex-column">
                <Form.Group className="h-100 d-flex flex-column">
                  <Form.Label className="small fw-semibold mb-1">
                    {isRTL ? (
                      <span>
                        {t('search:labels.subSubCategory')} 
                        <i className="fas fa-list-alt text-success ms-1"></i>
                      </span>
                    ) : (
                      <span>
                        <i className="fas fa-list-alt text-success me-1"></i>
                        {t('search:labels.subSubCategory')}
                      </span>
                    )}
                  </Form.Label>
                  <Form.Select
                    value={filters.subSubCategory}
                    onChange={(e) => updateFilter('subSubCategory', e.target.value)}
                    size="sm"
                    disabled={loading || !filters.subCategory}
                    className="flex-grow-1"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    <option value="">{t('search:placeholders.allTypes')}</option>
                    {getSubSubCategoryOptions().map(type => (
                      <option key={type} value={type}>
                        {/* 🔹 CORREGIDO: Acceso correcto a las categorías */}
                        {translateOption(`categories.${type}`, 'createpost')}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* 🆕 BOTÓN PARA BÚSQUEDA AVANZADA */}
            <Row className={`mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Col>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                  className="w-100"
                >
                  <i className={`fas ${showAdvancedSearch ? 'fa-chevron-up' : 'fa-chevron-down'} ${isRTL ? 'ms-2' : 'me-2'}`}></i>
                  {showAdvancedSearch 
                    ? t('search:buttons.hideAdvanced') 
                    : t('search:buttons.showAdvanced')}
                  {activeFiltersCount > 0 && (
                    <Badge bg="primary" className={`${isRTL ? 'me-2' : 'ms-2'}`}>
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </Col>
            </Row>

            {/* 🆕 BÚSQUEDA AVANZADA - COLLAPSE */}
            <Collapse in={showAdvancedSearch}>
              <div>
                {/* FILA 2: MARCA, CONDICIÓN Y GÉNERO */}
                <Row className={`g-3 align-items-end mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {/* MARCA */}
                  <Col xl={4} lg={4} md={6} sm={12}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold mb-1">
                        {isRTL ? (
                          <span>
                            {t('search:labels.brand')} 
                            <i className="fas fa-tag text-warning ms-1"></i>
                          </span>
                        ) : (
                          <span>
                            <i className="fas fa-tag text-warning me-1"></i>
                            {t('search:labels.brand')}
                          </span>
                        )}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={t('search:placeholders.brand')}
                        value={filters.brand}
                        onChange={(e) => updateFilter('brand', e.target.value)}
                        size="sm"
                        disabled={loading}
                        dir={isRTL ? "rtl" : "ltr"}
                      />
                    </Form.Group>
                  </Col>

                  {/* CONDICIÓN */}
                  <Col xl={4} lg={4} md={6} sm={12}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold mb-1">
                        {isRTL ? (
                          <span>
                            {t('search:labels.condition')} 
                            <i className="fas fa-star text-warning ms-1"></i>
                          </span>
                        ) : (
                          <span>
                            <i className="fas fa-star text-warning me-1"></i>
                            {t('search:labels.condition')}
                          </span>
                        )}
                      </Form.Label>
                      <Form.Select
                        value={filters.condition}
                        onChange={(e) => updateFilter('condition', e.target.value)}
                        size="sm"
                        disabled={loading}
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        <option value="">{t('search:placeholders.allConditions')}</option>
                        {conditions.map(condition => (
                          <option key={condition} value={condition}>
                            {/* 🔹 CORREGIDO: Acceso correcto a las condiciones */}
                            {translateOption(`conditions.${condition}`, 'createpost')}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* GÉNERO */}
                  <Col xl={4} lg={4} md={6} sm={12}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold mb-1">
                        {isRTL ? (
                          <span>
                            {t('search:labels.gender')} 
                            <i className="fas fa-venus-mars text-info ms-1"></i>
                          </span>
                        ) : (
                          <span>
                            <i className="fas fa-venus-mars text-info me-1"></i>
                            {t('search:labels.gender')}
                          </span>
                        )}
                      </Form.Label>
                      <Form.Select
                        value={filters.gender}
                        onChange={(e) => updateFilter('gender', e.target.value)}
                        size="sm"
                        disabled={loading}
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        <option value="">{t('search:placeholders.allGenders')}</option>
                        {genders.map(gender => (
                          <option key={gender} value={gender}>
                            {/* 🔹 CORREGIDO: Acceso correcto a los géneros */}
                            {translateOption(`genders.${gender}`, 'createpost')}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {/* FILA 3: TALLA, COLOR Y MATERIAL */}
                <Row className={`g-3 align-items-end mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {/* TALLA */}
                  <Col xl={4} lg={4} md={6} sm={12}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold mb-1">
                        {isRTL ? (
                          <span>
                            {t('search:labels.size')} 
                            <i className="fas fa-ruler text-primary ms-1"></i>
                          </span>
                        ) : (
                          <span>
                            <i className="fas fa-ruler text-primary me-1"></i>
                            {t('search:labels.size')}
                          </span>
                        )}
                      </Form.Label>
                      <Form.Select
                        value={filters.size}
                        onChange={(e) => updateFilter('size', e.target.value)}
                        size="sm"
                        disabled={loading}
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        <option value="">{t('search:placeholders.allSizes')}</option>
                        {allSizes.map(size => (
                          <option key={size} value={size}>
                            {translateOption(`sizes.${size}`, 'createpost')}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* COLOR */}
                  <Col xl={4} lg={4} md={6} sm={12}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold mb-1">
                        {isRTL ? (
                          <span>
                            {t('search:labels.color')} 
                            <i className="fas fa-palette text-success ms-1"></i>
                          </span>
                        ) : (
                          <span>
                            <i className="fas fa-palette text-success me-1"></i>
                            {t('search:labels.color')}
                          </span>
                        )}
                      </Form.Label>
                      <Form.Select
                        value={filters.color}
                        onChange={(e) => updateFilter('color', e.target.value)}
                        size="sm"
                        disabled={loading}
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        <option value="">{t('search:placeholders.allColors')}</option>
                        {allColors.map(color => (
                          <option key={color} value={color}>
                            {translateOption(`colors.${color}`, 'createpost')}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* MATERIAL */}
                  <Col xl={4} lg={4} md={6} sm={12}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold mb-1">
                        {isRTL ? (
                          <span>
                            {t('search:labels.material')} 
                            <i className="fas fa-tshirt text-secondary ms-1"></i>
                          </span>
                        ) : (
                          <span>
                            <i className="fas fa-tshirt text-secondary me-1"></i>
                            {t('search:labels.material')}
                          </span>
                        )}
                      </Form.Label>
                      <Form.Select
                        value={filters.material}
                        onChange={(e) => updateFilter('material', e.target.value)}
                        size="sm"
                        disabled={loading}
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        <option value="">{t('search:placeholders.allMaterials')}</option>
                        {materials.map(material => (
                          <option key={material} value={material}>
                            {translateOption(`materials.${material}`, 'createpost')}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {/* FILA 4: TEMPORADA, UBICACIÓN Y PRECIOS */}
                <Row className={`g-3 align-items-end mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {/* TEMPORADA */}
                  <Col xl={4} lg={4} md={6} sm={12}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold mb-1">
                        {isRTL ? (
                          <span>
                            {t('search:labels.season')} 
                            <i className="fas fa-sun text-warning ms-1"></i>
                          </span>
                        ) : (
                          <span>
                            <i className="fas fa-sun text-warning me-1"></i>
                            {t('search:labels.season')}
                          </span>
                        )}
                      </Form.Label>
                      <Form.Select
                        value={filters.season}
                        onChange={(e) => updateFilter('season', e.target.value)}
                        size="sm"
                        disabled={loading}
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        <option value="">{t('search:placeholders.allSeasons')}</option>
                        {seasons.map(season => (
                          <option key={season} value={season}>
                            {translateOption(`seasons.${season}`, 'createpost')}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* UBICACIÓN */}
                  <Col xl={4} lg={4} md={6} sm={12}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold mb-1">
                        {isRTL ? (
                          <span>
                            {t('search:labels.location')} 
                            <i className="fas fa-map-marker-alt text-danger ms-1"></i>
                          </span>
                        ) : (
                          <span>
                            <i className="fas fa-map-marker-alt text-danger me-1"></i>
                            {t('search:labels.location')}
                          </span>
                        )}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={t('search:placeholders.location')}
                        value={filters.location}
                        onChange={(e) => updateFilter('location', e.target.value)}
                        size="sm"
                        disabled={loading}
                        dir={isRTL ? "rtl" : "ltr"}
                      />
                    </Form.Group>
                  </Col>

                  {/* PRECIO MÍNIMO */}
                  <Col xl={2} lg={2} md={6} sm={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold mb-1">
                        {t('search:labels.minPrice')}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder={t('search:placeholders.minPrice')}
                        value={filters.minPrice}
                        onChange={(e) => updateFilter('minPrice', e.target.value)}
                        size="sm"
                        disabled={loading}
                        min="0"
                        step="0.01"
                        dir={isRTL ? "rtl" : "ltr"}
                      />
                    </Form.Group>
                  </Col>

                  {/* PRECIO MÁXIMO */}
                  <Col xl={2} lg={2} md={6} sm={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold mb-1">
                        {t('search:labels.maxPrice')}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder={t('search:placeholders.maxPrice')}
                        value={filters.maxPrice}
                        onChange={(e) => updateFilter('maxPrice', e.target.value)}
                        size="sm"
                        disabled={loading}
                        min={filters.minPrice || "0"}
                        step="0.01"
                        dir={isRTL ? "rtl" : "ltr"}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Collapse>

            {/* 🆕 FILA 5: BOTONES DE ACCIÓN - CON RTL */}
            <Row className={`g-3 align-items-end ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Col xl={12} lg={12} md={12} sm={12}>
                <div className={`d-flex gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Button 
                    variant="primary" 
                    onClick={handleSearch}
                    className="flex-fill"
                    size="sm"
                    disabled={loading}
                    style={{ minWidth: '140px' }}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className={isRTL ? "ms-1" : "me-1"} />
                        {t('search:buttons.searching')}
                      </>
                    ) : (
                      <>
                        <i className={`fas fa-search ${isRTL ? "ms-1" : "me-1"}`}></i>
                        {t('search:buttons.search')}
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleLatestProducts}
                    size="sm"
                    disabled={loading || filters.latest}
                    style={{ minWidth: '120px' }}
                  >
                    <i className={`fas fa-clock ${isRTL ? "ms-1" : "me-1"}`}></i>
                    {t('search:buttons.latestProducts')}
                  </Button>
                  
                  {activeFiltersCount > 0 && (
                    <Button 
                      variant="outline-danger" 
                      onClick={handleClearFilters}
                      size="sm"
                      disabled={loading}
                      style={{ minWidth: '100px' }}
                    >
                      <i className={`fas fa-times ${isRTL ? "ms-1" : "me-1"}`}></i>
                      {t('search:buttons.clearAll')}
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* 🔹 CONTENIDO PRINCIPAL - CON RTL */}
      <Container>
        {error && (
          <Alert variant="danger" className="px-3 d-flex align-items-center mb-3">
            <i className={`fas fa-exclamation-triangle ${isRTL ? "ms-2" : "me-2"} fs-6`}></i>
            <small>{error}</small>
          </Alert>
        )}

        {/* 🔹 Lista de Posts */}
        <div className="">
          {loading ? (
            <Card className="text-center">
              <Card.Body className="p-3">
                <img src={LoadIcon} alt="loading" width="40" className="mb-2" />
                <h6 className="text-muted mb-1">
                  {t('search:states.searching')}
                </h6>
                <small className="text-muted">{t('search:states.pleaseWait')}</small>
              </Card.Body>
            </Card>
          ) : (
            <Posts posts={results.length > 0 ? results : null} filters={filters} />
          )}
        </div>
      </Container>
    </Container>
  );
}