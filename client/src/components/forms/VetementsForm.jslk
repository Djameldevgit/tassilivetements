// src/forms/VetementsForm.js

import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Row, 
  Col, 
  Button, 
  Card, 
  Alert, 
  Badge,
  Accordion,
  FloatingLabel,
  InputGroup
} from 'react-bootstrap';
import { 
  FaTshirt, 
  FaPalette, 
  FaRuler, 
  FaTag, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaSave,
  FaEuroSign,
  FaLeaf,
  FaVenusMars,
  FaCalendarAlt
} from 'react-icons/fa';

const VetementsForm = ({ onSubmit, initialData }) => {
  // Estados para el formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'DZD',
    category: 'Vêtements',
    subCategory: '',
    subSubCategory: '',
    brand: '',
    condition: 'Nouveau',
    sizes: [],
    colors: [],
    material: '',
    gender: '',
    season: 'Toute l\'année',
    location: '',
    phone: '',
    email: '',
    images: [],
    tags: []
  });

  const [errors, setErrors] = useState({});
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState('0');

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

  // Arrays para selects
  const currencies = ['DZD', 'EUR', 'USD'];
  const conditions = ['Nouveau', 'Comme neuf', 'Bon état', 'État satisfaisant'];
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '36', '38', '40', '42', '44', '46', '48', '50'];
  const allColors = ['Noir', 'Blanc', 'Rouge', 'Bleu', 'Vert', 'Jaune', 'Rose', 'Violet', 'Orange', 'Marron', 'Gris', 'Beige', 'Multicolor'];
  const materials = ['Coton', 'Polyester', 'Laine', 'Soie', 'Denim', 'Cuir', 'Synthétique', 'Linen', 'Cachemire', 'Velours'];
  const genders = ['Homme', 'Femme', 'Unisexe', 'Garçon', 'Fille', 'Bébé'];
  const seasons = ['Printemps', 'Été', 'Automne', 'Hiver', 'Toute l\'année'];

  // Efecto para datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
      if (initialData.sizes) setSelectedSizes(initialData.sizes);
      if (initialData.colors) setSelectedColors(initialData.colors);
    }
  }, [initialData]);

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Manejar cambios en categorías
  const handleCategoryChange = (field, value) => {
    const newData = { ...formData };
    
    if (field === 'subCategory') {
      newData.subCategory = value;
      newData.subSubCategory = '';
    } else if (field === 'subSubCategory') {
      newData.subSubCategory = value;
    }
    
    setFormData(newData);
  };

  // Manejar selección de tallas
  const handleSizeChange = (size) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    
    setSelectedSizes(newSizes);
    setFormData(prev => ({
      ...prev,
      sizes: newSizes
    }));

    if (errors.sizes) {
      setErrors(prev => ({ ...prev, sizes: '' }));
    }
  };

  // Manejar selección de colores
  const handleColorChange = (color) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    
    setSelectedColors(newColors);
    setFormData(prev => ({
      ...prev,
      colors: newColors
    }));

    if (errors.colors) {
      setErrors(prev => ({ ...prev, colors: '' }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Le titre est obligatoire';
    if (!formData.description.trim()) newErrors.description = 'La description est obligatoire';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Le prix doit être supérieur à 0';
    if (!formData.subCategory) newErrors.subCategory = 'La sous-catégorie est obligatoire';
    if (!formData.brand.trim()) newErrors.brand = 'La marque est obligatoire';
    if (!formData.location.trim()) newErrors.location = 'La localisation est obligatoire';
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est obligatoire';
    if (selectedSizes.length === 0) newErrors.sizes = 'Sélectionnez au moins une taille';
    if (selectedColors.length === 0) newErrors.colors = 'Sélectionnez au moins une couleur';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Obtener opciones de sub-subcategoría
  const getSubSubCategoryOptions = () => {
    if (!formData.subCategory) return [];
    return categories[formData.category][formData.subCategory] || [];
  };

  // Estilos para badges de colores
  const getColorBadgeStyle = (color) => {
    const colorMap = {
      'Noir': { background: '#000000', color: 'white' },
      'Blanc': { background: '#ffffff', color: 'black', border: '1px solid #dee2e6' },
      'Rouge': { background: '#dc3545', color: 'white' },
      'Bleu': { background: '#0d6efd', color: 'white' },
      'Vert': { background: '#198754', color: 'white' },
      'Jaune': { background: '#ffc107', color: 'black' },
      'Rose': { background: '#e83e8c', color: 'white' },
      'Violet': { background: '#6f42c1', color: 'white' },
      'Orange': { background: '#fd7e14', color: 'white' },
      'Marron': { background: '#8B4513', color: 'white' },
      'Gris': { background: '#6c757d', color: 'white' },
      'Beige': { background: '#f5f5dc', color: 'black', border: '1px solid #dee2e6' },
      'Multicolor': { 
        background: 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)',
        color: 'white'
      }
    };
    
    return colorMap[color] || { background: '#6c757d', color: 'white' };
  };

 

 
  // [Mantener todos los estados y funciones anteriores...]

  return (
    <Card className="border-0 shadow-lg">
      <Card.Header className="bg-gradient-primary text-white py-3">
        <div className="d-flex align-items-center">
          <FaTshirt className="fs-2 me-3" />
          <div>
            <h4 className="mb-0 fw-bold">Vendre un Vêtement</h4>
            <small className="opacity-75">Remplissez les détails de votre article</small>
          </div>
        </div>
      </Card.Header>
      
      <Card.Body className="p-4">
        <Form onSubmit={handleSubmit}>
          <Accordion defaultActiveKey="0" activeKey={activeAccordion} onSelect={setActiveAccordion}>
            
            {/* SECTION 1: INFORMATIONS GÉNÉRALES */}
            <Accordion.Item eventKey="0" className="mb-3 border-0">
              <Accordion.Header className="bg-light">
                <div className="d-flex align-items-center">
                  <FaTag className="text-primary me-2" />
                  <span className="fw-bold">Informations Générales</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="pt-4">
                <Row className="g-3">
                  {/* Título - Ocupa todo el ancho en móviles */}
                  <Col xs={12} lg={8}>
                    <FloatingLabel controlId="title" label="Titre du produit *" className="mb-3">
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        isInvalid={!!errors.title}
                        placeholder=" "
                        className="border-0 border-bottom rounded-0 w-100"
                      />
                      <Form.Control.Feedback type="invalid" className="mt-1">
                        {errors.title}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  
                  {/* Marca - Ocupa todo el ancho en móviles */}
                  <Col xs={12} lg={4}>
                    <FloatingLabel controlId="brand" label="Marque *" className="mb-3">
                      <Form.Control
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        isInvalid={!!errors.brand}
                        placeholder=" "
                        className="border-0 border-bottom rounded-0 w-100"
                      />
                      <Form.Control.Feedback type="invalid" className="mt-1">
                        {errors.brand}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  
                  {/* Descripción - Siempre ocupa todo el ancho */}
                  <Col xs={12}>
                    <FloatingLabel controlId="description" label="Description détaillée *">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        isInvalid={!!errors.description}
                        placeholder=" "
                        style={{ height: '100px' }}
                        className="border-0 border-bottom rounded-0 w-100"
                      />
                      <Form.Control.Feedback type="invalid" className="mt-1">
                        {errors.description}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            {/* SECTION 2: CATÉGORIE ET TYPE */}
            <Accordion.Item eventKey="1" className="mb-3 border-0">
              <Accordion.Header className="bg-light">
                <div className="d-flex align-items-center">
                  <FaTshirt className="text-success me-2" />
                  <span className="fw-bold">Catégorie et Type</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="pt-4">
                <Row className="g-3">
                  {/* SubCategory - Ocupa todo el ancho en móviles */}
                  <Col xs={12} md={6}>
                    <FloatingLabel controlId="subCategory" label="Sous-catégorie *">
                      <Form.Select
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={(e) => handleCategoryChange('subCategory', e.target.value)}
                        isInvalid={!!errors.subCategory}
                        className="border-0 border-bottom rounded-0 w-100"
                      >
                        <option value="">Choisir une sous-catégorie</option>
                        {Object.keys(categories[formData.category] || {}).map(subCat => (
                          <option key={subCat} value={subCat}>{subCat}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid" className="mt-1">
                        {errors.subCategory}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  
                  {/* SubSubCategory - Ocupa todo el ancho en móviles */}
                  <Col xs={12} md={6}>
                    <FloatingLabel controlId="subSubCategory" label="Type spécifique">
                      <Form.Select
                        name="subSubCategory"
                        value={formData.subSubCategory}
                        onChange={(e) => handleCategoryChange('subSubCategory', e.target.value)}
                        disabled={!formData.subCategory}
                        className="border-0 border-bottom rounded-0 w-100"
                      >
                        <option value="">Choisir un type</option>
                        {getSubSubCategoryOptions().map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            {/* SECTION 3: CARACTÉRISTIQUES */}
            <Accordion.Item eventKey="2" className="mb-3 border-0">
              <Accordion.Header className="bg-light">
                <div className="d-flex align-items-center">
                  <FaRuler className="text-warning me-2" />
                  <span className="fw-bold">Caractéristiques</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="pt-4">
                <Row className="g-3 mb-4">
                  {/* Precio - Ocupa todo el ancho en móviles */}
                  <Col xs={12} sm={6} md={3}>
                    <FloatingLabel controlId="price" label="Prix (DZD) *">
                      <InputGroup className="w-100">
                        <InputGroup.Text className="bg-transparent border-0 border-bottom w-auto">
                          <FaEuroSign className="text-muted" />
                        </InputGroup.Text>
                        <Form.Control
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          isInvalid={!!errors.price}
                          placeholder=" "
                          className="border-0 border-bottom rounded-0 ps-0 w-100"
                        />
                      </InputGroup>
                      <Form.Control.Feedback type="invalid" className="mt-1">
                        {errors.price}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  
                  {/* Estado - Ocupa todo el ancho en móviles */}
                  <Col xs={12} sm={6} md={3}>
                    <FloatingLabel controlId="condition" label="État">
                      <Form.Select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        className="border-0 border-bottom rounded-0 w-100"
                      >
                        {conditions.map(condition => (
                          <option key={condition} value={condition}>{condition}</option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                  
                  {/* Género - Ocupa todo el ancho en móviles */}
                  <Col xs={12} sm={6} md={3}>
                    <FloatingLabel controlId="gender" label="Genre">
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="border-0 border-bottom rounded-0 w-100"
                      >
                        <option value="">Sélectionnez</option>
                        {genders.map(gender => (
                          <option key={gender} value={gender}>{gender}</option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                  
                  {/* Temporada - Ocupa todo el ancho en móviles */}
                  <Col xs={12} sm={6} md={3}>
                    <FloatingLabel controlId="season" label="Saison">
                      <Form.Select
                        name="season"
                        value={formData.season}
                        onChange={handleInputChange}
                        className="border-0 border-bottom rounded-0 w-100"
                      >
                        {seasons.map(season => (
                          <option key={season} value={season}>{season}</option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                </Row>

                {/* Tailles - Siempre ocupa todo el ancho */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <FaRuler className="text-primary me-2" />
                    <h6 className="mb-0 fw-bold">Tailles disponibles *</h6>
                  </div>
                  {errors.sizes && (
                    <Alert variant="danger" className="py-2 small">
                      {errors.sizes}
                    </Alert>
                  )}
                  <div className="d-flex flex-wrap gap-2 w-100">
                    {allSizes.map(size => (
                      <div key={size} className="position-relative">
                        <Form.Check
                          type="checkbox"
                          id={`size-${size}`}
                          className="btn-check"
                          checked={selectedSizes.includes(size)}
                          onChange={() => handleSizeChange(size)}
                        />
                        <Form.Check.Label 
                          htmlFor={`size-${size}`}
                          className={`btn btn-outline-primary btn-sm ${selectedSizes.includes(size) ? 'active' : ''}`}
                        >
                          {size}
                        </Form.Check.Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Couleurs - Siempre ocupa todo el ancho */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <FaPalette className="text-success me-2" />
                    <h6 className="mb-0 fw-bold">Couleurs disponibles *</h6>
                  </div>
                  {errors.colors && (
                    <Alert variant="danger" className="py-2 small">
                      {errors.colors}
                    </Alert>
                  )}
                  <div className="d-flex flex-wrap gap-2 w-100">
                    {allColors.map(color => (
                      <div key={color} className="position-relative">
                        <Form.Check
                          type="checkbox"
                          id={`color-${color}`}
                          className="btn-check"
                          checked={selectedColors.includes(color)}
                          onChange={() => handleColorChange(color)}
                        />
                        <Form.Check.Label 
                          htmlFor={`color-${color}`}
                          className={`btn btn-sm ${selectedColors.includes(color) ? 'active' : ''}`}
                          style={getColorBadgeStyle(color)}
                        >
                          {color}
                        </Form.Check.Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Matériau - Ocupa todo el ancho en móviles */}
                <Row>
                  <Col xs={12} md={6}>
                    <FloatingLabel controlId="material" label="Matériau principal">
                      <Form.Select
                        name="material"
                        value={formData.material}
                        onChange={handleInputChange}
                        className="border-0 border-bottom rounded-0 w-100"
                      >
                        <option value="">Choisir le matériau</option>
                        {materials.map(material => (
                          <option key={material} value={material}>{material}</option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            {/* SECTION 4: LOCALISATION ET CONTACT */}
            <Accordion.Item eventKey="3" className="mb-3 border-0">
              <Accordion.Header className="bg-light">
                <div className="d-flex align-items-center">
                  <FaMapMarkerAlt className="text-danger me-2" />
                  <span className="fw-bold">Localisation et Contact</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="pt-4">
                <Row className="g-3">
                  {/* Localización - Ocupa todo el ancho en móviles */}
                  <Col xs={12} md={6}>
                    <FloatingLabel controlId="location" label="Localisation *" className="mb-3">
                      <InputGroup className="w-100">
                        <InputGroup.Text className="bg-transparent border-0 border-bottom w-auto">
                          <FaMapMarkerAlt className="text-muted" />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          isInvalid={!!errors.location}
                          placeholder=" "
                          className="border-0 border-bottom rounded-0 ps-0 w-100"
                        />
                      </InputGroup>
                      <Form.Control.Feedback type="invalid" className="mt-1">
                        {errors.location}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  
                  {/* Teléfono - Ocupa todo el ancho en móviles */}
                  <Col xs={12} md={6}>
                    <FloatingLabel controlId="phone" label="Téléphone *" className="mb-3">
                      <InputGroup className="w-100">
                        <InputGroup.Text className="bg-transparent border-0 border-bottom w-auto">
                          <FaPhone className="text-muted" />
                        </InputGroup.Text>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          isInvalid={!!errors.phone}
                          placeholder=" "
                          className="border-0 border-bottom rounded-0 ps-0 w-100"
                        />
                      </InputGroup>
                      <Form.Control.Feedback type="invalid" className="mt-1">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  
                  {/* Email - Siempre ocupa todo el ancho */}
                  <Col xs={12}>
                    <FloatingLabel controlId="email" label="Email (optionnel)">
                      <InputGroup className="w-100">
                        <InputGroup.Text className="bg-transparent border-0 border-bottom w-auto">
                          <FaEnvelope className="text-muted" />
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder=" "
                          className="border-0 border-bottom rounded-0 ps-0 w-100"
                        />
                      </InputGroup>
                    </FloatingLabel>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          {/* RÉSUMÉ ET BOUTON DE SOUMISSION */}
          <Card className="bg-light border-0 mt-4">
            <Card.Body>
              <Row className="align-items-center">
                <Col xs={12} md={8} className="mb-3 mb-md-0">
                  <div className="d-flex flex-wrap gap-2 align-items-center justify-content-center justify-content-md-start">
                    <Badge bg="primary" className="fs-6">
                      <FaTshirt className="me-1" />
                      {formData.subCategory || 'Non spécifié'}
                    </Badge>
                    {formData.price && (
                      <Badge bg="success" className="fs-6">
                        <FaEuroSign className="me-1" />
                        {formData.price} DZD
                      </Badge>
                    )}
                    {selectedSizes.length > 0 && (
                      <Badge bg="warning" className="fs-6">
                        <FaRuler className="me-1" />
                        {selectedSizes.length} taille(s)
                      </Badge>
                    )}
                    {selectedColors.length > 0 && (
                      <Badge bg="info" className="fs-6">
                        <FaPalette className="me-1" />
                        {selectedColors.length} couleur(s)
                      </Badge>
                    )}
                  </div>
                </Col>
                <Col xs={12} md={4} className="text-center text-md-end">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg"
                    className="px-4 w-100 w-md-auto"
                  >
                    <FaSave className="me-2" />
                    Publier l'annonce
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default VetementsForm;
  