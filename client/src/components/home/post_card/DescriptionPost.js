import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaComment, FaPhone, FaMapMarkerAlt, FaTag, FaPalette, FaRuler, FaVenusMars, FaCloudSun, FaTshirt, FaStore, FaEnvelope, FaCalendarAlt, FaSyncAlt, FaEye, FaShoppingCart, FaBoxes, FaBox } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';

const DescriptionPost = ({ post }) => {
    const [readMore, setReadMore] = useState(false);
    const [isTranslationsReady, setIsTranslationsReady] = useState(false);
    
    const { auth, message, languageReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();
    
    const lang = languageReducer.language || 'fr';
    const { t, i18n } = useTranslation(['descripcion', 'createpost']);
    const isRTL = lang === 'ar';

    useEffect(() => {
        const changeLanguage = async () => {
            if (i18n.language !== lang) {
                await i18n.changeLanguage(lang);
            }
            setIsTranslationsReady(true);
        };
        
        changeLanguage();
    }, [lang, i18n]);

    // 🔥 FUNCIÓN DE TRADUCCIÓN MEJORADA
    const translateOption = useCallback((optionKey, fallback = '') => {
        if (!optionKey) return fallback;
        
        // Intentar traducir desde createpost primero
        const translation = t(`createpost:options.${optionKey}`, { defaultValue: '' });
        if (translation) return translation;
        
        // Si no existe, intentar desde descripcion
        const descripcionTranslation = t(`descripcion:${optionKey}`, { defaultValue: '' });
        return descripcionTranslation || fallback || optionKey;
    }, [t]);

    // LÓGICA DEL CHAT (se mantiene igual)
    const handleChatWithOwner = () => {
        if (!auth.user) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: { error: t('descripcion:loginToChat') } 
            });
            return;
        }

        if (!post.user || !post.user._id) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: { error: t('descripcion:cannotContactSeller') } 
            });
            return;
        }

        try {
            const existingConversation = message.data.find(item => item._id === post.user._id);
            
            if (existingConversation) {
                history.push(`/message/${post.user._id}`);
                return;
            }

            dispatch({
                type: MESS_TYPES.ADD_USER,
                payload: { 
                    ...post.user, 
                    text: '', 
                    media: [],
                    postTitle: post.title || t('descripcion:generalProduct'),
                    postId: post._id
                }
            });

            history.push(`/message/${post.user._id}`);

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { success: t('descripcion:conversationStarted') }
            });

        } catch (error) {
            console.error('Erreur lors du démarrage de la conversation:', error);
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: t('descripcion:chatError') }
            });
        }
    };

    const handleCallOwner = () => {
        if (!post.phone) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: { error: t('descripcion:phoneNotAvailable') } 
            });
            return;
        }
        
        if (window.confirm(t('descripcion:confirmCall', { phone: post.phone }))) {
            window.location.href = `tel:${post.phone}`;
        }
    };

    const handleOpenMap = () => {
        if (!post.location && !post.wilaya && !post.commune) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: { error: t('descripcion:locationNotAvailable') } 
            });
            return;
        }

        try {
            localStorage.setItem('currentPost', JSON.stringify(post));
        } catch (error) {
            console.log("Error guardando en localStorage:", error);
        }

        history.push('/map', { 
            postData: post 
        });
    };

    // 🎨 ESTILOS (se mantienen igual)
    const styles = {
        primaryColor: "#8b5cf6",
        accentColor: "#f472b6",
        successColor: "#34d399",
        warningColor: "#fbbf24",
        textDark: "#000000",
        textMedium: "#374151",
        textLight: "#ffffff",
        mainGradient: "linear-gradient(135deg, #f472b6 0%, #8b5cf6 100%)",
        contactGradient: "linear-gradient(135deg, #fbbf24 0%, #f472b6 100%)",
        cardShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
    };

    // TRADUCCIONES PARA LOS VALORES
    const getTranslatedValue = (field, value) => {
        if (!value) return '';
        
        // Para arrays, traducir cada elemento
        if (Array.isArray(value)) {
            return value.map(item => translateOption(`${field}.${item}`, item)).join(', ');
        }
        
        // Para valores individuales
        return translateOption(`${field}.${value}`, value);
    };

    // 🔥 NUEVO: Obtener ícono para tipo de venta
    const getSaleTypeIcon = (saleType) => {
        switch(saleType) {
            case 'retail': return <FaShoppingCart />;
            case 'wholesale': return <FaBoxes />;
            case 'both': return <FaBox />;
            default: return <FaShoppingCart />;
        }
    };

    // 🔥 NUEVO: Obtener color para tipo de venta
    const getSaleTypeColor = (saleType) => {
        switch(saleType) {
            case 'retail': return '#3b82f6'; // Azul
            case 'wholesale': return '#10b981'; // Verde
            case 'both': return '#f59e0b'; // Amarillo
            default: return '#6b7280';
        }
    };

    // ✨ COMPONENTE PARA MOSTRAR CAMPO - ACTUALIZADO CON TAMAÑO MÁS GRANDE
    const FieldDisplay = ({ label, value, icon, type = "text", isHighlighted = false }) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return null;

        const displayValue = type === 'translated' ? getTranslatedValue(type, value) : value;

        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px', // 🔥 Aumentado de 10px a 12px
                padding: '10px 0', // 🔥 Aumentado de 8px a 10px
                flexDirection: isRTL ? 'row-reverse' : 'row',
                width: '100%',
                wordBreak: 'break-word',
                backgroundColor: isHighlighted ? '#f0f9ff' : 'transparent',
                borderRadius: isHighlighted ? '8px' : '0',
                paddingLeft: isHighlighted ? '12px' : '0',
                paddingRight: isHighlighted ? '12px' : '0'
            }}>
                <span style={{
                    fontWeight: '600',
                    color: isHighlighted ? '#1e40af' : '#000000',
                    minWidth: isRTL ? 'auto' : '160px', // 🔥 Aumentado de 140px a 160px
                    fontSize: '17px', // 🔥 Aumentado de 16px a 17px
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px', // 🔥 Aumentado de 8px a 10px
                    flexShrink: 0,
                    textAlign: isRTL ? 'right' : 'left'
                }}>
                    {icon} {label}:
                </span>
                <span style={{ 
                    fontSize: '17px', // 🔥 Aumentado de 16px a 17px
                    color: isHighlighted ? '#1e40af' : '#374151',
                    fontWeight: isHighlighted ? '700' : '500',
                    flex: 1,
                    textAlign: isRTL ? 'right' : 'left',
                    wordBreak: 'break-word',
                    backgroundColor: isHighlighted ? '#dbeafe' : '#f8fafc',
                    padding: '8px 14px', // 🔥 Aumentado de 6px 12px a 8px 14px
                    borderRadius: '8px',
                    border: isHighlighted ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                    lineHeight: '1.5'
                }}>
                    {displayValue}
                </span>
            </div>
        );
    };

    // 💰 COMPONENTE PRECIO - ACTUALIZADO
    const PriceDisplay = () => {
        if (!post.price) return null;

        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px', // 🔥 Aumentado de 16px a 20px
                backgroundColor: '#ecfdf5',
                borderRadius: '10px', // 🔥 Aumentado de 8px a 10px
                border: '2px solid #10b981',
                marginBottom: '16px', // 🔥 Aumentado de 12px a 16px
                flexDirection: isRTL ? 'row-reverse' : 'row',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <span style={{ 
                    fontWeight: '700',
                    color: '#000000',
                    fontSize: '20px', // 🔥 Aumentado de 18px a 20px
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px' // 🔥 Aumentado de 8px a 10px
                }}>
                    💰 {t('descripcion:price')}:
                </span>
                <div style={{ textAlign: isRTL ? 'left' : 'right' }}>
                    <div style={{ 
                        fontSize: '28px', // 🔥 Aumentado de 24px a 28px
                        fontWeight: '800',
                        color: '#065f46'
                    }}>
                        {post.price} {post.currency || 'DZD'}
                    </div>
                </div>
            </div>
        );
    };

    // 🔥 NUEVA SECCIÓN: INFORMACIÓN DE VENTA
    const generateSaleInfoSection = () => {
        if (!post.saleType) return null;

        return (
            <div style={{
                backgroundColor: '#fef7ff',
                padding: '20px', // 🔥 Aumentado de 16px a 20px
                borderRadius: '10px', // 🔥 Aumentado de 8px a 10px
                marginBottom: '16px', // 🔥 Aumentado de 12px a 16px
                border: `2px solid ${getSaleTypeColor(post.saleType)}`,
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <h2 style={{
                    marginBottom: '20px', // 🔥 Aumentado de 16px a 20px
                    color: getSaleTypeColor(post.saleType),
                    fontSize: '22px', // 🔥 Aumentado de 20px a 22px
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px' // 🔥 Aumentado de 8px a 10px
                }}>
                    {getSaleTypeIcon(post.saleType)} {t('descripcion:saleInfo')}
                </h2>
                
                {/* Tipo de Venta */}
                <FieldDisplay
                    label={t('descripcion:saleType')}
                    value={post.saleType}
                    icon={getSaleTypeIcon(post.saleType)}
                    type="saleTypes"
                    isHighlighted={true}
                />
                
                {/* Cantidad Mínima para Venta al Por Mayor */}
                {(post.saleType === 'wholesale' || post.saleType === 'both') && post.minQuantity && (
                    <FieldDisplay
                        label={t('descripcion:minQuantity')}
                        value={`${post.minQuantity} ${t('descripcion:units')}`}
                        icon="📦"
                        isHighlighted={true}
                    />
                )}

                {/* Información adicional según el tipo de venta */}
                <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#faf5ff',
                    borderRadius: '8px',
                    border: '1px solid #e9d5ff'
                }}>
                    <p style={{
                        fontSize: '16px',
                        color: '#6b7280',
                        fontWeight: '500',
                        margin: 0,
                        textAlign: isRTL ? 'right' : 'left',
                        lineHeight: '1.5'
                    }}>
                        {post.saleType === 'retail' && t('descripcion:saleTypeRetailInfo')}
                        {post.saleType === 'wholesale' && t('descripcion:saleTypeWholesaleInfo')}
                        {post.saleType === 'both' && t('descripcion:saleTypeBothInfo')}
                    </p>
                </div>
            </div>
        );
    };

    // 🔹 SECCIÓN PRINCIPAL - ACTUALIZADA
    const generateMainSection = () => {
        return (
            <div style={{
                background: styles.mainGradient,
                color: 'white',
                padding: '24px', // 🔥 Aumentado de 20px a 24px
                borderRadius: '12px',
                marginBottom: '20px', // 🔥 Aumentado de 16px a 20px
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <h1 style={{
                    margin: '0 0 16px 0', // 🔥 Aumentado de 12px a 16px
                    fontSize: '26px', // 🔥 Aumentado de 24px a 26px
                    fontWeight: '800',
                    wordBreak: 'break-word'
                }}>
                    {post.title}
                </h1>
                <p style={{
                    fontSize: '19px', // 🔥 Aumentado de 18px a 19px
                    opacity: '0.95',
                    lineHeight: '1.5',
                    marginBottom: '20px', // 🔥 Aumentado de 16px a 20px
                    wordBreak: 'break-word',
                    fontWeight: '600'
                }}>
                    {getTranslatedValue('categories', post.subCategory)} 
                    {post.subSubCategory && ` - ${getTranslatedValue('categories', post.subSubCategory)}`}
                </p>

                {/* Información clave */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px', // 🔥 Aumentado de 16px a 20px
                    flexWrap: 'wrap'
                }}>
                    {post.brand && (
                        <div style={{ 
                            textAlign: 'center', 
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            padding: '14px 18px', // 🔥 Aumentado de 12px 16px a 14px 18px
                            borderRadius: '8px',
                            minWidth: '140px' // 🔥 Aumentado de 120px a 140px
                        }}>
                            <div style={{ 
                                fontSize: '15px', // 🔥 Aumentado de 14px a 15px
                                opacity: '0.9',
                                fontWeight: '600',
                                marginBottom: '6px' // 🔥 Aumentado de 4px a 6px
                            }}>
                                {t('descripcion:brand')}
                            </div>
                            <div style={{ 
                                fontSize: '18px', // 🔥 Aumentado de 16px a 18px
                                fontWeight: '700'
                            }}>
                                {post.brand}
                            </div>
                        </div>
                    )}

                    {post.condition && (
                        <div style={{ 
                            textAlign: 'center',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            padding: '14px 18px', // 🔥 Aumentado
                            borderRadius: '8px',
                            minWidth: '140px' // 🔥 Aumentado
                        }}>
                            <div style={{ 
                                fontSize: '15px', // 🔥 Aumentado
                                opacity: '0.9',
                                fontWeight: '600',
                                marginBottom: '6px' // 🔥 Aumentado
                            }}>
                                {t('descripcion:condition')}
                            </div>
                            <div style={{
                                fontSize: '18px', // 🔥 Aumentado
                                fontWeight: '700'
                            }}>
                                {getTranslatedValue('conditions', post.condition)}
                            </div>
                        </div>
                    )}

                    {post.bootiquename && (
                        <div style={{ 
                            textAlign: 'center',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            padding: '14px 18px', // 🔥 Aumentado
                            borderRadius: '8px',
                            minWidth: '140px' // 🔥 Aumentado
                        }}>
                            <div style={{ 
                                fontSize: '15px', // 🔥 Aumentado
                                opacity: '0.9',
                                fontWeight: '600',
                                marginBottom: '6px' // 🔥 Aumentado
                            }}>
                                {t('descripcion:boutique')}
                            </div>
                            <div style={{
                                fontSize: '18px', // 🔥 Aumentado
                                fontWeight: '700'
                            }}>
                                {post.bootiquename}
                            </div>
                        </div>
                    )}

                    {/* 🔥 NUEVO: Mostrar tipo de venta en la sección principal */}
                    {post.saleType && (
                        <div style={{ 
                            textAlign: 'center',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            padding: '14px 18px',
                            borderRadius: '8px',
                            minWidth: '140px'
                        }}>
                            <div style={{ 
                                fontSize: '15px',
                                opacity: '0.9',
                                fontWeight: '600',
                                marginBottom: '6px'
                            }}>
                                {t('descripcion:saleType')}
                            </div>
                            <div style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                            }}>
                                {getSaleTypeIcon(post.saleType)}
                                {getTranslatedValue('saleTypes', post.saleType)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // 🔹 SECCIÓN DESCRIPCIÓN - ACTUALIZADA
    const generateDescriptionSection = () => {
        if (!post.description && !post.content) return null;

        const textToShow = post.description || post.content;

        return (
            <div style={{
                backgroundColor: '#f8fafc',
                padding: '20px', // 🔥 Aumentado de 16px a 20px
                borderRadius: '10px', // 🔥 Aumentado de 8px a 10px
                marginBottom: '16px', // 🔥 Aumentado de 12px a 16px
                border: '1px solid #e5e7eb',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <h2 style={{
                    marginBottom: '16px', // 🔥 Aumentado de 12px a 16px
                    color: styles.primaryColor,
                    fontSize: '22px', // 🔥 Aumentado de 20px a 22px
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px' // 🔥 Aumentado de 8px a 10px
                }}>
                    <FaTag /> {t('descripcion:description')}
                </h2>
                <div style={{
                    fontSize: '17px', // 🔥 Aumentado de 16px a 17px
                    color: '#374151',
                    lineHeight: '1.6',
                    textAlign: isRTL ? 'right' : 'left',
                    wordBreak: 'break-word'
                }}>
                    <span>
                        {
                            textToShow.length < 120
                                ? textToShow
                                : readMore ? textToShow + ' ' : textToShow.slice(0, 120) + '...'
                        }
                    </span>
                    {textToShow.length > 120 && (
                        <span
                            style={{
                                color: styles.primaryColor,
                                cursor: 'pointer',
                                fontWeight: '600',
                                marginLeft: isRTL ? '0' : '10px', // 🔥 Aumentado de 8px a 10px
                                marginRight: isRTL ? '10px' : '0', // 🔥 Aumentado
                                fontSize: '16px', // 🔥 Aumentado de 15px a 16px
                                display: 'inline-block',
                                marginTop: '10px' // 🔥 Aumentado de 8px a 10px
                            }}
                            onClick={() => setReadMore(!readMore)}
                        >
                            {readMore ? t('descripcion:seeLess') : t('descripcion:readMore')}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    // 🔹 SECCIÓN INFORMACIÓN PRODUCTO - ACTUALIZADA
    const generateProductInfoSection = () => {
        return (
            <div style={{
                backgroundColor: '#f0f9ff',
                padding: '20px', // 🔥 Aumentado
                borderRadius: '10px', // 🔥 Aumentado
                marginBottom: '16px', // 🔥 Aumentado
                border: '1px solid #bae6fd',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <h2 style={{
                    marginBottom: '20px', // 🔥 Aumentado
                    color: styles.primaryColor,
                    fontSize: '22px', // 🔥 Aumentado
                    fontWeight: '700'
                }}>
                    {t('descripcion:productInfo')}
                </h2>
                
                <FieldDisplay
                    label={t('descripcion:category')}
                    value={post.subCategory}
                    icon={<FaTag />}
                    type="categories"
                />
                
                <FieldDisplay
                    label={t('descripcion:subCategory')}
                    value={post.subSubCategory}
                    icon={<FaTag />}
                    type="categories"
                />
                
                <FieldDisplay
                    label={t('descripcion:gender')}
                    value={post.gender}
                    icon={<FaVenusMars />}
                    type="genders"
                />
                
                <FieldDisplay
                    label={t('descripcion:season')}
                    value={post.season}
                    icon={<FaCloudSun />}
                    type="seasons"
                />
                
                <FieldDisplay
                    label={t('descripcion:material')}
                    value={post.material}
                    icon={<FaTshirt />}
                    type="materials"
                />
                
                <FieldDisplay
                    label={t('descripcion:condition')}
                    value={post.condition}
                    icon="⭐"
                    type="conditions"
                />
            </div>
        );
    };

    // 🔹 SECCIÓN CARACTERÍSTICAS - ACTUALIZADA
    const generateFeaturesSection = () => {
        return (
            <div style={{
                backgroundColor: '#f0fdf4',
                padding: '20px', // 🔥 Aumentado
                borderRadius: '10px', // 🔥 Aumentado
                marginBottom: '16px', // 🔥 Aumentado
                border: '1px solid #bbf7d0',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <h2 style={{
                    marginBottom: '20px', // 🔥 Aumentado
                    color: styles.successColor,
                    fontSize: '22px', // 🔥 Aumentado
                    fontWeight: '700'
                }}>
                    {t('descripcion:features')}
                </h2>

                <FieldDisplay
                    label={t('descripcion:sizes')}
                    value={post.sizes}
                    icon={<FaRuler />}
                    type="sizes"
                />

                <FieldDisplay
                    label={t('descripcion:colors')}
                    value={post.colors}
                    icon={<FaPalette />}
                    type="colors"
                />

                <FieldDisplay
                    label={t('descripcion:tags')}
                    value={post.tags}
                    icon={<FaTag />}
                />
            </div>
        );
    };

    // 🔹 SECCIÓN PRECIO - ACTUALIZADA
    const generatePricingSection = () => {
        return (
            <div style={{
                backgroundColor: '#fffbeb',
                padding: '20px', // 🔥 Aumentado
                borderRadius: '10px', // 🔥 Aumentado
                marginBottom: '16px', // 🔥 Aumentado
                border: '1px solid #fde68a',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <h2 style={{
                    marginBottom: '20px', // 🔥 Aumentado
                    color: styles.warningColor,
                    fontSize: '22px', // 🔥 Aumentado
                    fontWeight: '700'
                }}>
                    {t('descripcion:pricing')}
                </h2>
                <PriceDisplay />
            </div>
        );
    };

    // 🔹 SECCIÓN UBICACIÓN - ACTUALIZADA
    const generateLocationSection = () => {
        return (
            <div style={{
                backgroundColor: '#faf5ff',
                padding: '20px', // 🔥 Aumentado
                borderRadius: '10px', // 🔥 Aumentado
                marginBottom: '16px', // 🔥 Aumentado
                border: '1px solid #e9d5ff',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <h2 style={{
                    marginBottom: '20px', // 🔥 Aumentado
                    color: styles.primaryColor,
                    fontSize: '22px', // 🔥 Aumentado
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px' // 🔥 Aumentado
                }}>
                    <FaMapMarkerAlt /> {t('descripcion:location')}
                </h2>

                <FieldDisplay
                    label={t('descripcion:wilaya')}
                    value={post.wilaya}
                    icon="🏛️"
                    type="wilayas"
                />
                
                <FieldDisplay
                    label={t('descripcion:commune')}
                    value={post.commune}
                    icon="🏘️"
                />
                
                <FieldDisplay
                    label={t('descripcion:address')}
                    value={post.location}
                    icon="📍"
                />
            </div>
        );
    };

    // 🔹 SECCIÓN INFORMACIÓN ADICIONAL - ACTUALIZADA
    const generateAdditionalInfoSection = () => {
        return (
            <div style={{
                backgroundColor: '#f8fafc',
                padding: '20px', // 🔥 Aumentado
                borderRadius: '10px', // 🔥 Aumentado
                marginBottom: '16px', // 🔥 Aumentado
                border: '1px solid #e5e7eb',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <h2 style={{
                    marginBottom: '20px', // 🔥 Aumentado
                    color: styles.primaryColor,
                    fontSize: '22px', // 🔥 Aumentado
                    fontWeight: '700'
                }}>
                    {t('descripcion:additionalInfo')}
                </h2>

                {/* Fechas de publicación */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px', // 🔥 Aumentado de 8px a 10px
                    marginBottom: '12px', // 🔥 Aumentado de 10px a 12px
                    flexDirection: isRTL ? 'row-reverse' : 'row'
                }}>
                    <FaCalendarAlt style={{ color: '#6b7280', fontSize: '18px' }} /> {/* 🔥 Aumentado */}
                    <span style={{ fontWeight: '600', color: '#000000', fontSize: '17px' }}> {/* 🔥 Aumentado */}
                        {t('descripcion:publishedOn')}:
                    </span>
                    <span style={{ color: '#374151', fontSize: '17px' }}> {/* 🔥 Aumentado */}
                        {new Date(post.createdAt).toLocaleDateString()} à {new Date(post.createdAt).toLocaleTimeString()}
                    </span>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px', // 🔥 Aumentado
                    marginBottom: '12px', // 🔥 Aumentado
                    flexDirection: isRTL ? 'row-reverse' : 'row'
                }}>
                    <FaSyncAlt style={{ color: '#6b7280', fontSize: '18px' }} /> {/* 🔥 Aumentado */}
                    <span style={{ fontWeight: '600', color: '#000000', fontSize: '17px' }}> {/* 🔥 Aumentado */}
                        {t('descripcion:updatedOn')}:
                    </span>
                    <span style={{ color: '#374151', fontSize: '17px' }}> {/* 🔥 Aumentado */}
                        {new Date(post.updatedAt).toLocaleDateString()} à {new Date(post.updatedAt).toLocaleTimeString()}
                    </span>
                </div>

                {/* Vistas */}
                {(post.vistas || []).length > 0 && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px', // 🔥 Aumentado
                        flexDirection: isRTL ? 'row-reverse' : 'row'
                    }}>
                        <FaEye style={{ color: '#6b7280', fontSize: '18px' }} /> {/* 🔥 Aumentado */}
                        <span style={{ fontWeight: '600', color: '#000000', fontSize: '17px' }}> {/* 🔥 Aumentado */}
                            {t('descripcion:views')}:
                        </span>
                        <span style={{ color: '#374151', fontSize: '17px' }}> {/* 🔥 Aumentado */}
                            {post.vistas}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    // 🔹 SECCIÓN CONTACTO - ACTUALIZADA
    const generateContactSection = () => {
        return (
            <div style={{
                background: styles.contactGradient,
                color: 'white',
                padding: '20px', // 🔥 Aumentado de 16px a 20px
                borderRadius: '10px', // 🔥 Aumentado de 8px a 10px
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <h2 style={{
                    margin: '0 0 20px 0', // 🔥 Aumentado de 16px a 20px
                    fontSize: '22px', // 🔥 Aumentado de 20px a 22px
                    fontWeight: '700'
                }}>
                    {t('descripcion:readyToBuy')}
                </h2>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px', // 🔥 Aumentado de 8px a 10px
                    marginBottom: '20px' // 🔥 Aumentado de 16px a 20px
                }}>
                    {/* Teléfono */}
                    <div 
                        style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px', // 🔥 Aumentado de 6px a 8px
                            cursor: post.phone ? 'pointer' : 'not-allowed',
                            padding: '12px 14px', // 🔥 Aumentado de 10px 12px a 12px 14px
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            flex: 1,
                            justifyContent: 'center'
                        }}
                        onClick={post.phone ? handleCallOwner : undefined}
                    >
                        <FaPhone size={20} /> {/* 🔥 Aumentado de 18px a 20px */}
                        <span style={{ fontSize: '16px', fontWeight: '600' }}> {/* 🔥 Aumentado de 15px a 16px */}
                            {post.phone ? t('descripcion:call') : t('descripcion:notAvailable')}
                        </span>
                    </div>

                    {/* Chat */}
                    <div 
                        style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px', // 🔥 Aumentado
                            cursor: 'pointer',
                            padding: '12px 14px', // 🔥 Aumentado
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            flex: 1,
                            justifyContent: 'center'
                        }}
                        onClick={handleChatWithOwner}
                    >
                        <FaComment size={20} /> {/* 🔥 Aumentado */}
                        <span style={{ fontSize: '16px', fontWeight: '600' }}> {/* 🔥 Aumentado */}
                            {t('descripcion:message')}
                        </span>
                    </div>

                    {/* Mapa */}
                    <div 
                        style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px', // 🔥 Aumentado
                            cursor: (post.location || post.wilaya || post.commune) ? 'pointer' : 'not-allowed',
                            padding: '12px 14px', // 🔥 Aumentado
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            flex: 1,
                            justifyContent: 'center'
                        }}
                        onClick={(post.location || post.wilaya || post.commune) ? handleOpenMap : undefined}
                    >
                        <FaMapMarkerAlt size={20} /> {/* 🔥 Aumentado */}
                        <span style={{ fontSize: '16px', fontWeight: '600' }}> {/* 🔥 Aumentado */}
                            {(post.location || post.wilaya || post.commune) ? t('descripcion:map') : t('descripcion:notAvailable')}
                        </span>
                    </div>
                </div>

                {/* Información de contacto adicional */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px', // 🔥 Aumentado de 16px a 20px
                    flexWrap: 'wrap'
                }}>
                    {post.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}> {/* 🔥 Aumentado */}
                            <FaPhone size={16} /> {/* 🔥 Aumentado de 14px a 16px */}
                            <span style={{ fontSize: '16px', fontWeight: '600' }}>{post.phone}</span> {/* 🔥 Aumentado */}
                        </div>
                    )}
                    
                    {post.email && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}> {/* 🔥 Aumentado */}
                            <FaEnvelope size={16} /> {/* 🔥 Aumentado */}
                            <span style={{ fontSize: '16px', fontWeight: '600' }}>{post.email}</span> {/* 🔥 Aumentado */}
                        </div>
                    )}
                    
                    {post.bootiquename && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}> {/* 🔥 Aumentado */}
                            <FaStore size={16} /> {/* 🔥 Aumentado */}
                            <span style={{ fontSize: '16px', fontWeight: '600' }}>{post.bootiquename}</span> {/* 🔥 Aumentado */}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (!isTranslationsReady) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                direction: isRTL ? 'rtl' : 'ltr'
            }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">{t('descripcion:loading')}</p>
                </div>
            </div>
        );
    }

    // 🎯 RENDER PRINCIPAL - CON NUEVA SECCIÓN
    return (
        <div style={{
            direction: isRTL ? 'rtl' : 'ltr',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            lineHeight: '1.5',
            color: '#374151',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '16px', // 🔥 Aumentado de 12px a 16px
            width: '100%',
            boxSizing: 'border-box'
        }}>
            {generateMainSection()}
            {generateDescriptionSection()}
            {generateSaleInfoSection()} {/* 🔥 NUEVA SECCIÓN */}
            {generateProductInfoSection()}
            {generateFeaturesSection()}
            {generatePricingSection()}
            {generateLocationSection()}
            {generateAdditionalInfoSection()}
            {generateContactSection()}
        </div>
    );
};

export default DescriptionPost;