import React from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// Datos de las wilayas de Argelia con traducciones
const algeriaWilayas = [
  { code: '01', name: { fr: 'Adrar', ar: 'أدرار' } },
  { code: '02', name: { fr: 'Chlef', ar: 'الشلف' } },
  { code: '03', name: { fr: 'Laghouat', ar: 'الأغواط' } },
  { code: '04', name: { fr: 'Oum El Bouaghi', ar: 'أم البواقي' } },
  { code: '05', name: { fr: 'Batna', ar: 'باتنة' } },
  { code: '06', name: { fr: 'Béjaïa', ar: 'بجاية' } },
  { code: '07', name: { fr: 'Biskra', ar: 'بسكرة' } },
  { code: '08', name: { fr: 'Béchar', ar: 'بشار' } },
  { code: '09', name: { fr: 'Blida', ar: 'البليدة' } },
  { code: '10', name: { fr: 'Bouira', ar: 'البويرة' } },
  { code: '11', name: { fr: 'Tamanrasset', ar: 'تمنراست' } },
  { code: '12', name: { fr: 'Tébessa', ar: 'تبسة' } },
  { code: '13', name: { fr: 'Tlemcen', ar: 'تلمسان' } },
  { code: '14', name: { fr: 'Tiaret', ar: 'تيارت' } },
  { code: '15', name: { fr: 'Tizi Ouzou', ar: 'تيزي وزو' } },
  { code: '16', name: { fr: 'Alger', ar: 'الجزائر' } },
  { code: '17', name: { fr: 'Djelfa', ar: 'الجلفة' } },
  { code: '18', name: { fr: 'Jijel', ar: 'جيجل' } },
  { code: '19', name: { fr: 'Sétif', ar: 'سطيف' } },
  { code: '20', name: { fr: 'Saïda', ar: 'سعيدة' } },
  { code: '21', name: { fr: 'Skikda', ar: 'سكيكدة' } },
  { code: '22', name: { fr: 'Sidi Bel Abbès', ar: 'سيدي بلعباس' } },
  { code: '23', name: { fr: 'Annaba', ar: 'عنابة' } },
  { code: '24', name: { fr: 'Guelma', ar: 'قالمة' } },
  { code: '25', name: { fr: 'Constantine', ar: 'قسنطينة' } },
  { code: '26', name: { fr: 'Médéa', ar: 'المدية' } },
  { code: '27', name: { fr: 'Mostaganem', ar: 'مستغانم' } },
  { code: '28', name: { fr: 'M\'Sila', ar: 'المسيلة' } },
  { code: '29', name: { fr: 'Mascara', ar: 'معسكر' } },
  { code: '30', name: { fr: 'Ouargla', ar: 'ورقلة' } },
  { code: '31', name: { fr: 'Oran', ar: 'وهران' } },
  { code: '32', name: { fr: 'El Bayadh', ar: 'البيض' } },
  { code: '33', name: { fr: 'Illizi', ar: 'إليزي' } },
  { code: '34', name: { fr: 'Bordj Bou Arréridj', ar: 'برج بوعريريج' } },
  { code: '35', name: { fr: 'Boumerdès', ar: 'بومرداس' } },
  { code: '36', name: { fr: 'El Tarf', ar: 'الطارف' } },
  { code: '37', name: { fr: 'Tindouf', ar: 'تندوف' } },
  { code: '38', name: { fr: 'Tissemsilt', ar: 'تيسمسيلت' } },
  { code: '39', name: { fr: 'El Oued', ar: 'الوادي' } },
  { code: '40', name: { fr: 'Khenchela', ar: 'خنشلة' } },
  { code: '41', name: { fr: 'Souk Ahras', ar: 'سوق أهراس' } },
  { code: '42', name: { fr: 'Tipaza', ar: 'تيبازة' } },
  { code: '43', name: { fr: 'Mila', ar: 'ميلة' } },
  { code: '44', name: { fr: 'Aïn Defla', ar: 'عين الدفلى' } },
  { code: '45', name: { fr: 'Naâma', ar: 'النعامة' } },
  { code: '46', name: { fr: 'Aïn Témouchent', ar: 'عين تموشنت' } },
  { code: '47', name: { fr: 'Ghardaïa', ar: 'غرداية' } },
  { code: '48', name: { fr: 'Relizane', ar: 'غليزان' } },
  { code: '49', name: { fr: 'El M\'Ghair', ar: 'المغير' } },
  { code: '50', name: { fr: 'El Menia', ar: 'المنيعة' } },
  { code: '51', name: { fr: 'Ouled Djellal', ar: 'أولاد جلال' } },
  { code: '52', name: { fr: 'Bordj Badji Mokhtar', ar: 'برج باجي مختار' } },
  { code: '53', name: { fr: 'Béni Abbès', ar: 'بني عباس' } },
  { code: '54', name: { fr: 'Timimoun', ar: 'تيميمون' } },
  { code: '55', name: { fr: 'Touggourt', ar: 'تقرت' } },
  { code: '56', name: { fr: 'Djanet', ar: 'جانت' } },
  { code: '57', name: { fr: 'In Salah', ar: 'عين صالح' } },
  { code: '58', name: { fr: 'In Guezzam', ar: 'عين قزام' } }
];

