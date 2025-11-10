import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';

// 🔷 IMPORTS OPTIMIZADOS
import CategorySelector from '../components/forms/CategorySelector';
import DescriptionTextarea from '../components/forms/DescriptionTextarea';
import AddressInput from '../components/forms/AddressInput';
import ImageUpload from '../components/forms/ImageUpload';
import ContactReservation from '../components/forms/ContactReservation';

// 🔷 COMPONENTES DE FECHAS Y HORARIOS
import DateDeparRetour from '../components/forms/DateDeparRetour';
import HoraDepart from '../components/forms/HoraDepart';
import DurationDisplay from '../components/forms/DuracionDelViaje';

// 🔷 COMPONENTES POR CATEGORÍA
import DestinationHajjOmra from '../components/forms/hadjpmra/DestinacionHdjaOmra';
import DestinationLocationVacances from '../components/forms/locationvacances/DestinacionLocationvacances';
import DestinationVoyagesOrganises from '../components/forms/voyageorgranise/Destinacionvoyageorganise';

import TransportHajjOmra from '../components/forms/hadjpmra/TransporHajjOmra';
import TransportVoyagesOrganises from '../components/forms/voyageorgranise/TransportVoyageOrganise';

import AlojamientoHajjOmra from '../components/forms/hadjpmra/HotelHajjOmra';
import AlojamientoLocationVacances from '../components/forms/locationvacances/Hotellocationvacance';
import AlojamientoVoyagesOrganises from '../components/forms/voyageorgranise/Hotelvoyageorganise';

import NombreLugarVoyagesOrganises from '../components/forms/voyageorgranise/NombreLugarVoyagesOrganiseq';

import ServiciosHajjOmra from '../components/forms/hadjpmra/ServiciosHajjOmra';
import ServiciosLocationVacances from '../components/forms/locationvacances/ServiciosLocationVancances';

import TarifasYprecios from '../components/forms/TarifasYprecios';
import TarifasYpreciosomra from '../components/forms/hadjpmra/TarifasYpreciosomra';

// 🔷 REDUX Y DATOS
import { createPost, updatePost } from '../redux/actions/postAction';
import communesjson from "../json/communes.json";

// 🔷 ESTADO INICIAL OPTIMIZADO
const getInitialState = () => ({
  category: "Agence de Voyage",
  subCategory: "",
  title: "",
  description: "",
  price: "",
  wilaya: "",
  vile: "",
  contacto: "",
  images: [],
  destinacionlocacionvoyage: "",
  destinacionomra: "",
  destinacionvoyageorganise: "",
  datedepar: "",
  horadudepar: "",
  dateretour: "",
  dureeSejour: "",
  servicios: [],
  ...Object.fromEntries([
    'categoriaHotelMeca', 'compagnieAerienne', 'typeTransport', 'precioBase', 'tipoPrecio',
    'hotelMedina', 'hotelMeca', 'tipoPropiedad', 'capacidad', 'habitaciones', 'superficie',
    'nombrePropiedad', 'direccionCompleta', 'ciudad', 'zonaBarrio', 'descripcionUbicacion',
    'transportInclus', 'categoriaAlojamiento', 'tipoHabitacion', 'regimenComidas', 'ubicacionHotel',
    'nombreHotel', 'ciudadHotel', 'direccionHotel', 'zonaRegion', 'modeTransport', 'classeTransport',
    'typeVol', 'baggage', 'repasVol', 'prixAdulte', 'prixEnfant', 'prixBebe'
  ].map(key => [key, ""]))
});

