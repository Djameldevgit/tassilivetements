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
  category: "Vêtements",
  subCategory: "",
  subSubCategory: "",
  title: "",
  description: "",
  price: "",
  currency: 'DZD',
  brand: "",
  condition: 'Nouveau',
  sizes: [],
  colors: [],
  material: "",
  gender: "",
  season: 'Toute l\'année',
  wilaya: "",
  commune: "",
  location: "",
  phone: "",
  email: "",
  tags: []
});

// Arrays para selects - VALORES ORIGINALES (claves)
const wilayas = ['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Djelfa', 'Sétif', 'Sidi Bel Abbès', 'Biskra', 'Tébessa', 'El Oued', 'Skikda', 'Tiaret', 'Béjaïa', 'Tlemcen', 'Ouargla', 'Mostaganem', 'Bordj Bou Arréridj', 'Chlef', 'Souk Ahras', 'Médéa', 'El Tarf', 'Aïn Defla', 'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane'];
const conditions = ['Nouveau', 'Comme neuf', 'Bon état', 'État satisfaisant'];
const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '36', '38', '40', '42', '44', '46', '48', '50'];
const allColors = ['Noir', 'Blanc', 'Rouge', 'Bleu', 'Vert', 'Jaune', 'Rose', 'Violet', 'Orange', 'Marron', 'Gris', 'Beige', 'Multicolor'];
const materials = ['Coton', 'Polyester', 'Laine', 'Soie', 'Denim', 'Cuir', 'Synthétique', 'Linen', 'Cachemire', 'Velours'];
const genders = ['Homme', 'Femme', 'Unisexe', 'Garçon', 'Fille', 'Bébé'];
const seasons = ['Printemps', 'Été', 'Automne', 'Hiver', 'Toute l\'année'];

// Categorías y subcategorías - ESTRUCTURA ORIGINAL
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

