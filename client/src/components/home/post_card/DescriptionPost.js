import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaComment, FaPhone } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';

const DescriptionPost = ({ post }) => {
    const { t, i18n } = useTranslation(['descripcion', 'categories']);
    const { auth, message } = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();
    const isRTL = i18n.language === 'ar';
    const [readMore, setReadMore] = useState(false);     
    
    // 🎨 COLORES VIBRANTES PARA TIENDA DE ROPA
    const styles = {
        primaryColor: "#7c3aed",     // Violeta vibrante
        accentColor: "#ec4899",      // Rosa fucsia
        successColor: "#10b981",     // Verde esmeralda
        warningColor: "#f59e0b",     // Ámbar dorado
        purpleColor: "#8b5cf6",      // Violeta claro
        textDark: "#000000",         // Negro puro
        textMedium: "#1f2937",       // Gris muy oscuro
        textLight: "#ffffff",        // Blanco para contraste
        mainGradient: "linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)", // Rosa a violeta
        contactGradient: "linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)", // Dorado a rosa
        cardShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
    };

    // LÓGICA DEL CHAT - IGUAL QUE CARDFOOTER
    const handleChatWithOwner = () => {
        if (!auth.user) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: { error: 'Veuillez vous connecter pour démarrer une conversation' } 
            });
            return;
        }

        if (!post.user || !post.user._id) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: { error: 'Impossible de contacter ce vendeur' } 
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
                    postTitle: post.title || 'Produit de mode',
                    postId: post._id
                }
            });

            history.push(`/message/${post.user._id}`);
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { success: 'Conversation démarrée avec le vendeur' }
            });

        } catch (error) {
            console.error('Erreur lors du démarrage de la conversation:', error);
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: 'Erreur lors du démarrage de la conversation' }
            });
        }
    };

    const handleCallOwner = () => {
        if (!post.phone) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: { error: 'Numéro de téléphone non disponible' } 
            });
            return;
        }
        
        if (window.confirm(`Voulez-vous appeler ${post.phone} ?`)) {
            window.location.href = `tel:${post.phone}`;
        }
    };

    // 🏷️ Información de categoría para ropa
    const getCategoryInfo = () => {
        const categories = {
            "Vêtements Homme": {
                icon: "👔",
                title: t('categories.mensClothing', 'Vêtements Homme'),
                color: "#3b82f6",
                description: t('categories.mensDescription', 'Style et élégance pour hommes')
            },
            "Vêtements Femme": {
                icon: "👗",
                title: t('categories.womensClothing', 'Vêtements Femme'),
                color: "#ec4899",
                description: t('categories.womensDescription', 'Mode et tendances pour femmes')
            },
            "Chaussures Homme": {
                icon: "👞",
                title: t('categories.mensShoes', 'Chaussures Homme'),
                color: "#78350f",
                description: t('categories.mensShoesDescription', 'Chaussures de qualité pour hommes')
            },
            "Chaussures Femme": {
                icon: "👠",
                title: t('categories.womensShoes', 'Chaussures Femme'),
                color: "#dc2626",
                description: t('categories.womensShoesDescription', 'Chaussures élégantes pour femmes')
            },
            "Garçons": {
                icon: "👦",
                title: t('categories.boys', 'Vêtements Garçons'),
                color: "#3b82f6",
                description: t('categories.boysDescription', 'Vêtements pratiques pour garçons')
            },
            "Filles": {
                icon: "👧",
                title: t('categories.girls', 'Vêtements Filles'),
                color: "#ec4899",
                description: t('categories.girlsDescription', 'Vêtements mignons pour filles')
            },
            "Bébé": {
                icon: "👶",
                title: t('categories.baby', 'Vêtements Bébé'),
                color: "#f59e0b",
                description: t('categories.babyDescription', 'Vêtements doux pour bébés')
            }
        };

        return categories[post.subCategory] || {
            icon: "🛍️",
            title: post.subCategory || t('categories.general', 'Article de Mode'),
            color: "#7c3aed",
            description: t('categories.generalDescription', 'Article de qualité à prix exceptionnel')
        };
    };

    // ✨ HIGHLIGHT MEJORADO
    const Highlight = ({ children, type = "default" }) => {
        const typeStyles = {
            default: { 
                backgroundColor: '#f3f4f6',
                color: '#1f2937',
                fontWeight: '700'
            },
            price: { 
                backgroundColor: '#d1fae5', 
                color: '#065f46',
                fontWeight: '800',
                border: '1px solid #10b981'
            },
            feature: { 
                backgroundColor: '#fef3c7', 
                color: '#92400e',
                fontWeight: '700'
            },
            contact: { 
                backgroundColor: '#f3f4f6',
                color: '#1f2937',
                fontWeight: '800'
            }
        };

        const style = typeStyles[type] || typeStyles.default;

        return (
            <span style={{
                ...style,
                padding: '4px 10px',
                borderRadius: '6px',
                margin: '0 3px',
                fontSize: '15px',
                display: 'inline-block',
                wordBreak: 'break-word',
                maxWidth: '100%',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                lineHeight: '1.4'
            }}>
                {children}
            </span>
        );
    };

    // 🆕 FIELDDISPLAY MEJORADO
    const FieldDisplay = ({ label, value, icon, type = "text" }) => {
        if (!value && type !== "boolean") return null;

        return (
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '12px',
                padding: '10px 0',
                borderBottom: '1px solid #e5e7eb',
                flexDirection: isRTL ? 'row-reverse' : 'row',
                width: '100%',
                wordBreak: 'break-word'
            }}>
                <span style={{
                    fontWeight: '800',
                    color: '#000000',
                    minWidth: isRTL ? 'auto' : '140px',
                    maxWidth: isRTL ? '160px' : '160px',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexShrink: 0,
                    textAlign: isRTL ? 'right' : 'left',
                    lineHeight: '1.5'
                }}>
                    {isRTL ? <>{label} {icon}</> : <>{icon} {label}</>}:
                </span>
                <span style={{ 
                    fontSize: '16px',
                    color: '#1f2937',
                    fontWeight: '600',
                    flex: 1,
                    textAlign: isRTL ? 'right' : 'left',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    lineHeight: '1.6'
                }}>
                    {type === "boolean" ? (
                        <span style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '700',
                            backgroundColor: value ? '#d1fae5' : '#fee2e2',
                            color: value ? '#065f46' : '#991b1b',
                            display: 'inline-block'
                        }}>
                            {value ? "✅ Oui" : "❌ Non"}
                        </span>
                    ) : (
                        <Highlight>{value}</Highlight>
                    )}
                </span>
            </div>
        );
    };

    // 💰 PRICEDISPLAY MEJORADO
    const PriceDisplay = ({ label, value, currency = "DZD" }) => {
        if (!value) return null;

        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                backgroundColor: '#ecfdf5',
                borderRadius: '8px',
                border: '2px solid #10b981',
                marginBottom: '12px',
                flexDirection: isRTL ? 'row-reverse' : 'row',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 2px 4px rgba(16, 185, 129, 0.15)'
            }}>
                <span style={{ 
                    fontWeight: '800',
                    color: '#000000',
                    fontSize: '16px',
                    textAlign: isRTL ? 'right' : 'left'
                }}>
                    {isRTL ? <>{label} 💰</> : <>💰 {label}</>}:
                </span>
                <div style={{ textAlign: isRTL ? 'left' : 'right' }}>
                    <div style={{ 
                        fontSize: '20px',
                        fontWeight: '900',
                        color: '#065f46',
                        whiteSpace: 'nowrap',
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                        {value} {currency}
                    </div>
                </div>
            </div>
        );
    };

    // 📋 ARRAYDISPLAY MEJORADO
    const ArrayDisplay = ({ label, items, icon }) => {
        if (!items || items.length === 0) return null;

        return (
            <div style={{ marginBottom: '16px', width: '100%' }}>
                <div style={{
                    fontWeight: '800',
                    color: '#000000',
                    marginBottom: '12px',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    padding: '8px 0',
                    borderBottom: '2px solid #e5e7eb'
                }}>
                    {isRTL ? <>{label} {icon}</> : <>{icon} {label}</>}:
                </div>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    justifyContent: isRTL ? 'flex-end' : 'flex-start',
                    marginTop: '10px'
                }}>
                    {items.map((item, index) => (
                        <span key={index} style={{
                            backgroundColor: '#f3f4f6',
                            color: '#1f2937',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            fontSize: '15px',
                            fontWeight: '700',
                            wordBreak: 'break-word',
                            textAlign: isRTL ? 'right' : 'left',
                            border: '1px solid #d1d5db',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            {isRTL ? <>{item} ✅</> : <>✅ {item}</>}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    // 🔹 SECCIÓN 1: ANUNCIO PRINCIPAL - COLORES VIBRANTES
    const generateMainAnnouncement = () => {
        const categoryInfo = getCategoryInfo();

        return (
            <div style={{
                background: styles.mainGradient,
                color: 'white',
                padding: '24px 20px',
                borderRadius: '16px',
                marginBottom: '20px',
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 8px 25px rgba(124, 58, 237, 0.3)',
                border: '2px solid rgba(255,255,255,0.2)'
            }}>
                <div style={{ 
                    fontSize: '48px', 
                    marginBottom: '16px',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }}>
                    {categoryInfo.icon}
                </div>
                <h1 style={{
                    margin: '0 0 16px 0',
                    fontSize: '28px',
                    fontWeight: '900',
                    wordBreak: 'break-word',
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    letterSpacing: '0.5px'
                }}>
                    {t('excitingNews', '🎉 NOUVEAU ARRIVAGE !')}
                </h1>
                <p style={{
                    fontSize: '18px',
                    opacity: '0.95',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                    padding: '0 16px',
                    wordBreak: 'break-word',
                    fontWeight: '600',
                    textShadow: '0 1px 4px rgba(0,0,0,0.2)'
                }}>
                    <strong style={{ fontSize: '20px', color: '#fef3c7' }}>{post.category}</strong> {t('proudlyPresents', 'vous présente un')}
                    <strong style={{ fontSize: '20px', color: '#fef3c7' }}> {categoryInfo.title}</strong> {t('carefullyDesigned', 'soigneusement sélectionné pour votre style.')}
                </p>

                {/* Información clave */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    flexWrap: 'wrap',
                    marginTop: '20px'
                }}>
                    {post.brand && (
                        <div style={{ 
                            textAlign: 'center', 
                            minWidth: '160px',
                            flex: '1 1 auto', 
                            maxWidth: '240px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            padding: '16px',
                            borderRadius: '12px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)'
                        }}>
                            <div style={{ 
                                fontSize: '15px',
                                opacity: '0.9',
                                fontWeight: '700',
                                marginBottom: '8px'
                            }}>
                                {isRTL ? 'العلامة التجارية 🏷️' : '🏷️ Marque'}
                            </div>
                            <div style={{ 
                                fontSize: '16px',
                                fontWeight: '800',
                                wordBreak: 'break-word',
                                padding: '8px',
                                textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                            }}>
                                {post.brand}
                            </div>
                        </div>
                    )}

                    {post.condition && (
                        <div style={{ 
                            textAlign: 'center',
                            minWidth: '140px',
                            flex: '1 1 auto',
                            maxWidth: '240px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            padding: '16px',
                            borderRadius: '12px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)'
                        }}>
                            <div style={{ 
                                fontSize: '15px',
                                opacity: '0.9',
                                fontWeight: '700',
                                marginBottom: '8px'
                            }}>
                                {isRTL ? 'الحالة ⭐' : '⭐ État'}
                            </div>
                            <div style={{
                                fontSize: '16px',
                                fontWeight: '800',
                                wordBreak: 'break-word',
                                padding: '8px',
                                textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                            }}>
                                {post.condition}
                            </div>
                        </div>
                    )}

                    {post.price && (
                        <div style={{ 
                            textAlign: 'center', 
                            minWidth: '120px',
                            flex: '1 1 auto', 
                            maxWidth: '180px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            padding: '16px',
                            borderRadius: '12px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)'
                        }}>
                            <div style={{ 
                                fontSize: '15px',
                                opacity: '0.9',
                                fontWeight: '700',
                                marginBottom: '8px'
                            }}>
                                {isRTL ? 'السعر 💰' : '💰 Prix'}
                            </div>
                            <div style={{ 
                                fontSize: '16px',
                                fontWeight: '800',
                                textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                            }}>
                                {post.price} {post.currency || 'DZD'}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // 🔹 SECCIÓN 2: DESCRIPCIÓN
    const generateDescriptionSection = () => {
        if (!post.description) return null;

        return (
            <div style={{
                backgroundColor: '#f8fafc',
                padding: '18px',
                borderRadius: '12px',
                marginBottom: '16px',
                border: '2px solid #cbd5e1',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: styles.cardShadow
            }}>
                <h2 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '14px',
                    color: styles.primaryColor,
                    fontSize: '20px',
                    fontWeight: '900',
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    borderBottom: '2px solid #cbd5e1',
                    paddingBottom: '10px'
                }}>
                    {isRTL ? 'وصف المنتج 📝' : '📝 Description du Produit'}
                </h2>
                <div style={{
                    fontSize: '16px',
                    color: '#374151',
                    lineHeight: '1.7',
                    textAlign: isRTL ? 'right' : 'left',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    fontWeight: '600'
                }}>
                    <span>
                        {
                            post.description.length < 120
                                ? post.description
                                : readMore ? post.description + ' ' : post.description.slice(0, 120) + '...'
                        }
                    </span>
                    {post.description.length > 120 && (
                        <span
                            style={{
                                color: styles.primaryColor,
                                cursor: 'pointer',
                                fontWeight: '800',
                                marginLeft: isRTL ? '0' : '10px',
                                marginRight: isRTL ? '10px' : '0',
                                fontSize: '15px',
                                display: 'inline-block',
                                marginTop: '8px',
                                textDecoration: 'underline'
                            }}
                            onClick={() => setReadMore(!readMore)}
                        >
                            {readMore ?
                                (isRTL ? 'عرض أقل ▲' : '▲ Voir moins') :
                                (isRTL ? 'قراءة المزيد ▼' : '▼ Lire la suite')}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    // 🔹 SECCIÓN 3: INFO BÁSICA
    const generateBasicInfoSection = () => {
        return (
            <div style={{
                backgroundColor: '#eff6ff',
                padding: '18px',
                borderRadius: '12px',
                marginBottom: '16px',
                border: '2px solid #93c5fd',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: styles.cardShadow,
            }}>
                <h2 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '14px',
                    color: styles.primaryColor,
                    fontSize: '20px',
                    fontWeight: '900',
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    borderBottom: '2px solid #93c5fd',
                    paddingBottom: '10px'
                }}>
                    {isRTL ? 'معلومات المنتج 🎯' : '🎯 Informations du Produit'}
                </h2>
                <FieldDisplay
                    label={isRTL ? "العنوان" : "Titre"}
                    value={post.title}
                    icon="🏷️"
                />
                <FieldDisplay
                    label={isRTL ? "الفئة" : "Catégorie"}
                    value={post.subCategory}
                    icon="📂"
                />
                <FieldDisplay
                    label={isRTL ? "النوع المحدد" : "Type Spécifique"}
                    value={post.subSubCategory}
                    icon="🎯"
                />
                <FieldDisplay
                    label={isRTL ? "الجنس" : "Genre"}
                    value={post.gender}
                    icon="👥"
                />
                <FieldDisplay
                    label={isRTL ? "الموسم" : "Saison"}
                    value={post.season}
                    icon="🌤️"
                />
                <FieldDisplay
                    label={isRTL ? "المادة" : "Matériau"}
                    value={post.material}
                    icon="🧵"
                />
            </div>
        );
    };

    // 🔹 SECCIÓN 4: CARACTERÍSTICAS
    const generateFeaturesSection = () => {
        return (
            <div style={{
                backgroundColor: '#f0fdf4',
                padding: '18px',
                borderRadius: '12px',
                marginBottom: '16px',
                border: '2px solid #86efac',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: styles.cardShadow
            }}>
                <h2 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '14px',
                    color: styles.successColor,
                    fontSize: '20px',
                    fontWeight: '900',
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    borderBottom: '2px solid #86efac',
                    paddingBottom: '10px'
                }}>
                    {isRTL ? 'المواصفات 📏' : '📏 Caractéristiques'}
                </h2>

                {/* Tallas */}
                <ArrayDisplay
                    label={isRTL ? "المقاسات المتاحة" : "Tailles Disponibles"}
                    items={post.sizes || []}
                    icon="📏"
                />

                {/* Colores */}
                <ArrayDisplay
                    label={isRTL ? "الألوان المتاحة" : "Couleurs Disponibles"}
                    items={post.colors || []}
                    icon="🎨"
                />

                {/* Etiquetas */}
                {post.tags && post.tags.length > 0 && (
                    <ArrayDisplay
                        label={isRTL ? "العلامات" : "Étiquettes"}
                        items={post.tags}
                        icon="🏷️"
                    />
                )}
            </div>
        );
    };

    // 🔹 SECCIÓN 5: PRECIO
    const generatePricingSection = () => {
        if (!post.price) return null;

        return (
            <div style={{
                backgroundColor: '#fffbeb',
                padding: '18px',
                borderRadius: '12px',
                marginBottom: '16px',
                border: '2px solid #fbbf24',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: styles.cardShadow
            }}>
                <h2 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '14px',
                    color: styles.warningColor,
                    fontSize: '20px',
                    fontWeight: '900',
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    borderBottom: '2px solid #fbbf24',
                    paddingBottom: '10px'
                }}>
                    {isRTL ? 'التسعير 💰' : '💰 Tarification'}
                </h2>

                <PriceDisplay
                    label={isRTL ? "السعر" : "Prix"}
                    value={post.price}
                    currency={post.currency || "DZD"}
                />
            </div>
        );
    };

    // 🔹 SECCIÓN 6: UBICACIÓN Y CONTACTO
    const generateLocationSection = () => {
        return (
            <div style={{
                backgroundColor: '#faf5ff',
                padding: '18px',
                borderRadius: '12px',
                marginBottom: '16px',
                border: '2px solid #e9d5ff',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: styles.cardShadow
            }}>
                <h2 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '14px',
                    color: styles.purpleColor,
                    fontSize: '20px',
                    fontWeight: '900',
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    borderBottom: '2px solid #e9d5ff',
                    paddingBottom: '10px'
                }}>
                    {isRTL ? 'الموقع والاتصال 📍' : '📍 Localisation & Contact'}
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '0'
                }}>
                    <FieldDisplay
                        label={isRTL ? "الولاية" : "Wilaya"}
                        value={post.wilaya}
                        icon="🏛️"
                    />
                    <FieldDisplay
                        label={isRTL ? "البلدية" : "Commune"}
                        value={post.commune}
                        icon="🏘️"
                    />
                    <FieldDisplay
                        label={isRTL ? "العنوان" : "Adresse"}
                        value={post.location}
                        icon="📍"
                    />
                    <FieldDisplay
                        label={isRTL ? "الهاتف" : "Téléphone"}
                        value={post.phone}
                        icon="📞"
                    />
                    {post.email && (
                        <FieldDisplay
                            label={isRTL ? "البريد الإلكتروني" : "Email"}
                            value={post.email}
                            icon="📧"
                        />
                    )}
                </div>
            </div>
        );
    };

    // 🔹 SECCIÓN 7: CONTACTO - CON LOS MISMOS ICONOS DEL CARDFOOTER
    const generateContactSection = () => {
        return (
            <div style={{
                background: styles.contactGradient,
                color: 'white',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)',
                border: '2px solid rgba(255,255,255,0.2)'
            }}>
                <h2 style={{
                    margin: '0 0 16px 0',
                    fontSize: '20px',
                    fontWeight: '800',
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}>
                    {isRTL ? 'جاهز للشراء؟' : '📞 Prêt à Acheter ?'}
                </h2>

                <p style={{ 
                    marginBottom: '20px',
                    fontSize: '16px',
                    opacity: '0.95',
                    lineHeight: '1.5',
                    wordBreak: 'break-word',
                    fontWeight: '600',
                    textShadow: '0 1px 4px rgba(0,0,0,0.2)'
                }}>
                    {isRTL 
                        ? 'لا تفوت هذه الفرصة! تواصل مع البائع الآن.'
                        : "Ne manquez pas cette opportunité ! Contactez le vendeur dès maintenant."
                    }
                </p>

                {/* ICONOS IDÉNTICOS AL CARDFOOTER */}
                <div className="d-flex justify-content-between align-items-center w-100 border-top pt-3" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                    {/* Icono Teléfono - Izquierda */}
                    <div 
                        className="d-flex align-items-center"
                        style={{ 
                            cursor: post.phone ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            opacity: post.phone ? 1 : 0.5,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white'
                        }}
                        onClick={handleCallOwner}
                        onMouseEnter={(e) => {
                            if (post.phone) {
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (post.phone) {
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                            }
                        }}
                        title={post.phone ? "Appeler le vendeur" : "Numéro non disponible"}
                    >
                        <FaPhone 
                            style={{ 
                                fontSize: '1.3rem',
                                marginRight: '8px'
                            }}
                        />
                        <span className="fw-medium">Appeler</span>
                    </div>

                    {/* Icono Chat - Derecha */}
                    <div 
                        className="d-flex align-items-center"
                        style={{ 
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white'
                        }}
                        onClick={handleChatWithOwner}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                        }}
                        title="Envoyer un message au vendeur"
                    >
                        <FaComment 
                            style={{ 
                                fontSize: '1.3rem',
                                marginRight: '8px'
                            }}
                        />
                        <span className="fw-medium">Message</span>
                    </div>
                </div>

                <p style={{ 
                    fontSize: '14px',
                    opacity: '0.9', 
                    margin: '20px 0 0 0',
                    wordBreak: 'break-word',
                    fontWeight: '600',
                    textShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}>
                    {isRTL 
                        ? '🛍️ تسوق بثقة تامة!'
                        : '🛍️ Achetez en toute confiance !'
                    }
                </p>
            </div>
        );
    };

    // 🎯 RENDER PRINCIPAL
    return (
        <div style={{
            direction: isRTL ? 'rtl' : 'ltr',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            lineHeight: '1.5',
            color: '#2d3748',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '16px',
            width: '100%',
            boxSizing: 'border-box',
            overflowX: 'hidden',
            textAlign: isRTL ? 'right' : 'left'
        }}>
            {generateMainAnnouncement()}
            {generateDescriptionSection()}
            {generateBasicInfoSection()}
            {generateFeaturesSection()}
            {generatePricingSection()}
            {generateLocationSection()}
            {generateContactSection()}
        </div>
    );
};

export default DescriptionPost;