import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaSave, FaTimes, FaTag, FaMapMarkerAlt, FaPhone, FaImage } from 'react-icons/fa';

// 🔷 COMPONENTE DE SUBIDA DE IMÁGENES
import ImageUpload from '../components/forms/ImageUpload';

// 🔷 REDUX Y DATOS
import { createPost, updatePost } from '../redux/actions/postAction';

const getInitialState = () => ({
  category: "clothing",
  bootiquename: "",
  subCategory: "",
  subSubCategory: "",
  title: "",
  description: "",
  content: "", // 🔥 AGREGAR para compatibilidad
  price: "",
  currency: 'DZD',
  brand: "",
  condition: 'new',
  sizes: [],
  colors: [],
  material: "",
  gender: "",
  season: 'all_year',
  wilaya: "",
  commune: "",
  location: "",
  phone: "",
  email: "",
  tags: []
});
// Arrays para selects
const conditions = ['new', 'like_new', 'good', 'satisfactory'];
const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '36', '38', '40', '42', '44', '46', '48', '50'];
const allColors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'pink', 'purple', 'orange', 'brown', 'gray', 'beige', 'multicolor'];
const materials = ['cotton', 'polyester', 'wool', 'silk', 'denim', 'leather', 'synthetic', 'linen', 'cashmere', 'velvet'];
const genders = ['man', 'woman', 'unisex', 'boy', 'girl', 'baby'];
const seasons = ['spring', 'summer', 'autumn', 'winter', 'all_year'];
const wilayas = ['algiers', 'oran', 'constantine', 'annaba', 'blida', 'batna', 'djelfa', 'setif', 'sidi_bel_abbes', 'biskra', 'tebessa', 'el_oued', 'skikda', 'tiaret', 'bejaia', 'tlemcen', 'ouargla', 'mostaganem', 'bordj_bou_arreridj', 'chlef', 'souk_ahras', 'medea', 'el_tarf', 'ain_defla', 'naama', 'ain_temouchent', 'ghardaia', 'relizane'];

