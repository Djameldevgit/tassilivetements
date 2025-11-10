// src/forms/VetementsForm.js

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';

// 🔷 COMPONENTE DE SUBIDA DE IMÁGENES (Manteniendo la lógica original)
import ImageUpload from '../components/forms/ImageUpload';

// 🔷 REDUX Y DATOS
import { createPost, updatePost } from '../redux/actions/postAction';

const getInitialState = () => ({
  // ✅ CAMPOS BÁSICOS
  category: "Vêtements",
  subCategory: "",
  subSubCategory: "",
  title: "",
  description: "",
  price: "",
  currency: 'DZD',
  brand: "",
  condition: 'Nouveau',
  
  // ✅ CAMPOS DE CARACTERÍSTICAS
  sizes: [],
  colors: [],
  material: "",
  gender: "",
  season: 'Toute l\'année',
  
  // ✅ CAMPOS DE UBICACIÓN Y CONTACTO
  wilaya: "",
  commune: "",
  location: "",
  phone: "",
  email: "",
  
  // ✅ CAMPOS ADICIONALES
  tags: []
});

// Arrays para selects
const currencies = ['DZD', 'EUR', 'USD'];
const conditions = ['Nouveau', 'Comme neuf', 'Bon état', 'État satisfaisant'];
const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '36', '38', '40', '42', '44', '46', '48', '50'];
const allColors = ['Noir', 'Blanc', 'Rouge', 'Bleu', 'Vert', 'Jaune', 'Rose', 'Violet', 'Orange', 'Marron', 'Gris', 'Beige', 'Multicolor'];
const materials = ['Coton', 'Polyester', 'Laine', 'Soie', 'Denim', 'Cuir', 'Synthétique', 'Linen', 'Cachemire', 'Velours'];
const genders = ['Homme', 'Femme', 'Unisexe', 'Garçon', 'Fille', 'Bébé'];
const seasons = ['Printemps', 'Été', 'Automne', 'Hiver', 'Toute l\'année'];

// Categorías y subcategorías
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