const AddressInput = ({ 
    postData, 
    handleChangeInput 
}) => {
    const { t, i18n } = useTranslation(["categories"]);
    const isRTL = i18n.language === 'ar';
    const currentLanguage = i18n.language;

    // Generar opciones de wilayas basadas en el idioma actual
    const wilayasOptions = algeriaWilayas.map((wilaya) => (
        <option key={wilaya.code} value={wilaya.name[currentLanguage === 'ar' ? 'ar' : 'fr']}>
            {wilaya.name[currentLanguage === 'ar' ? 'ar' : 'fr']}
        </option>
    ));

    return (
        <Card className="mb-3">
            <Card.Header>
                <h5 className="mb-0">
                    📍 {t('addressTitlee', 'Lieu de Rassemblement')}
                </h5>
                <small className="text-muted">
                    {t('addressSubtitle', 'Lieu de rencontre des voyageurs')}
                </small>
            </Card.Header>
            <Card.Body className="p-3">
                {/* Fila 1: Wilaya y Commune en la misma fila */}
                <Row className={`g-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {/* Columna Wilaya */}
                    <Col xs={12} md={6}>
                        <Form.Group className="w-100">
                            <Form.Label className={isRTL ? 'text-end d-block' : ''}>
                                {t('wilaya', 'Wilaya')} *
                            </Form.Label>
                            <Form.Select
                                name="wilaya"
                                value={postData.wilaya || ''}
                                onChange={handleChangeInput}
                                required
                                className={`w-100 ${isRTL ? 'text-end' : ''}`}
                                dir={isRTL ? 'rtl' : 'ltr'}
                                size="lg"
                            >
                                <option value="">{t('selectWilaya', 'Sélectionnez la wilaya')}</option>
                                {wilayasOptions}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    
                    {/* Columna Commune */}
                    <Col xs={12} md={6}>
                        <Form.Group className="w-100">
                            <Form.Label className={isRTL ? 'text-end d-block' : ''}>
                                {t('commune', 'Commune')} *
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="commune"
                                value={postData.commune || ''}
                                onChange={handleChangeInput}
                                placeholder={t('communePlaceholder', 'Ex: Bab El Oued, Sidi Mhamed, Hussein Dey...')}
                                required
                                className={`w-100 ${isRTL ? 'text-end' : ''}`}
                                dir={isRTL ? 'rtl' : 'ltr'}
                                size="lg"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Fila 2: Dirección específica debajo */}
                <Row className={`g-3 mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Col xs={12}>
                        <Form.Group className="w-100">
                            <Form.Label className={isRTL ? 'text-end d-block' : ''}>
                                {t('specificAddress', 'Adresse spécifique')}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="vile"
                                value={postData.vile || ''}
                                onChange={handleChangeInput}
                                placeholder={t('specificAddressPlaceholder', 'Ex: Rue, lieu précis, point de rendez-vous...')}
                                className={`w-100 ${isRTL ? 'text-end' : ''}`}
                                dir={isRTL ? 'rtl' : 'ltr'}
                                size="lg"
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default AddressInput;