const CreatePost = () => {
  const { auth, theme, languageReducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { t, i18n } = useTranslation('createpost');

  const isEdit = location.state?.isEdit || false;
  const postToEdit = location.state?.postData || null;
  const isRTL = i18n.language === 'ar';

  const [postData, setPostData] = useState(getInitialState);
  const [images, setImages] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("info");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

 







  // 🔥 ESTRUCTURA DE CATEGORÍAS REACTIVA - CORREGIDA
  const categoriesStructure = useMemo(() => ({
    clothing: {
      man_clothing: [
        'tops_shirts', 'jeans_pants', 'shorts_capris', 'jackets_vests', 
        'suits_blazers', 'sportswear', 'kamiss', 'underwear', 'pajamas', 
        'swimwear', 'caps_hats', 'socks', 'belts', 'gloves', 'ties'
      ],
      woman_clothing: [
        'tops_shirts', 'jeans_pants', 'shorts_capris', 'jackets_vests', 
        'sets', 'abayas_hijabs', 'wedding_party', 'maternity', 'dresses', 
        'skirts', 'sportswear', 'leggings', 'lingerie', 'pajamas', 'robes', 
        'swimwear', 'caps_hats', 'tights', 'scarves', 'belts', 'gloves'
      ],
      man_shoes: ['sneakers', 'boots', 'classic', 'moccasins', 'sandals', 'slippers'],
      woman_shoes: ['sneakers', 'sandals', 'boots', 'heels', 'ballet', 'slippers'],
      boys: [
        'sneakers', 'tops_shirts', 'jeans_pants', 'shorts_capris', 'jackets_vests',
        'suits_blazers', 'sportswear', 'pajamas', 'underwear', 'swimwear', 'kamiss', 'caps_hats'
      ],
      girls: [
        'sneakers', 'tops_shirts', 'jeans_pants', 'shorts_capris', 'jackets_vests',
        'dresses', 'skirts', 'sets', 'sportswear', 'pajamas', 'underwear', 'leggings', 'swimwear', 'caps_hats'
      ],
      baby: ['tops_shirts', 'sneakers', 'accessories'],
      professional_wear: ['suits_blazers'],
      bags_luggage: ['wallets', 'handbags', 'backpacks', 'professional_bags', 'suitcases', 'sport_bags']
    }
  }), []);

  // 🔥 ESTILOS RESPONSIVE
  const styles = useMemo(() => ({
    container: {
      padding: '8px',
      maxWidth: '100%',
      overflowX: 'hidden',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    },
    card: {
      border: 'none',
      borderRadius: '12px',
      marginBottom: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      width: '100%'
    },
    cardHeader: {
      backgroundColor: '#ffffff',
      border: 'none',
      padding: '12px 16px',
      borderBottom: '1px solid #e9ecef'
    },
    cardBody: {
      padding: '16px'
    },
    formLabel: {
      fontWeight: '600',
      fontSize: '14px',
      marginBottom: '6px',
      color: '#2d3748',
      display: 'block'
    },
    formControl: {
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '16px',
      padding: '12px 14px',
      height: '48px',
      transition: 'all 0.2s ease',
      backgroundColor: '#ffffff',
      width: '100%',
      minWidth: '0'
    },
    textarea: {
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '16px',
      padding: '12px 14px',
      minHeight: '100px',
      resize: 'vertical',
      transition: 'all 0.2s ease',
      width: '100%'
    },
    button: {
      borderRadius: '8px',
      padding: '14px',
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      transition: 'all 0.2s ease',
      height: '52px',
      width: '100%'
    },
    checkboxGroup: {
      marginBottom: '8px',
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb'
    },
    alert: {
      borderRadius: '8px',
      marginBottom: '12px',
      fontSize: '14px',
      border: 'none',
      padding: '12px'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#2d3748',
      marginBottom: '0'
    },
    icon: {
      marginRight: isRTL ? '0' : '6px',
      marginLeft: isRTL ? '6px' : '0',
      fontSize: '16px'
    }
  }), [isRTL]);

  // 🔥 FUNCIÓN DE TRADUCCIÓN
  const translateOption = useCallback((optionKey, fallback = '') => {
    if (!optionKey) return fallback;
    const translation = t(`options.${optionKey}`, { defaultValue: '' });
    return translation || fallback || optionKey;
  }, [t]);

  // 🔥 FUNCIONES PARA OBTENER OPCIONES DE CATEGORÍAS
  const getSubCategoryOptions = useCallback(() => {
    if (!postData.category) return [];
    return Object.keys(categoriesStructure[postData.category] || {});
  }, [postData.category, categoriesStructure]);

  const getSubSubCategoryOptions = useCallback(() => {
    if (!postData.subCategory) return [];
    return categoriesStructure[postData.category]?.[postData.subCategory] || [];
  }, [postData.category, postData.subCategory, categoriesStructure]);

  // 🔥 EFFECT PARA IDIOMA
  useEffect(() => {
    const lang = languageReducer?.language || 'fr';
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [languageReducer?.language, i18n]);

  useEffect(() => {
    if (isEdit && postToEdit) {
      const sanitizedData = sanitizePostData(postToEdit);
      
      const finalPostData = {
        ...getInitialState(),
        ...sanitizedData,
        category: sanitizedData.category || "clothing",
        subCategory: sanitizedData.subCategory || "",
        subSubCategory: sanitizedData.subSubCategory || "",
        // 🔥 MANTENER COMPATIBILIDAD
        description: sanitizedData.description || sanitizedData.content || "",
        content: sanitizedData.content || sanitizedData.description || "", // Agregar
        title: sanitizedData.title || "",
        bootiquename: sanitizedData.bootiquename || "",
        sizes: Array.isArray(sanitizedData.sizes) ? sanitizedData.sizes : [],
        colors: Array.isArray(sanitizedData.colors) ? sanitizedData.colors : [],
      };
  
      setPostData(finalPostData);
      setSelectedSizes(Array.isArray(finalPostData.sizes) ? finalPostData.sizes : []);
      setSelectedColors(Array.isArray(finalPostData.colors) ? finalPostData.colors : []);
  
      // ... resto del código
    }
  }, [isEdit, postToEdit]);

  const sanitizePostData = useCallback((data) => {
    if (!data) return {};
    return { ...data };
  }, []);

  // 🔥 MANEJO DE CAMBIOS EN INPUTS
  const handleChangeInput = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    console.log(`🔍 DEBUG - Cambiando campo ${name}:`, value); // DEBUG
    
    setPostData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleCategoryChange = useCallback((field, value) => {
    setPostData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'subCategory' && { subSubCategory: '' })
    }));
  }, []);

  // 🔥 MANEJO DE IMÁGENES
  const handleChangeImages = useCallback((e) => {
    const files = [...e.target.files];
    let err = "";
    const newImages = [];

    files.forEach(file => {
      if (!file) err = t('validation.images_required');
      else if (file.size > 5 * 1024 * 1024) err = t('validation.images_size');
      else newImages.push(file);
    });

    if (err) {
      showAlertMessage(err, "danger");
      return;
    }

    setImages(prev => [...prev, ...newImages]);
  }, [t]);

  const deleteImages = useCallback((index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  // 🔥 MANEJO DE TALLAS Y COLORES
  const handleSizeChange = useCallback((size) => {
    // 🔥 CORREGIDO: Asegurar que selectedSizes sea un array
    const currentSizes = selectedSizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    
    setSelectedSizes(newSizes);
    setPostData(prev => ({
      ...prev,
      sizes: newSizes
    }));
  
    if (errors.sizes) {
      setErrors(prev => ({
        ...prev,
        sizes: ''
      }));
    }
  }, [selectedSizes, errors.sizes]);
  
  const handleColorChange = useCallback((color) => {
    // 🔥 CORREGIDO: Asegurar que selectedColors sea un array
    const currentColors = selectedColors || [];
    const newColors = currentColors.includes(color)
      ? currentColors.filter(c => c !== color)
      : [...currentColors, color];
    
    setSelectedColors(newColors);
    setPostData(prev => ({
      ...prev,
      colors: newColors
    }));
  
    if (errors.colors) {
      setErrors(prev => ({
        ...prev,
        colors: ''
      }));
    }
  }, [selectedColors, errors.colors]);

  // 🔥 VALIDACIÓN DEL FORMULARIO
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Validaciones de campos requeridos
    if (!postData.description?.trim()) newErrors.description = t('validation.description');
    if (!postData.price || postData.price <= 0) newErrors.price = t('validation.price');
    if (!postData.subCategory) newErrors.subCategory = t('validation.subcategory');
    if (!postData.brand?.trim()) newErrors.brand = t('validation.brand');
    if (!postData.wilaya) newErrors.wilaya = t('validation.wilaya');
    if (!postData.commune?.trim()) newErrors.commune = t('validation.commune');
    if (!postData.phone?.trim()) newErrors.phone = t('validation.phone');
    
    // 🔥 CORREGIDO: Verificar que los arrays existan y tengan elementos
    if (!selectedSizes || selectedSizes.length === 0) newErrors.sizes = t('validation.sizes');
    if (!selectedColors || selectedColors.length === 0) newErrors.colors = t('validation.colors');
    if (!images || images.length === 0) newErrors.images = t('validation.images');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [postData, selectedSizes, selectedColors, images, t]);

  // 🔥 ENVÍO DEL FORMULARIO
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    console.log('🔍 DEBUG - Datos a enviar:', { 
      postData, 
      sizes: selectedSizes,
      colors: selectedColors,
      images: images.length 
    });
  
    if (!validateForm()) {
      showAlertMessage(t('validation.required_fields'), "danger");
      setIsSubmitting(false);
      return;
    }
  
    try {
      // 🔥 CORREGIDO: Preparar datos limpios para el backend
      const cleanPostData = {
        ...postData,
        // Asegurar que los arrays estén definidos
        sizes: selectedSizes || [],
        colors: selectedColors || [],
        // Limpiar campos opcionales
        bootiquename: postData.bootiquename?.trim() || undefined,
        email: postData.email?.trim() || undefined,
        location: postData.location?.trim() || undefined,
        material: postData.material || undefined,
        gender: postData.gender || undefined,
        season: postData.season || 'all_year'
      };
  
      const actionData = {
        postData: cleanPostData,
        images,
        auth,
        ...(isEdit && postToEdit && {
          status: { _id: postToEdit._id, ...postToEdit }
        })
      };
  
      if (isEdit && postToEdit) {
        await dispatch(updatePost(actionData));
        showAlertMessage(t('success.update'), "success");
      } else {
        await dispatch(createPost(actionData));
        showAlertMessage(t('success.create'), "success");
      }
  
      setTimeout(() => history.push('/'), 2000);
  
    } catch (error) {
      console.error('Error completo al publicar:', error);
      
      // 🔥 MEJOR MANEJO DE ERRORES
      let errorMessage = t('error.publication');
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showAlertMessage(errorMessage, "danger");
    } finally {
      setIsSubmitting(false);
    }
  }, [postData, selectedSizes, selectedColors, images, auth, isEdit, postToEdit, dispatch, history, t, validateForm]);

  const showAlertMessage = useCallback((message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  // 🔥 COMPONENTE CATEGORY SECTION
  const CategorySection = useMemo(() => (
    <Card style={styles.card}>
      <Card.Header style={styles.cardHeader}>
        <h6 style={styles.sectionTitle}>
          <FaTag style={styles.icon} />
          {t('sections.categories')}
        </h6>
      </Card.Header>
      <Card.Body style={styles.cardBody}>
        <Row className="g-2">
          <Col xs={12} lg={6}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('labels.subcategory')} *</Form.Label>
              <Form.Select
                name="subCategory"
                value={postData.subCategory}
                onChange={(e) => handleCategoryChange('subCategory', e.target.value)}
                isInvalid={!!errors.subCategory}
                style={styles.formControl}
              >
                <option value="">{t('placeholders.select_subcategory')}</option>
                {getSubCategoryOptions().map(subCatKey => (
                  <option key={subCatKey} value={subCatKey}>
                    {translateOption(`categories.${subCatKey}`)}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.subCategory}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col xs={12} lg={6}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('labels.specific_type')}</Form.Label>
              <Form.Select
                name="subSubCategory"
                value={postData.subSubCategory}
                onChange={(e) => handleCategoryChange('subSubCategory', e.target.value)}
                disabled={!postData.subCategory}
                style={styles.formControl}
              >
                <option value="">{t('placeholders.select_type')}</option>
                {getSubSubCategoryOptions().map(typeKey => (
                  <option key={typeKey} value={typeKey}>
                    {translateOption(`categories.${typeKey}`)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ), [postData.subCategory, postData.subSubCategory, errors.subCategory, t, getSubCategoryOptions, getSubSubCategoryOptions, styles, handleCategoryChange, translateOption]);

  // 🔥 COMPONENTE BASIC INFO SECTION
  const BasicInfoSection = useMemo(() => (
    <Card style={styles.card}>
      <Card.Header style={styles.cardHeader}>
        <h6 style={styles.sectionTitle}>📝 {t('sections.basic_info')}</h6>
      </Card.Header>
      <Card.Body style={styles.cardBody}>
        <Row className="g-2">
          <Col xs={12} lg={8}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('labels.title')} *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={postData.title}
                onChange={handleChangeInput}
                isInvalid={!!errors.title}
                placeholder={t('placeholders.title')}
                style={styles.formControl}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col xs={12} lg={4}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('labels.brand')} *</Form.Label>
              <Form.Control
                type="text"
                name="brand"
                value={postData.brand}
                onChange={handleChangeInput}
                isInvalid={!!errors.brand}
                placeholder={t('placeholders.brand')}
                style={styles.formControl}
              />
              <Form.Control.Feedback type="invalid">
                {errors.brand}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col xs={12}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('labels.description')} *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={postData.description}
                onChange={handleChangeInput}
                isInvalid={!!errors.description}
                placeholder={t('placeholders.description')}
                style={styles.textarea}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ), [postData.title, postData.brand, postData.description, errors, t, handleChangeInput, styles]);

  // 🔥 COMPONENTE PRICE CONDITION SECTION
  const PriceConditionSection = useMemo(() => (
    <Card style={styles.card}>
      <Card.Header style={styles.cardHeader}>
        <h6 style={styles.sectionTitle}>💰 {t('sections.price_condition')}</h6>
      </Card.Header>
      <Card.Body style={styles.cardBody}>
        <Row className="g-2">
          <Col xs={12} sm={6} lg={3}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('labels.price')} (DZD) *</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={postData.price}
                onChange={handleChangeInput}
                isInvalid={!!errors.price}
                placeholder="0.00"
                style={styles.formControl}
                min="0"
                step="0.01"
              />
              <Form.Control.Feedback type="invalid">
                {errors.price}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col xs={12} sm={6} lg={3}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('labels.condition')}</Form.Label>
              <Form.Select
                name="condition"
                value={postData.condition}
                onChange={handleChangeInput}
                style={styles.formControl}
              >
                {conditions.map(condition => (
                  <option key={condition} value={condition}>
                    {translateOption(`conditions.${condition}`)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col xs={12} sm={6} lg={3}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('labels.gender')}</Form.Label>
              <Form.Select
                name="gender"
                value={postData.gender}
                onChange={handleChangeInput}
                style={styles.formControl}
              >
                <option value="">{t('placeholders.select_gender')}</option>
                {genders.map(gender => (
                  <option key={gender} value={gender}>
                    {translateOption(`genders.${gender}`)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col xs={12} sm={6} lg={3}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('labels.season')}</Form.Label>
              <Form.Select
                name="season"
                value={postData.season}
                onChange={handleChangeInput}
                style={styles.formControl}
              >
                {seasons.map(season => (
                  <option key={season} value={season}>
                    {translateOption(`seasons.${season}`)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ), [postData.price, postData.condition, postData.gender, postData.season, errors.price, t, handleChangeInput, translateOption, styles]);

  // 🔥 COMPONENTE SIZES SECTION
  const SizesSection = useMemo(() => (
    <Card style={styles.card}>
      <Card.Header style={styles.cardHeader}>
        <h6 style={styles.sectionTitle}>📏 {t('sections.available_sizes')} *</h6>
      </Card.Header>
      <Card.Body style={styles.cardBody}>
        {errors.sizes && (
          <Alert variant="danger" style={styles.alert}>
            {errors.sizes}
          </Alert>
        )}
        <Row>
          {allSizes.map(size => (
            <Col key={size} xs={4} sm={3} lg={2} className="mb-2">
              <div style={styles.checkboxGroup}>
                <Form.Check
                  type="checkbox"
                  id={`size-${size}`}
                  label={translateOption(`sizes.${size}`)}
                  checked={selectedSizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                  className="fw-medium"
                />
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  ), [selectedSizes, errors.sizes, t, handleSizeChange, translateOption, styles]);

  // 🔥 COMPONENTE COLORS SECTION
  const ColorsSection = useMemo(() => (
    <Card style={styles.card}>
      <Card.Header style={styles.cardHeader}>
        <h6 style={styles.sectionTitle}>🎨 {t('sections.available_colors')} *</h6>
      </Card.Header>
      <Card.Body style={styles.cardBody}>
        {errors.colors && (
          <Alert variant="danger" style={styles.alert}>
            {errors.colors}
          </Alert>
        )}
        <Row>
          {allColors.map(color => (
            <Col key={color} xs={6} sm={4} lg={3} className="mb-2">
              <div style={styles.checkboxGroup}>
                <Form.Check
                  type="checkbox"
                  id={`color-${color}`}
                  label={translateOption(`colors.${color}`)}
                  checked={selectedColors.includes(color)}
                  onChange={() => handleColorChange(color)}
                  className="fw-medium"
                />
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  ), [selectedColors, errors.colors, t, handleColorChange, translateOption, styles]);

  // 🔥 COMPONENTE MATERIAL SECTION
  const MaterialSection = useMemo(() => (
    <Card style={styles.card}>
      <Card.Header style={styles.cardHeader}>
        <h6 style={styles.sectionTitle}>🧵 {t('sections.material')}</h6>
      </Card.Header>
      <Card.Body style={styles.cardBody}>
        <Row>
          <Col xs={12} lg={6}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('labels.main_material')}</Form.Label>
              <Form.Select
                name="material"
                value={postData.material}
                onChange={handleChangeInput}
                style={styles.formControl}
              >
                <option value="">{t('placeholders.select_material')}</option>
                {materials.map(material => (
                  <option key={material} value={material}>
                    {translateOption(`materials.${material}`)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ), [postData.material, t, handleChangeInput, translateOption, styles]);

  // 🔥 COMPONENTE LOCATION SECTION - CORREGIDO
  const LocationSection = useMemo(() => (
    <Card style={styles.card}>
      <Card.Header style={styles.cardHeader}>
        <h6 style={styles.sectionTitle}>
          <FaMapMarkerAlt style={styles.icon} />
          {t('sections.location')}
        </h6>
      </Card.Header>
      <Card.Body style={styles.cardBody}>
        <Row className="g-2">
          {/* 🔥 BOUTIQUE NAME - FUNCIONANDO */}
          <Col xs={12}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('labels.bootiquename')}</Form.Label>
              <Form.Control
                type="text"
                name="bootiquename"
                value={postData.bootiquename || ""}
                onChange={handleChangeInput}
                placeholder={t('placeholders.bootiquename')}
                style={styles.formControl}
                isInvalid={!!errors.bootiquename}
              />
              <Form.Control.Feedback type="invalid">
                {errors.bootiquename}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col xs={12} lg={6}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('labels.wilaya')} *</Form.Label>
              <Form.Select
                name="wilaya"
                value={postData.wilaya}
                onChange={handleChangeInput}
                isInvalid={!!errors.wilaya}
                style={styles.formControl}
              >
                <option value="">{t('placeholders.select_wilaya')}</option>
                {wilayas.map(wilaya => (
                  <option key={wilaya} value={wilaya}>
                    {translateOption(`wilayas.${wilaya}`)}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.wilaya}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col xs={12} lg={6}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('labels.commune')} *</Form.Label>
              <Form.Control
                type="text"
                name="commune"
                value={postData.commune}
                onChange={handleChangeInput}
                isInvalid={!!errors.commune}
                placeholder={t('placeholders.commune')}
                style={styles.formControl}
              />
              <Form.Control.Feedback type="invalid">
                {errors.commune}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col xs={12}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('labels.address')}</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={postData.location}
                onChange={handleChangeInput}
                placeholder={t('placeholders.address')}
                style={styles.formControl}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ), [postData.bootiquename, postData.wilaya, postData.commune, postData.location, errors, t, handleChangeInput, translateOption, styles]);

  // 🔥 COMPONENTE CONTACT SECTION
  const ContactSection = useMemo(() => (
    <Card style={styles.card}>
      <Card.Header style={styles.cardHeader}>
        <h6 style={styles.sectionTitle}>
          <FaPhone style={styles.icon} />
          {t('sections.contact')}
        </h6>
      </Card.Header>
      <Card.Body style={styles.cardBody}>
        <Row className="g-2">
          <Col xs={12} lg={6}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('labels.phone')} *</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={postData.phone}
                onChange={handleChangeInput}
                isInvalid={!!errors.phone}
                placeholder={t('placeholders.phone')}
                style={styles.formControl}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col xs={12} lg={6}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('labels.email')}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={postData.email}
                onChange={handleChangeInput}
                placeholder={t('placeholders.email')}
                style={styles.formControl}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ), [postData.phone, postData.email, errors, t, handleChangeInput, styles]);

  // 🔥 COMPONENTE IMAGES SECTION
  const ImagesSection = useMemo(() => (
    <Card style={styles.card}>
      <Card.Header style={styles.cardHeader}>
        <h6 style={styles.sectionTitle}>
          <FaImage style={styles.icon} />
          {t('sections.images')} *
        </h6>
      </Card.Header>
      <Card.Body style={styles.cardBody}>
        {errors.images && (
          <Alert variant="danger" style={styles.alert}>
            {errors.images}
          </Alert>
        )}
        <ImageUpload
          images={images}
          handleChangeImages={handleChangeImages}
          deleteImages={deleteImages}
          theme={theme}
        />
      </Card.Body>
    </Card>
  ), [images, errors.images, t, theme, handleChangeImages, deleteImages, styles]);

  return (
    <Container fluid style={styles.container} dir={isRTL ? "rtl" : "ltr"}>
      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={8}>
          {/* Header */}
          <Card style={{
            ...styles.card, 
            background: isEdit 
              ? 'linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%)' 
              : 'linear-gradient(135deg, #d1ecf1 0%, #bee3f8 100%)'
          }}>
            <Card.Body className="text-center py-3">
              <h4 className="mb-2 fw-bold" style={{fontSize: '18px'}}>
                {isEdit ? t('headers.edit_clothing') : t('headers.sell_clothing')}
              </h4>
              {isEdit && postToEdit?.title && (
                <p className="mb-0 text-muted" style={{fontSize: '14px'}}>
                  {t('headers.editing')}: "{postToEdit.title}"
                </p>
              )}
            </Card.Body>
          </Card>

          {/* Alert */}
          {showAlert && (
            <Alert variant={alertVariant} dismissible onClose={() => setShowAlert(false)} style={styles.alert}>
              <div className="d-flex align-items-center">
                <span className="me-2 fs-5">
                  {alertVariant === "success" ? "✅" : "⚠️"}
                </span>
                <span style={{fontSize: '14px'}}>{alertMessage}</span>
              </div>
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {CategorySection}

            {postData.subCategory && (
              <>
                {BasicInfoSection}
                {PriceConditionSection}
                {SizesSection}
                {ColorsSection}
                {MaterialSection}
                {LocationSection}
                {ContactSection}
                {ImagesSection}

                {/* Action Buttons */}
                <Card style={styles.card}>
                  <Card.Body style={styles.cardBody}>
                    <Row className={`g-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Col xs={12} sm={8}>
                        <Button
                          variant={isEdit ? "warning" : "success"}
                          type="submit"
                          size="lg"
                          style={{
                            ...styles.button,
                            backgroundColor: isEdit ? '#f59e0b' : '#10b981',
                            opacity: isSubmitting ? 0.7 : 1
                          }}
                          disabled={isSubmitting}
                        >
                          <FaSave className={isRTL ? "ms-2" : "me-2"} />
                          {isSubmitting ? t('common.loading') : 
                            (isEdit ? t('buttons.update') : t('buttons.publish'))}
                        </Button>
                      </Col>
                      <Col xs={12} sm={4}>
                        <Button
                          variant="outline-secondary"
                          size="lg"
                          style={styles.button}
                          onClick={() => history.goBack()}
                          disabled={isSubmitting}
                        >
                          <FaTimes className={isRTL ? "ms-2" : "me-2"} />
                          {t('buttons.cancel')}
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </>
            )}

            {!postData.subCategory && (
              <Card style={{...styles.card, backgroundColor: '#f8f9fa'}}>
                <Card.Body className="text-center py-4">
                  <div className="fs-1 mb-3">🏁</div>
                  <h5 className="text-muted" style={{fontSize: '16px'}}>
                    {t('messages.select_subcategory_first')}
                  </h5>
                </Card.Body>
              </Card>
            )}
          </Form>
          </Col>

      </Row>
    </Container>
  );
};

export default React.memo(CreatePost);