const VetementsForm = () => {
  const { auth, theme, languageReducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { t, i18n } = useTranslation('categories');

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
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleCategoryChange = useCallback((field, value) => {
    const newData = { ...postData };
    
    if (field === 'subCategory') {
      newData.subCategory = value;
      newData.subSubCategory = '';
    } else if (field === 'subSubCategory') {
      newData.subSubCategory = value;
    }
    
    setPostData(newData);
  }, [postData]);

  // ✅ MANTENIENDO LA LÓGICA ORIGINAL DE IMÁGENES
  const handleChangeImages = useCallback((e) => {
    const files = [...e.target.files];
    let err = "";
    const newImages = [];

    files.forEach(file => {
      if (!file) err = t('validation_images_required');
      else if (file.size > 5 * 1024 * 1024) err = t('validation_images_size');
      else newImages.push(file);
    });

    if (err) {
      setAlertMessage(err);
      setAlertVariant("danger");
      setShowAlert(true);
      return;
    }

    setImages(prev => [...prev, ...newImages]);
  }, [t]);

  // ✅ MANTENIENDO LA LÓGICA ORIGINAL DE ELIMINACIÓN DE IMÁGENES
  const deleteImages = useCallback((index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Manejar selección de tallas
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

  // Manejar selección de colores
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

  // Validar formulario
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!postData.title.trim()) newErrors.title = 'Le titre est obligatoire';
    if (!postData.description.trim()) newErrors.description = 'La description est obligatoire';
    if (!postData.price || postData.price <= 0) newErrors.price = 'Le prix doit être supérieur à 0';
    if (!postData.subCategory) newErrors.subCategory = 'La sous-catégorie est obligatoire';
    if (!postData.brand.trim()) newErrors.brand = 'La marque est obligatoire';
    if (!postData.wilaya) newErrors.wilaya = 'La wilaya est obligatoire';
    if (!postData.commune) newErrors.commune = 'La commune est obligatoire';
    if (!postData.phone.trim()) newErrors.phone = 'Le téléphone est obligatoire';
    if (selectedSizes.length === 0) newErrors.sizes = 'Sélectionnez au moins une taille';
    if (selectedColors.length === 0) newErrors.colors = 'Sélectionnez au moins une couleur';
    if (images.length === 0) newErrors.images = 'Au moins une image est requise';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [postData, selectedSizes, selectedColors, images]);

  // ✅ MANTENIENDO LA LÓGICA ORIGINAL DE ENVÍO
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlertMessage(t('validation_required_fields'), "danger");
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
        showAlertMessage(t('success_update'), "success");
      } else {
        await dispatch(createPost(actionData));
        showAlertMessage(t('success_create'), "success");
      }

      setTimeout(() => history.push('/'), 2000);

    } catch (error) {
      showAlertMessage(t('error_publication'), "danger");
    }
  }, [postData, images, auth, isEdit, postToEdit, dispatch, history, t, validateForm]);

  const showAlertMessage = useCallback((message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
  }, []);

  // Obtener opciones de sub-subcategoría
  const getSubSubCategoryOptions = useCallback(() => {
    if (!postData.subCategory) return [];
    return categories[postData.category]?.[postData.subCategory] || [];
  }, [postData.category, postData.subCategory]);

  // 🔥 COMPONENTE DE DIRECCIÓN (Similar al AddressInput original)
  const AddressInput = useMemo(() => (
    <Card className="border-0 rounded-0 mb-3">
      <Card.Header className="bg-light border-0 py-3">
        <h5 className="mb-0 fw-bold text-dark fs-6">📍 Localisation</h5>
      </Card.Header>
      <Card.Body className="p-3">
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Wilaya *</Form.Label>
              <Form.Select
                name="wilaya"
                value={postData.wilaya}
                onChange={handleChangeInput}
                isInvalid={!!errors.wilaya}
              >
                <option value="">Sélectionnez la wilaya</option>
                <option value="Alger">Alger</option>
                <option value="Oran">Oran</option>
                <option value="Constantine">Constantine</option>
                {/* Agregar más wilayas según necesites */}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.wilaya}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Commune *</Form.Label>
              <Form.Control
                type="text"
                name="commune"
                value={postData.commune}
                onChange={handleChangeInput}
                isInvalid={!!errors.commune}
                placeholder="Nom de la commune"
              />
              <Form.Control.Feedback type="invalid">
                {errors.commune}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group>
              <Form.Label>Adresse détaillée</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={postData.location}
                onChange={handleChangeInput}
                placeholder="Adresse complète"
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ), [postData.wilaya, postData.commune, postData.location, handleChangeInput, errors]);

  // 🔥 COMPONENTE DE CONTACTO (Similar al ContactReservation original)
  const ContactInfo = useMemo(() => (
    <Card className="border-0 rounded-0 mb-3">
      <Card.Header className="bg-light border-0 py-3">
        <h5 className="mb-0 fw-bold text-dark fs-6">📞 Contact</h5>
      </Card.Header>
      <Card.Body className="p-3">
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Téléphone *</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={postData.phone}
                onChange={handleChangeInput}
                isInvalid={!!errors.phone}
                placeholder="Votre numéro de téléphone"
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={postData.email}
                onChange={handleChangeInput}
                placeholder="Votre email (optionnel)"
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ), [postData.phone, postData.email, handleChangeInput, errors]);

  return (
    <Container fluid className="p-2" dir={isRTL ? "rtl" : "ltr"}>
      <Row className="g-0">
        <Col xs={12}>
          <Card className="border-0 rounded-0">
            <Card.Header className={`${isEdit ? "bg-warning text-dark" : "my-2 text-white"} ps-3`}>
              <Row className="align-items-center g-0">
                <Col>
                  <h2 className="mb-1 fs-6">
                    {isEdit ? 'Modifier le Vêtement' : 'Vendre un Vêtement'}
                  </h2>
                  {isEdit && postToEdit?.title && (
                    <p className="mb-0 opacity-75 small">
                      Modification de: "{postToEdit.title}"
                    </p>
                  )}
                </Col>
              </Row>
            </Card.Header>
          </Card>

          {showAlert && (
            <Alert variant={alertVariant} dismissible onClose={() => setShowAlert(false)} className="mb-0 rounded-0 border-0">
              <Alert.Heading className="fs-6">
                {alertVariant === "success" ? "✅ Success" : "⚠️ Error"}
              </Alert.Heading>
              {alertMessage}
            </Alert>
          )}

          <Card className="shadow-none border-0 rounded-0">
            <Card.Body className="p-0">
              <Form onSubmit={handleSubmit} className="p-0">
                <div className="px-2">
                  {/* Selector de Categorías */}
                  <Card className="border-0 rounded-0 mb-3">
                    <Card.Header className="bg-light border-0 py-3">
                      <h5 className="mb-0 fw-bold text-dark fs-6">📂 Catégories</h5>
                    </Card.Header>
                    <Card.Body className="p-3">
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Sous-catégorie *</Form.Label>
                            <Form.Select
                              name="subCategory"
                              value={postData.subCategory}
                              onChange={(e) => handleCategoryChange('subCategory', e.target.value)}
                              isInvalid={!!errors.subCategory}
                            >
                              <option value="">Choisir une sous-catégorie</option>
                              {Object.keys(categories[postData.category] || {}).map(subCat => (
                                <option key={subCat} value={subCat}>{subCat}</option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              {errors.subCategory}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Type spécifique</Form.Label>
                            <Form.Select
                              name="subSubCategory"
                              value={postData.subSubCategory}
                              onChange={(e) => handleCategoryChange('subSubCategory', e.target.value)}
                              disabled={!postData.subCategory}
                            >
                              <option value="">Choisir un type</option>
                              {getSubSubCategoryOptions().map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </div>

                {postData.subCategory && (
                  <>
                    <div className="px-2">
                      {/* Información Básica */}
                      <Card className="border-0 rounded-0 mb-3">
                        <Card.Header className="bg-light border-0 py-3">
                          <h5 className="mb-0 fw-bold text-dark fs-6">📝 Informations de Base</h5>
                        </Card.Header>
                        <Card.Body className="p-3">
                          <Row className="g-3">
                            <Col md={8}>
                              <Form.Group>
                                <Form.Label>Titre du produit *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="title"
                                  value={postData.title}
                                  onChange={handleChangeInput}
                                  isInvalid={!!errors.title}
                                  placeholder="Ex: Jeans Levi's 501 bleu"
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.title}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            
                            <Col md={4}>
                              <Form.Group>
                                <Form.Label>Marque *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="brand"
                                  value={postData.brand}
                                  onChange={handleChangeInput}
                                  isInvalid={!!errors.brand}
                                  placeholder="Ex: Zara, Nike, etc."
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.brand}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            
                            <Col md={12}>
                              <Form.Group>
                                <Form.Label>Description détaillée *</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={3}
                                  name="description"
                                  value={postData.description}
                                  onChange={handleChangeInput}
                                  isInvalid={!!errors.description}
                                  placeholder="Décrivez votre produit en détail..."
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.description}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>

                      {/* Precio y Condición */}
                      <Card className="border-0 rounded-0 mb-3">
                        <Card.Header className="bg-light border-0 py-3">
                          <h5 className="mb-0 fw-bold text-dark fs-6">💰 Prix et État</h5>
                        </Card.Header>
                        <Card.Body className="p-3">
                          <Row className="g-3">
                            <Col md={3}>
                              <Form.Group>
                                <Form.Label>Prix (DZD) *</Form.Label>
                                <Form.Control
                                  type="number"
                                  name="price"
                                  value={postData.price}
                                  onChange={handleChangeInput}
                                  isInvalid={!!errors.price}
                                  placeholder="0.00"
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.price}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            
                            <Col md={3}>
                              <Form.Group>
                                <Form.Label>État</Form.Label>
                                <Form.Select
                                  name="condition"
                                  value={postData.condition}
                                  onChange={handleChangeInput}
                                >
                                  {conditions.map(condition => (
                                    <option key={condition} value={condition}>{condition}</option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            
                            <Col md={3}>
                              <Form.Group>
                                <Form.Label>Genre</Form.Label>
                                <Form.Select
                                  name="gender"
                                  value={postData.gender}
                                  onChange={handleChangeInput}
                                >
                                  <option value="">Sélectionnez</option>
                                  {genders.map(gender => (
                                    <option key={gender} value={gender}>{gender}</option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            
                            <Col md={3}>
                              <Form.Group>
                                <Form.Label>Saison</Form.Label>
                                <Form.Select
                                  name="season"
                                  value={postData.season}
                                  onChange={handleChangeInput}
                                >
                                  {seasons.map(season => (
                                    <option key={season} value={season}>{season}</option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>

                      {/* Tallas */}
                      <Card className="border-0 rounded-0 mb-3">
                        <Card.Header className="bg-light border-0 py-3">
                          <h5 className="mb-0 fw-bold text-dark fs-6">📏 Tailles disponibles *</h5>
                        </Card.Header>
                        <Card.Body className="p-3">
                          {errors.sizes && <Alert variant="danger" className="py-2">{errors.sizes}</Alert>}
                          <Row>
                            {allSizes.map(size => (
                              <Col key={size} xs={4} sm={3} md={2} className="mb-2">
                                <Form.Check
                                  type="checkbox"
                                  id={`size-${size}`}
                                  label={size}
                                  checked={selectedSizes.includes(size)}
                                  onChange={() => handleSizeChange(size)}
                                />
                              </Col>
                            ))}
                          </Row>
                        </Card.Body>
                      </Card>

                      {/* Colores */}
                      <Card className="border-0 rounded-0 mb-3">
                        <Card.Header className="bg-light border-0 py-3">
                          <h5 className="mb-0 fw-bold text-dark fs-6">🎨 Couleurs disponibles *</h5>
                        </Card.Header>
                        <Card.Body className="p-3">
                          {errors.colors && <Alert variant="danger" className="py-2">{errors.colors}</Alert>}
                          <Row>
                            {allColors.map(color => (
                              <Col key={color} xs={6} sm={4} md={3} className="mb-2">
                                <Form.Check
                                  type="checkbox"
                                  id={`color-${color}`}
                                  label={color}
                                  checked={selectedColors.includes(color)}
                                  onChange={() => handleColorChange(color)}
                                />
                              </Col>
                            ))}
                          </Row>
                        </Card.Body>
                      </Card>

                      {/* Material */}
                      <Card className="border-0 rounded-0 mb-3">
                        <Card.Header className="bg-light border-0 py-3">
                          <h5 className="mb-0 fw-bold text-dark fs-6">🧵 Matériau</h5>
                        </Card.Header>
                        <Card.Body className="p-3">
                          <Row>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Matériau principal</Form.Label>
                                <Form.Select
                                  name="material"
                                  value={postData.material}
                                  onChange={handleChangeInput}
                                >
                                  <option value="">Choisir le matériau</option>
                                  {materials.map(material => (
                                    <option key={material} value={material}>{material}</option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>

                      {AddressInput}
                      {ContactInfo}

                      {/* Imágenes */}
                      <Card className="border-0 rounded-0 mb-3">
                        <Card.Header className="bg-light border-0 py-3">
                          <h5 className="mb-0 fw-bold text-dark fs-6">🖼️ Images *</h5>
                        </Card.Header>
                        <Card.Body className="p-3">
                          {errors.images && <Alert variant="danger" className="py-2">{errors.images}</Alert>}
                          <ImageUpload
                            images={images}
                            handleChangeImages={handleChangeImages}
                            deleteImages={deleteImages}
                            theme={theme}
                          />
                        </Card.Body>
                      </Card>
                    </div>

                    {/* Botones de acción */}
                    <div className="px-2">
                      <Row className={`g-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Col xs={8}>
                          <div className="d-grid gap-1">
                            <Button
                              variant={isEdit ? "warning" : "success"}
                              type="submit"
                              size="lg"
                              className="fw-bold py-2"
                            >
                              <FaSave className="me-2" />
                              {isEdit ? 'Mettre à jour' : 'Publier'}
                            </Button>
                          </div>
                        </Col>
                        <Col xs={4}>
                          <Button
                            variant="outline-secondary"
                            size="lg"
                            className="w-100 py-2"
                            onClick={() => history.goBack()}
                          >
                            <FaTimes className="me-2" />
                            Annuler
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </>
                )}

                {!postData.subCategory && (
                  <Card className="text-center border-0 bg-light">
                    <Card.Body className="py-4">
                      <div className="fs-1 mb-2">🏁</div>
                      <h5 className="text-muted fs-6">
                        Sélectionnez d'abord une sous-catégorie
                      </h5>
                    </Card.Body>
                  </Card>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default React.memo(VetementsForm);