const Createpost = () => {
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
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("info");

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
        category: sanitizedData.category || "Agence de Voyage",
        subCategory: sanitizedData.subCategory || "",
        description: sanitizedData.description || sanitizedData.content || "",
        title: sanitizedData.title || "",
        servicios: Array.isArray(sanitizedData.servicios) ? sanitizedData.servicios : [],
      };

      setPostData(finalPostData);

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

      setSelectedWilaya(postToEdit.wilaya || "");
    }
  }, [isEdit, postToEdit]);

  const sanitizePostData = useCallback((data) => {
    return data ? { ...data } : {};
  }, []);

  const handleChangeInput = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setPostData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }, []);

  const handleWilayaChange = useCallback((event) => {
    const selectedWilaya = event.target.value;
    setSelectedWilaya(selectedWilaya);
    const wilayaEncontrada = communesjson.find((wilaya) => wilaya.wilaya === selectedWilaya);
    const communes = wilayaEncontrada?.commune || [];

    setPostData(prev => ({
      ...prev,
      wilaya: selectedWilaya,
      commune: communes[0] || "",
    }));
  }, []);

  const handleCommuneChange = useCallback((event) => {
    const selectedCommune = event.target.value;
    setPostData(prev => ({ ...prev, commune: selectedCommune }));
  }, []);

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

  const deleteImages = useCallback((index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!postData.subCategory) {
      showAlertMessage(t('validation_category_required'), "danger");
      return;
    }

    if (!postData.wilaya || !postData.commune) {
      showAlertMessage(t('validation_wilaya_required'), "danger");
      return;
    }

    if (images.length === 0) {
      showAlertMessage(t('validation_images_required'), "danger");
      return;
    }

    try {
      const actionData = {
        postData: { ...postData },
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
  }, [postData, images, auth, isEdit, postToEdit, dispatch, history, t]);

  const showAlertMessage = useCallback((message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
  }, []);

  const renderVoyageOrganise = useMemo(() => (
    <>
      <DateDeparRetour postData={postData} handleChangeInput={handleChangeInput} />
      <HoraDepart postData={postData} handleChangeInput={handleChangeInput} />
      <DurationDisplay postData={postData} handleChangeInput={handleChangeInput} />
      <DestinationVoyagesOrganises postData={postData} handleChangeInput={handleChangeInput} />
      <TransportVoyagesOrganises postData={postData} handleChangeInput={handleChangeInput} />
      <NombreLugarVoyagesOrganises postData={postData} handleChangeInput={handleChangeInput} />
      <AlojamientoVoyagesOrganises postData={postData} handleChangeInput={handleChangeInput} />
      <TarifasYprecios postData={postData} handleChangeInput={handleChangeInput} category="voyagesorganises" />
    </>
  ), [postData, handleChangeInput]);

  const renderLocationVacances = useMemo(() => (
    <>
      <DateDeparRetour postData={postData} handleChangeInput={handleChangeInput} />
      <HoraDepart postData={postData} handleChangeInput={handleChangeInput} />
      <DurationDisplay postData={postData} handleChangeInput={handleChangeInput} />
      <DestinationLocationVacances postData={postData} handleChangeInput={handleChangeInput} />
      <AlojamientoLocationVacances postData={postData} handleChangeInput={handleChangeInput} />
      <ServiciosLocationVacances postData={postData} handleChangeInput={handleChangeInput} />
      <TarifasYprecios postData={postData} handleChangeInput={handleChangeInput} category="locationvacances" />
    </>
  ), [postData, handleChangeInput]);

  const renderHadjOmra = useMemo(() => (
    <>
      <DateDeparRetour postData={postData} handleChangeInput={handleChangeInput} />
      <HoraDepart postData={postData} handleChangeInput={handleChangeInput} />
      <DurationDisplay postData={postData} handleChangeInput={handleChangeInput} />
      <DestinationHajjOmra postData={postData} handleChangeInput={handleChangeInput} />
      <TransportHajjOmra postData={postData} handleChangeInput={handleChangeInput} />
      <AlojamientoHajjOmra postData={postData} handleChangeInput={handleChangeInput} />
      <ServiciosHajjOmra postData={postData} handleChangeInput={handleChangeInput} />
      <TarifasYpreciosomra postData={postData} handleChangeInput={handleChangeInput} />
    </>
  ), [postData, handleChangeInput]);

  const renderCategoryFields = useMemo(() => {
    switch (postData.subCategory) {
      case "Voyage Organise": return renderVoyageOrganise;
      case "Location_Vacances": return renderLocationVacances;
      case "hadj_Omra": return renderHadjOmra;
      default: return null;
    }
  }, [postData.subCategory, renderVoyageOrganise, renderLocationVacances, renderHadjOmra]);

  const wilayasOptions = useMemo(() =>
    communesjson.map((wilaya, index) => (
      <option key={index} value={wilaya.wilaya}>{wilaya.wilaya}</option>
    )), []);

  const communesOptions = useMemo(() =>
    selectedWilaya
      ? communesjson
        .find((wilaya) => wilaya.wilaya === selectedWilaya)
        ?.commune?.map((commune, index) => (
          <option key={index} value={commune}>{commune}</option>
        )) || []
      : [], [selectedWilaya]);

  return (
    <Container fluid className="p-2" dir={isRTL ? "rtl" : "ltr"}>
      <Row className="g-0">
        <Col xs={12}>
          <Card className="border-0 rounded-0">
            <Card.Header className={`${isEdit ? "bg-warning text-dark" : "my-2 text-white"} ps-3`}>
              <Row className="align-items-center g-0">
                <Col>
                  <h2 className="mb-1 fs-6">
                    {isEdit ? t('edit_title', 'Modifier la Publication') : t('create_title', 'Créer une Nouvelle Publication')}
                  </h2>
                  {isEdit && postToEdit?.title && (
                    <p className="mb-0 opacity-75 small">
                      {t('modification', 'Modification de')}: "{postToEdit.title}"
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
                  <CategorySelector postData={postData} handleChangeInput={handleChangeInput} />
                </div>

                {postData.subCategory && (
                  <>
                    <div className="px-2">
                      <DescriptionTextarea postData={postData} handleChangeInput={handleChangeInput} />
                      <AddressInput
                        postData={postData}
                        handleChangeInput={handleChangeInput}
                        wilayasOptions={wilayasOptions}
                        communesOptions={communesOptions}
                        handleWilayaChange={handleWilayaChange}
                        handleCommuneChange={handleCommuneChange}
                      />
                    </div>

                    {renderCategoryFields}

                    <div className="px-2">
                      <ContactReservation postData={postData} handleChangeInput={handleChangeInput} />
                    </div>

                    <div className="px-2">
                      <ImageUpload
                        images={images}
                        handleChangeImages={handleChangeImages}
                        deleteImages={deleteImages}
                        theme={theme}
                      />
                    </div>

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
                              {isEdit ? t('button_update', 'Mettre à jour') : t('button_publish', 'Publier')}
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
                            {t('common.cancel', 'Annuler')}
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
                        {t('select_category_first')}
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

export default React.memo(Createpost);