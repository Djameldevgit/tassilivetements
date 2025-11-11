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
  const { t, i18n } = useTranslation('search');
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

  // 🔹 Estados para filtros de ropa
  const [filters, setFilters] = useState({
    category: "Vêtements",
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

  // 🔹 Arrays para selects (los mismos que en VetementsForm)
  const conditions = ['Nouveau', 'Comme neuf', 'Bon état', 'État satisfaisant'];
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '36', '38', '40', '42', '44', '46', '48', '50'];
  const allColors = ['Noir', 'Blanc', 'Rouge', 'Bleu', 'Vert', 'Jaune', 'Rose', 'Violet', 'Orange', 'Marron', 'Gris', 'Beige', 'Multicolor'];
  const materials = ['Coton', 'Polyester', 'Laine', 'Soie', 'Denim', 'Cuir', 'Synthétique', 'Linen', 'Cachemire', 'Velours'];
  const genders = ['Homme', 'Femme', 'Unisexe', 'Garçon', 'Fille', 'Bébé'];
  const seasons = ['Printemps', 'Été', 'Automne', 'Hiver', 'Toute l\'année'];

  // 🔹 Categorías y subcategorías (las mismas que en VetementsForm)
  const categories = {
    'Vêtements': {
      'Vêtements Homme': [
        'Hauts & Chemises', 'Jeans & Pantalons', 'Shorts & Pantacourts', 
        'Vestes & Gilets', 'Costumes & Blazers', 'Survetements', 'Kamiss',
        'Sous vêtements', 'Pyjamas', 'Maillots de bain', 'Casquettes & Chapeaux',
        'Chaussettes', 'Ceintures', 'Gants', 'Cravates'
      ],
      'Vêtements Femme': [
        'Hauts & Chemises', 'Jeans & Pantalons', 'Shorts & Pantacourts',
        'Vestes & Gilets', 'Ensembles', 'Abayas & Hijabs', 'Mariages & Fêtes',
        'Maternité', 'Robes', 'Jupes', 'Joggings & Survetements', 'Leggings',
        'Sous-vêtements & Lingerie', 'Pyjamas', 'Peignoirs', 'Maillots de bain',
        'Casquettes & Chapeaux', 'Chaussettes & Collants', 'Foulards & Echarpes',
        'Ceintures', 'Gants'
      ],
      'Chaussures Homme': [
        'Basquettes', 'Bottes', 'Classiques', 'Mocassins', 'Sandales', 'Tangues & Pantoufles'
      ],
      'Chaussures Femme': [
        'Basquettes', 'Sandales', 'Bottes', 'Escarpins', 'Ballerines', 'Tangues & Pantoufles'
      ],
      'Garçons': [
        'Chaussures', 'Hauts & Chemises', 'Pantalons & Shorts', 'Vestes & Gilets',
        'Costumes', 'Survetements & Joggings', 'Pyjamas', 'Sous-vêtements',
        'Maillots de bain', 'Kamiss', 'Casquettes & Chapeaux'
      ],
      'Filles': [
        'Chaussures', 'Hauts & Chemises', 'Pantalons & Shorts', 'Vestes & Gilets',
        'Robes', 'Jupes', 'Ensembles', 'Joggings & Survetements', 'Pyjamas',
        'Sous-vêtements', 'Leggings & Collants', 'Maillots de bain', 'Casquettes & Chapeaux'
      ],
      'Bébé': ['Vêtements', 'Chaussures', 'Accessoires'],
      'Tenues professionnelles': ['Tenues professionnelles'],
      'Sacs & Valises': [
        'Pochettes & Portefeuilles', 'Sacs à main', 'Sacs à dos',
        'Sacs professionnels', 'Valises', 'Cabas de sport'
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
      
      // Filtros básicos
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
      
      const res = await getDataAPI(url, auth.token);
      setResults(res.data.posts || []);
      
    } catch (err) {
      console.error("Error en búsqueda:", err);
      setError(
        err.response?.data?.message || err.message || t('errors.searchError', 'Erreur de recherche')
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
      category: "Vêtements",
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
                        {t('labels.subCategory', 'Sous-catégorie')} 
                        <i className="fas fa-tags text-info ms-1"></i>
                      </span>
                    ) : (
                      <span>
                        <i className="fas fa-tags text-info me-1"></i>
                        {t('labels.subCategory', 'Sous-catégorie')}
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
                    <option value="">{t('placeholders.allSubCategories', 'Toutes les sous-catégories')}</option>
                    {Object.keys(categories[filters.category] || {}).map(subCat => (
                      <option key={subCat} value={subCat}>{subCat}</option>
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
                        {t('labels.subSubCategory', 'Type spécifique')} 
                        <i className="fas fa-list-alt text-success ms-1"></i>
                      </span>
                    ) : (
                      <span>
                        <i className="fas fa-list-alt text-success me-1"></i>
                        {t('labels.subSubCategory', 'Type spécifique')}
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
                    <option value="">{t('placeholders.allTypes', 'Tous les types')}</option>
                    {getSubSubCategoryOptions().map(type => (
                      <option key={type} value={type}>{type}</option>
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
                    ? t('buttons.hideAdvanced', 'Masquer la recherche avancée') 
                    : t('buttons.showAdvanced', 'Recherche avancée')}
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
                            {t('labels.brand', 'Marque')} 
                            <i className="fas fa-tag text-warning ms-1"></i>
                          </span>
                        ) : (
                          <span>
                            <i className="fas fa-tag text-warning me-1"></i>
                            {t('labels.brand', 'Marque')}
                          </span>
                        )}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={t('placeholders.brand', 'Marque...')}
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
                            {t('labels.condition', 'État')} 
                            <i className="fas fa-star text-warning ms-1"></i>
                          </span>
                        ) : (
                          <span>
                            <i className="fas fa-star text-warning me-1"></i>
                            {t('labels.condition', 'État')}
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
                        <option value="">{t('placeholders.allConditions', 'Tous les états')}</option>
                        {conditions.map(condition => (
                          <option key={condition} value={condition}>{condition}</option>
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
                            {t('labels.gender', 'Genre')} 
                            <i className="fas fa-venus-mars text-info ms-1"></i>
                          </span>
                        ) : (
                          <span>
                            <i className="fas fa-venus-mars text-info me-1"></i>
                            {t('labels.gender', 'Genre')}
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
                        <option value="">{t('placeholders.allGenders', 'Tous les genres')}</option>
                        {genders.map(gender => (
                          <option key={gender} value={gender}>{gender}</option>
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
                            {t('labels.size', 'Taille')} 
                            <i className="fas fa-ruler text-primary ms-1"></i>
                          </span>
                        ) : (
                          <span>
                            <i className="fas fa-ruler text-primary me-1"></i>
                            {t('labels.size', 'Taille')}
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
                        <option value="">{t('placeholders.allSizes', 'Toutes les tailles')}</option>
                        {allSizes.map(size => (
                          <option key={size} value={size}>{size}</option>
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
                            {t('labels.color', 'Couleur')} 
                            <i className="fas fa-palette text-success ms-1"></i>
                          </span>
                        ) : (
                          <span>
                            <i className="fas fa-palette text-success me-1"></i>
                            {t('labels.color', 'Couleur')}
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
                        <option value="">{t('placeholders.allColors', 'Toutes les couleurs')}</option>
                        {allColors.map(color => (
                          <option key={color} value={color}>{color}</option>
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
                            {t('labels.material', 'Matériau')} 
                            <i className="fas fa-tshirt text-secondary ms-1"></i>
                          </span>
                        ) : (
                          <span>
                            <i className="fas fa-tshirt text-secondary me-1"></i>
                            {t('labels.material', 'Matériau')}
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
                        <option value="">{t('placeholders.allMaterials', 'Tous les matériaux')}</option>
                        {materials.map(material => (
                          <option key={material} value={material}>{material}</option>
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
                            {t('labels.season', 'Saison')} 
                            <i className="fas fa-sun text-warning ms-1"></i>
                          </span>
                        ) : (
                          <span>
                            <i className="fas fa-sun text-warning me-1"></i>
                            {t('labels.season', 'Saison')}
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
                        <option value="">{t('placeholders.allSeasons', 'Toutes les saisons')}</option>
                        {seasons.map(season => (
                          <option key={season} value={season}>{season}</option>
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
                            {t('labels.location', 'Localisation')} 
                            <i className="fas fa-map-marker-alt text-danger ms-1"></i>
                          </span>
                        ) : (
                          <span>
                            <i className="fas fa-map-marker-alt text-danger me-1"></i>
                            {t('labels.location', 'Localisation')}
                          </span>
                        )}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={t('placeholders.location', 'Ville ou wilaya...')}
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
                        {t('labels.minPrice', 'Prix Min')}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder={t('placeholders.minPrice', 'Min...')}
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
                        {t('labels.maxPrice', 'Prix Max')}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder={t('placeholders.maxPrice', 'Max...')}
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
                        {t('buttons.searching', 'Recherche...')}
                      </>
                    ) : (
                      <>
                        <i className={`fas fa-search ${isRTL ? "ms-1" : "me-1"}`}></i>
                        {t('buttons.search', 'Rechercher')}
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
                    {t('buttons.latestProducts', 'Derniers Produits')}
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
                      {t('buttons.clearAll', 'Effacer')}
                    </Button>
                  )}
                </div>
              </Col>
            </Row>

            {/* 🔹 FILTROS ACTIVOS */}
            <div className="mt-3">
              {activeFiltersCount > 0 && (
                <div className={`d-flex align-items-center flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <small className={`text-muted ${isRTL ? "ms-2" : "me-2"}`}>
                    {t('labels.activeFilters', 'Filtres actifs')}:
                  </small>
                  {filters.subCategory && (
                    <Badge bg="info" className={isRTL ? "ms-1 mb-1" : "me-1 mb-1"}>
                      Catégorie: {filters.subCategory}
                    </Badge>
                  )}
                  {filters.subSubCategory && (
                    <Badge bg="success" className={isRTL ? "ms-1 mb-1" : "me-1 mb-1"}>
                      Type: {filters.subSubCategory}
                    </Badge>
                  )}
                  {filters.brand && (
                    <Badge bg="warning" className={isRTL ? "ms-1 mb-1" : "me-1 mb-1"}>
                      Marque: {filters.brand}
                    </Badge>
                  )}
                  {filters.condition && (
                    <Badge bg="secondary" className={isRTL ? "ms-1 mb-1" : "me-1 mb-1"}>
                      État: {filters.condition}
                    </Badge>
                  )}
                  {filters.gender && (
                    <Badge bg="info" className={isRTL ? "ms-1 mb-1" : "me-1 mb-1"}>
                      Genre: {filters.gender}
                    </Badge>
                  )}
                  {filters.size && (
                    <Badge bg="primary" className={isRTL ? "ms-1 mb-1" : "me-1 mb-1"}>
                      Taille: {filters.size}
                    </Badge>
                  )}
                  {filters.color && (
                    <Badge bg="success" className={isRTL ? "ms-1 mb-1" : "me-1 mb-1"}>
                      Couleur: {filters.color}
                    </Badge>
                  )}
                  {filters.material && (
                    <Badge bg="secondary" className={isRTL ? "ms-1 mb-1" : "me-1 mb-1"}>
                      Matériau: {filters.material}
                    </Badge>
                  )}
                  {filters.season && (
                    <Badge bg="warning" className={isRTL ? "ms-1 mb-1" : "me-1 mb-1"}>
                      Saison: {filters.season}
                    </Badge>
                  )}
                  {filters.location && (
                    <Badge bg="danger" className={isRTL ? "ms-1 mb-1" : "me-1 mb-1"}>
                      Localisation: {filters.location}
                    </Badge>
                  )}
                  {filters.minPrice && (
                    <Badge bg="success" className={isRTL ? "ms-1 mb-1" : "me-1 mb-1"}>
                      Prix Min: {filters.minPrice} DZD
                    </Badge>
                  )}
                  {filters.maxPrice && (
                    <Badge bg="success" className={isRTL ? "ms-1 mb-1" : "me-1 mb-1"}>
                      Prix Max: {filters.maxPrice} DZD
                    </Badge>
                  )}
                  {filters.latest && (
                    <Badge bg="dark" className={isRTL ? "ms-1 mb-1" : "me-1 mb-1"}>
                      Derniers Produits
                    </Badge>
                  )}
                  <Badge bg="primary" className="mb-1">
                    {activeFiltersCount} {activeFiltersCount === 1 ? 'filtre' : 'filtres'}
                  </Badge>
                </div>
              )}
            </div>

          </Form>
        </Card.Body>
      </Card>

      {/* 🔹 CONTENIDO PRINCIPAL - CON RTL */}
      <Container className="py-3">
        {/* 🔹 Indicadores de Resultados */}
        {results.length > 0 && (
          <Alert variant="info" className="px-3 d-flex align-items-center mb-3">
            <i className={`fas fa-info-circle ${isRTL ? "ms-2" : "me-2"} fs-6`}></i>
            <small className="fw-semibold">
              {results.length} {results.length === 1 ? 'produit trouvé' : 'produits trouvés'}
            </small>
          </Alert>
        )}

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
                  {t('states.searching', 'Recherche...')}
                </h6>
                <small className="text-muted">{t('states.pleaseWait', 'Veuillez patienter...')}</small>
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






