const CreatePost = () => {
  const { auth, theme, languageReducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { t, i18n } = useTranslation(['forms', 'common', 'categories', 'arrays']);

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

  // 🔥 ESTILOS 100% RESPONSIVE PARA ANDROID
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

  // 🔥 FUNCIONES DE TRADUCCIÓN SIMPLIFICADAS
  const translateOption = useCallback((option, namespace = 'arrays') => {
    if (!option) return '';
    return t(`${namespace}:${option}`, { defaultValue: option });
  }, [t]);

  const translateCategory = useCallback((category) => {
    if (!category) return '';
    return t(`categories:${category}`, { defaultValue: category });
  }, [t]);

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
        category: sanitizedData.category || "Vêtements",
        subCategory: sanitizedData.subCategory || "",
        subSubCategory: sanitizedData.subSubCategory || "",
        description: sanitizedData.description || sanitizedData.content || "",
        title: sanitizedData.title || "",
        sizes: Array.isArray(sanitizedData.sizes) ? sanitizedData.sizes : [],
        colors: Array.isArray(sanitizedData.colors) ? sanitizedData.colors : [],
      };

      setPostData(finalPostData);
      setSelectedSizes(finalPostData.sizes);
      setSelectedColors(finalPostData.colors);

      if (postToEdit.images?.length > 0) {
        const existingImages = postToEdit.images
          .map(img => {
            if (typeof img === 'string') return { url: img, file: null, isExisting: true };
            if (img?.url) return { ...img, file: null, isExisting: true };
            return null;
          })
          .filter(Boolean);
        setImages(existingImages);
      } else {
        setImages([]);
      }
    }
  }, [isEdit, postToEdit]);

  const sanitizePostData = useCallback((data) => {
    if (!data) return {};
    return { ...data };
  }, []);

  const handleChangeInput = useCallback((e) => {
    const { name, value, type, checked } = e.target;
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

  const handleChangeImages = useCallback((e) => {
    const files = [...e.target.files];
    let err = "";
    const newImages = [];

    files.forEach(file => {
      if (!file) err = t('forms:validation_images_required');
      else if (file.size > 5 * 1024 * 1024) err = t('forms:validation_images_size');
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

  const handleSizeChange = useCallback((size) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    
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
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    
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

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!postData.title.trim()) newErrors.title = t('forms:validation_title');
    if (!postData.description.trim()) newErrors.description = t('forms:validation_description');
    if (!postData.price || postData.price <= 0) newErrors.price = t('forms:validation_price');
    if (!postData.subCategory) newErrors.subCategory = t('forms:validation_subcategory');
    if (!postData.brand.trim()) newErrors.brand = t('forms:validation_brand');
    if (!postData.wilaya) newErrors.wilaya = t('forms:validation_wilaya');
    if (!postData.commune) newErrors.commune = t('forms:validation_commune');
    if (!postData.phone.trim()) newErrors.phone = t('forms:validation_phone');
    if (selectedSizes.length === 0) newErrors.sizes = t('forms:validation_sizes');
    if (selectedColors.length === 0) newErrors.colors = t('forms:validation_colors');
    if (images.length === 0) newErrors.images = t('forms:validation_images');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [postData, selectedSizes, selectedColors, images, t]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      showAlertMessage(t('forms:validation_required_fields'), "danger");
      setIsSubmitting(false);
      return;
    }

    try {
      const actionData = {
        postData,
        images,
        auth,
        ...(isEdit && postToEdit && {
          status: { _id: postToEdit._id, ...postToEdit }
        })
      };

      if (isEdit && postToEdit) {
        await dispatch(updatePost(actionData));
        showAlertMessage(t('forms:success_update'), "success");
      } else {
        await dispatch(createPost(actionData));
        showAlertMessage(t('forms:success_create'), "success");
      }

      setTimeout(() => history.push('/'), 2000);

    } catch (error) {
      showAlertMessage(t('forms:error_publication'), "danger");
    } finally {
      setIsSubmitting(false);
    }
  }, [postData, images, auth, isEdit, postToEdit, dispatch, history, t, validateForm]);

  const showAlertMessage = useCallback((message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  const getSubSubCategoryOptions = useCallback(() => {
    if (!postData.subCategory) return [];
    return categories[postData.category]?.[postData.subCategory] || [];
  }, [postData.category, postData.subCategory]);

  // 🔥 COMPONENTES OPTIMIZADOS CON TRADUCCIÓN DIRECTA
 // 🔥 COMPONENTE CATEGORY SECTION SIMPLIFICADO
const CategorySection = useMemo(() => (
  <Card style={styles.card}>
    <Card.Header style={styles.cardHeader}>
      <h6 style={styles.sectionTitle}>
        <FaTag style={styles.icon} />
        {t('forms:categories')}
      </h6>
    </Card.Header>
    <Card.Body style={styles.cardBody}>
      <Row className="g-2">
        <Col xs={12} lg={6}>
          <Form.Group>
            <Form.Label style={styles.formLabel}>{t('forms:subcategory')} *</Form.Label>
            <Form.Select
              name="subCategory"
              value={postData.subCategory}
              onChange={(e) => handleCategoryChange('subCategory', e.target.value)}
              isInvalid={!!errors.subCategory}
              style={styles.formControl}
            >
              <option value="">{t('forms:select_subcategory')}</option>
              {Object.keys(categories[postData.category] || {}).map(subCat => (
  <option key={subCat} value={subCat}>
    {t(`categories:${subCat}`, { defaultValue: subCat })}
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
            <Form.Label style={styles.formLabel}>{t('forms:specific_type')}</Form.Label>
            <Form.Select
              name="subSubCategory"
              value={postData.subSubCategory}
              onChange={(e) => handleCategoryChange('subSubCategory', e.target.value)}
              disabled={!postData.subCategory}
              style={styles.formControl}
            >
              <option value="">{t('forms:select_type')}</option>
              {getSubSubCategoryOptions().map(type => (
  <option key={type} value={type}>
    {t(`categories:${type}`, { defaultValue: type })}
  </option>
))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </Card.Body>
  </Card>
), [postData.subCategory, postData.subSubCategory, errors.subCategory, t, getSubSubCategoryOptions, styles]);
  const BasicInfoSection = useMemo(() => (
    <Card style={styles.card}>
      <Card.Header style={styles.cardHeader}>
        <h6 style={styles.sectionTitle}>📝 {t('forms:basic_info')}</h6>
      </Card.Header>
      <Card.Body style={styles.cardBody}>
        <Row className="g-2">
          <Col xs={12} lg={8}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('forms:title')} *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={postData.title}
                onChange={handleChangeInput}
                isInvalid={!!errors.title}
                placeholder={t('forms:title_placeholder')}
                style={styles.formControl}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col xs={12} lg={4}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('forms:brand')} *</Form.Label>
              <Form.Control
                type="text"
                name="brand"
                value={postData.brand}
                onChange={handleChangeInput}
                isInvalid={!!errors.brand}
                placeholder={t('forms:brand_placeholder')}
                style={styles.formControl}
              />
              <Form.Control.Feedback type="invalid">
                {errors.brand}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col xs={12}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('forms:description')} *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={postData.description}
                onChange={handleChangeInput}
                isInvalid={!!errors.description}
                placeholder={t('forms:description_placeholder')}
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

  const PriceConditionSection = useMemo(() => (
    <Card style={styles.card}>
      <Card.Header style={styles.cardHeader}>
        <h6 style={styles.sectionTitle}>💰 {t('forms:price_condition')}</h6>
      </Card.Header>
      <Card.Body style={styles.cardBody}>
        <Row className="g-2">
          <Col xs={12} sm={6} lg={3}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('forms:price')} (DZD) *</Form.Label>
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
              <Form.Label style={styles.formLabel}>{t('forms:condition')}</Form.Label>
              <Form.Select
                name="condition"
                value={postData.condition}
                onChange={handleChangeInput}
                style={styles.formControl}
              >
                {conditions.map(condition => (
                  <option key={condition} value={condition}>
                    {translateOption(condition, 'arrays')}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col xs={12} sm={6} lg={3}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('forms:gender')}</Form.Label>
              <Form.Select
                name="gender"
                value={postData.gender}
                onChange={handleChangeInput}
                style={styles.formControl}
              >
                <option value="">{t('forms:select_gender')}</option>
                {genders.map(gender => (
                  <option key={gender} value={gender}>
                    {translateOption(gender, 'arrays')}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col xs={12} sm={6} lg={3}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('forms:season')}</Form.Label>
              <Form.Select
                name="season"
                value={postData.season}
                onChange={handleChangeInput}
                style={styles.formControl}
              >
                {seasons.map(season => (
                  <option key={season} value={season}>
                    {translateOption(season, 'arrays')}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ), [postData.price, postData.condition, postData.gender, postData.season, errors.price, t, handleChangeInput, translateOption, styles]);

  const SizesSection = useMemo(() => (
    <Card style={styles.card}>
      <Card.Header style={styles.cardHeader}>
        <h6 style={styles.sectionTitle}>📏 {t('forms:available_sizes')} *</h6>
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
                  label={translateOption(size, 'arrays')}
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

  const ColorsSection = useMemo(() => (
    <Card style={styles.card}>
      <Card.Header style={styles.cardHeader}>
        <h6 style={styles.sectionTitle}>🎨 {t('forms:available_colors')} *</h6>
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
                  label={translateOption(color, 'arrays')}
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

  const MaterialSection = useMemo(() => (
    <Card style={styles.card}>
      <Card.Header style={styles.cardHeader}>
        <h6 style={styles.sectionTitle}>🧵 {t('forms:material')}</h6>
      </Card.Header>
      <Card.Body style={styles.cardBody}>
        <Row>
          <Col xs={12} lg={6}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('forms:main_material')}</Form.Label>
              <Form.Select
                name="material"
                value={postData.material}
                onChange={handleChangeInput}
                style={styles.formControl}
              >
                <option value="">{t('forms:select_material')}</option>
                {materials.map(material => (
                  <option key={material} value={material}>
                    {translateOption(material, 'arrays')}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ), [postData.material, t, handleChangeInput, translateOption, styles]);

  const LocationSection = useMemo(() => (
    <Card style={styles.card}>
      <Card.Header style={styles.cardHeader}>
        <h6 style={styles.sectionTitle}>
          <FaMapMarkerAlt style={styles.icon} />
          {t('forms:location')}
        </h6>
      </Card.Header>
      <Card.Body style={styles.cardBody}>
        <Row className="g-2">
          <Col xs={12} lg={6}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('forms:wilaya')} *</Form.Label>
              <Form.Select
                name="wilaya"
                value={postData.wilaya}
                onChange={handleChangeInput}
                isInvalid={!!errors.wilaya}
                style={styles.formControl}
              >
                <option value="">{t('forms:select_wilaya')}</option>
                {wilayas.map(wilaya => (
                  <option key={wilaya} value={wilaya}>
                    {translateOption(wilaya, 'arrays')}
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
              <Form.Label style={styles.formLabel}>{t('forms:commune')} *</Form.Label>
              <Form.Control
                type="text"
                name="commune"
                value={postData.commune}
                onChange={handleChangeInput}
                isInvalid={!!errors.commune}
                placeholder={t('forms:commune_placeholder')}
                style={styles.formControl}
              />
              <Form.Control.Feedback type="invalid">
                {errors.commune}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col xs={12}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('forms:address')}</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={postData.location}
                onChange={handleChangeInput}
                placeholder={t('forms:address_placeholder')}
                style={styles.formControl}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ), [postData.wilaya, postData.commune, postData.location, errors, t, handleChangeInput, translateOption, styles]);

  const ContactSection = useMemo(() => (
    <Card style={styles.card}>
      <Card.Header style={styles.cardHeader}>
        <h6 style={styles.sectionTitle}>
          <FaPhone style={styles.icon} />
          {t('forms:contact')}
        </h6>
      </Card.Header>
      <Card.Body style={styles.cardBody}>
        <Row className="g-2">
          <Col xs={12} lg={6}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('forms:phone')} *</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={postData.phone}
                onChange={handleChangeInput}
                isInvalid={!!errors.phone}
                placeholder={t('forms:phone_placeholder')}
                style={styles.formControl}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col xs={12} lg={6}>
            <Form.Group>
              <Form.Label style={styles.formLabel}>{t('forms:email')}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={postData.email}
                onChange={handleChangeInput}
                placeholder={t('forms:email_placeholder')}
                style={styles.formControl}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ), [postData.phone, postData.email, errors, t, handleChangeInput, styles]);

  const ImagesSection = useMemo(() => (
    <Card style={styles.card}>
      <Card.Header style={styles.cardHeader}>
        <h6 style={styles.sectionTitle}>
          <FaImage style={styles.icon} />
          {t('forms:images')} *
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
                {isEdit ? t('forms:edit_clothing') : t('forms:sell_clothing')}
              </h4>
              {isEdit && postToEdit?.title && (
                <p className="mb-0 text-muted" style={{fontSize: '14px'}}>
                  {t('forms:editing')}: "{postToEdit.title}"
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
                          {isSubmitting ? t('common:loading') : 
                            (isEdit ? t('forms:update') : t('forms:publish'))}
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
                          {t('common:cancel')}
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
                    {t('forms:select_subcategory_first')}
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