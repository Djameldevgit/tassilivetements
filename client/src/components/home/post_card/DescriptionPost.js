import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const DescriptionPost = ({ post }) => {
    const { t, i18n } = useTranslation(['descripcion', 'categories']);
    const isRTL = i18n.language === 'ar';
    const [readMore, setReadMore] = useState(false);     
    
    // 🎨 COLORES MEJORADOS - SIN AZULES EN TEXTO
    const styles = {
        primaryColor: "#1e293b",  // ✅ Azul reemplazado por gris oscuro
        accentColor: "#0f172a",   // ✅ Azul reemplazado por negro azulado
        successColor: "#065f46",  // ✅ Verde oscuro
        warningColor: "#92400e",  // ✅ Ámbar oscuro
        purpleColor: "#7c3aed",   // ✅ Violeta oscuro
        textDark: "#000000",      // ✅ Negro puro para mejor contraste
        textMedium: "#1f2937",    // ✅ Gris muy oscuro
        textLight: "#374151",     // ✅ Gris oscuro
        mainGradient: "linear-gradient(135deg, #1e293b 0%, #7c3aed 100%)", // ✅ Sin azul
        contactGradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", // ✅ Sin azul
        cardShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
    };

    // 🏷️ Información de categoría para ropa
    const getCategoryInfo = () => {
        const categories = {
            "Vêtements Homme": {
                icon: "👔",
                title: t('categories.mensClothing', 'Vêtements Homme'),
                color: "#1e293b",
                description: t('categories.mensDescription', 'Style et élégance pour hommes')
            },
            "Vêtements Femme": {
                icon: "👗",
                title: t('categories.womensClothing', 'Vêtements Femme'),
                color: "#7c3aed",
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
                color: "#991b1b",
                description: t('categories.womensShoesDescription', 'Chaussures élégantes pour femmes')
            },
            "Garçons": {
                icon: "👦",
                title: t('categories.boys', 'Vêtements Garçons'),
                color: "#1e40af",
                description: t('categories.boysDescription', 'Vêtements pratiques pour garçons')
            },
            "Filles": {
                icon: "👧",
                title: t('categories.girls', 'Vêtements Filles'),
                color: "#c026d3",
                description: t('categories.girlsDescription', 'Vêtements mignons pour filles')
            },
            "Bébé": {
                icon: "👶",
                title: t('categories.baby', 'Vêtements Bébé'),
                color: "#0d9488",
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

    // ✨ HIGHLIGHT MEJORADO - SIN COLOR AZUL
    const Highlight = ({ children, type = "default" }) => {
        const typeStyles = {
            default: { 
                backgroundColor: '#f3f4f6', // ✅ Gris claro en lugar de azul
                color: '#1f2937',  // ✅ Negro/gris oscuro
                fontWeight: '700'  // ✅ Negrita
            },
            price: { 
                backgroundColor: '#d1fae5', 
                color: '#065f46',  // ✅ Verde muy oscuro
                fontWeight: '800', // ✅ Extra negrita
                border: '1px solid #10b981'
            },
            feature: { 
                backgroundColor: '#fef3c7', 
                color: '#92400e',  // ✅ Ámbar muy oscuro
                fontWeight: '700'  // ✅ Negrita
            },
            contact: { 
                backgroundColor: '#f3f4f6', // ✅ Gris claro en lugar de azul
                color: '#1f2937',  // ✅ Negro/gris oscuro
                fontWeight: '800'  // ✅ Extra negrita
            }
        };

        const style = typeStyles[type] || typeStyles.default;

        return (
            <span style={{
                ...style,
                padding: '4px 10px', // ✅ Padding aumentado
                borderRadius: '6px',
                margin: '0 3px',
                fontSize: '15px', // ✅ Tamaño de fuente aumentado
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

    // 🆕 FIELDDISPLAY MEJORADO - TEXTO MÁS GRANDE Y NEGRITA
    const FieldDisplay = ({ label, value, icon, type = "text" }) => {
        if (!value && type !== "boolean") return null;

        return (
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px', // ✅ Espacio aumentado
                marginBottom: '12px', // ✅ Margen aumentado
                padding: '10px 0', // ✅ Padding aumentado
                borderBottom: '1px solid #e5e7eb',
                flexDirection: isRTL ? 'row-reverse' : 'row',
                width: '100%',
                wordBreak: 'break-word'
            }}>
                <span style={{
                    fontWeight: '800',  // ✅ Extra negrita
                    color: '#000000',   // ✅ Negro puro para mejor contraste
                    minWidth: isRTL ? 'auto' : '140px', // ✅ Ancho aumentado
                    maxWidth: isRTL ? '160px' : '160px', // ✅ Ancho aumentado
                    fontSize: '16px', // ✅ Tamaño de fuente aumentado
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px', // ✅ Espacio aumentado
                    flexShrink: 0,
                    textAlign: isRTL ? 'right' : 'left',
                    lineHeight: '1.5'
                }}>
                    {isRTL ? <>{label} {icon}</> : <>{icon} {label}</>}:
                </span>
                <span style={{ 
                    fontSize: '16px', // ✅ Tamaño de fuente aumentado
                    color: '#1f2937',  // ✅ Negro/gris oscuro
                    fontWeight: '600',  // ✅ Semi-negrita
                    flex: 1,
                    textAlign: isRTL ? 'right' : 'left',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    lineHeight: '1.6'
                }}>
                    {type === "boolean" ? (
                        <span style={{
                            padding: '6px 12px', // ✅ Padding aumentado
                            borderRadius: '6px',
                            fontSize: '14px', // ✅ Tamaño de fuente aumentado
                            fontWeight: '700', // ✅ Negrita
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

    // 💰 PRICEDISPLAY MEJORADO - TEXTO MÁS GRANDE
    const PriceDisplay = ({ label, value, currency = "DZD" }) => {
        if (!value) return null;

        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px', // ✅ Padding aumentado
                backgroundColor: '#ecfdf5',
                borderRadius: '8px',
                border: '2px solid #10b981',
                marginBottom: '12px', // ✅ Margen aumentado
                flexDirection: isRTL ? 'row-reverse' : 'row',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 2px 4px rgba(16, 185, 129, 0.15)'
            }}>
                <span style={{ 
                    fontWeight: '800',  // ✅ Extra negrita
                    color: '#000000',   // ✅ Negro puro
                    fontSize: '16px', // ✅ Tamaño de fuente aumentado
                    textAlign: isRTL ? 'right' : 'left'
                }}>
                    {isRTL ? <>{label} 💰</> : <>💰 {label}</>}:
                </span>
                <div style={{ textAlign: isRTL ? 'left' : 'right' }}>
                    <div style={{ 
                        fontSize: '20px',  // ✅ Tamaño aumentado
                        fontWeight: '900',  // ✅ Extra negrita
                        color: '#065f46',   // ✅ Verde muy oscuro
                        whiteSpace: 'nowrap',
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                        {value} {currency}
                    </div>
                </div>
            </div>
        );
    };

    // 📋 ARRAYDISPLAY MEJORADO - TEXTO MÁS GRANDE
    const ArrayDisplay = ({ label, items, icon }) => {
        if (!items || items.length === 0) return null;

        return (
            <div style={{ marginBottom: '16px', width: '100%' }}> {/* ✅ Margen aumentado */}
                <div style={{
                    fontWeight: '800',  // ✅ Extra negrita
                    color: '#000000',   // ✅ Negro puro
                    marginBottom: '12px', // ✅ Margen aumentado
                    fontSize: '18px', // ✅ Tamaño de fuente aumentado
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px', // ✅ Espacio aumentado
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    padding: '8px 0', // ✅ Padding aumentado
                    borderBottom: '2px solid #e5e7eb'
                }}>
                    {isRTL ? <>{label} {icon}</> : <>{icon} {label}</>}:
                </div>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px', // ✅ Espacio aumentado
                    justifyContent: isRTL ? 'flex-end' : 'flex-start',
                    marginTop: '10px' // ✅ Margen aumentado
                }}>
                    {items.map((item, index) => (
                        <span key={index} style={{
                            backgroundColor: '#f3f4f6', // ✅ Gris claro en lugar de azul
                            color: '#1f2937', // ✅ Negro/gris oscuro
                            padding: '10px 14px', // ✅ Padding aumentado
                            borderRadius: '8px',
                            fontSize: '15px', // ✅ Tamaño de fuente aumentado
                            fontWeight: '700',  // ✅ Negrita
                            wordBreak: 'break-word',
                            textAlign: isRTL ? 'right' : 'left',
                            border: '1px solid #d1d5db', // ✅ Borde gris
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            {isRTL ? <>{item} ✅</> : <>✅ {item}</>}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    // 🔹 SECCIÓN 1: ANUNCIO PRINCIPAL - TEXTO MÁS GRANDE
    const generateMainAnnouncement = () => {
        const categoryInfo = getCategoryInfo();

        return (
            <div style={{
                background: styles.mainGradient,
                color: 'white',
                padding: '20px', // ✅ Padding aumentado
                borderRadius: '12px',
                marginBottom: '16px', // ✅ Margen aumentado
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}> {/* ✅ Tamaño aumentado */}
                    {categoryInfo.icon}
                </div>
                <h1 style={{
                    margin: '0 0 10px 0',
                    fontSize: '24px', // ✅ Tamaño aumentado
                    fontWeight: '900',  // ✅ Extra negrita
                    wordBreak: 'break-word',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                    {t('excitingNews', '🎉 Nouvel Article de Mode !')}
                </h1>
                <p style={{
                    fontSize: '17px', // ✅ Tamaño aumentado
                    opacity: '0.98',
                    lineHeight: '1.6',
                    marginBottom: '16px', // ✅ Margen aumentado
                    padding: '0 12px', // ✅ Padding aumentado
                    wordBreak: 'break-word',
                    fontWeight: '600' // ✅ Negrita
                }}>
                    <strong style={{ fontSize: '18px' }}>{post.category}</strong> {t('proudlyPresents', 'vous présente un')}
                    <strong style={{ fontSize: '18px' }}> {categoryInfo.title}</strong> {t('carefullyDesigned', 'soigneusement sélectionné pour votre style.')}
                </p>

                {/* Información clave */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '16px', // ✅ Espacio aumentado
                    flexWrap: 'wrap',
                    marginTop: '16px' // ✅ Margen aumentado
                }}>
                    {post.brand && (
                        <div style={{ 
                            textAlign: 'center', 
                            minWidth: '160px', // ✅ Ancho aumentado
                            flex: '1 1 auto', 
                            maxWidth: '240px', // ✅ Ancho aumentado
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            padding: '12px', // ✅ Padding aumentado
                            borderRadius: '8px'
                        }}>
                            <div style={{ 
                                fontSize: '14px', // ✅ Tamaño aumentado
                                opacity: '0.9',
                                fontWeight: '700' // ✅ Negrita
                            }}>
                                {isRTL ? 'العلامة التجارية 🏷️' : '🏷️ Marque'}
                            </div>
                            <div style={{ 
                                fontSize: '15px', // ✅ Tamaño aumentado
                                fontWeight: '800',  // ✅ Extra negrita
                                wordBreak: 'break-word',
                                padding: '6px', // ✅ Padding aumentado
                                marginTop: '6px' // ✅ Margen aumentado
                            }}>
                                {post.brand}
                            </div>
                        </div>
                    )}

                    {post.condition && (
                        <div style={{ 
                            textAlign: 'center',
                            minWidth: '140px', // ✅ Ancho aumentado
                            flex: '1 1 auto',
                            maxWidth: '240px', // ✅ Ancho aumentado
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            padding: '12px', // ✅ Padding aumentado
                            borderRadius: '8px'
                        }}>
                            <div style={{ 
                                fontSize: '14px', // ✅ Tamaño aumentado
                                opacity: '0.9',
                                fontWeight: '700' // ✅ Negrita
                            }}>
                                {isRTL ? 'الحالة ⭐' : '⭐ État'}
                            </div>
                            <div style={{
                                fontSize: '15px', // ✅ Tamaño aumentado
                                fontWeight: '800',  // ✅ Extra negrita
                                wordBreak: 'break-word',
                                padding: '6px', // ✅ Padding aumentado
                                marginTop: '6px' // ✅ Margen aumentado
                            }}>
                                {post.condition}
                            </div>
                        </div>
                    )}

                    {post.price && (
                        <div style={{ 
                            textAlign: 'center', 
                            minWidth: '120px', // ✅ Ancho aumentado
                            flex: '1 1 auto', 
                            maxWidth: '180px', // ✅ Ancho aumentado
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            padding: '12px', // ✅ Padding aumentado
                            borderRadius: '8px'
                        }}>
                            <div style={{ 
                                fontSize: '14px', // ✅ Tamaño aumentado
                                opacity: '0.9',
                                fontWeight: '700' // ✅ Negrita
                            }}>
                                {isRTL ? 'السعر 💰' : '💰 Prix'}
                            </div>
                            <div style={{ 
                                fontSize: '15px', // ✅ Tamaño aumentado
                                fontWeight: '800', // ✅ Extra negrita
                                marginTop: '6px' // ✅ Margen aumentado
                            }}>
                                {post.price} {post.currency || 'DZD'}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // 🔹 SECCIÓN 2: DESCRIPCIÓN - TEXTO MÁS GRANDE
    const generateDescriptionSection = () => {
        if (!post.description) return null;

        return (
            <div style={{
                backgroundColor: '#f8fafc',
                padding: '18px', // ✅ Padding aumentado
                borderRadius: '12px',
                marginBottom: '16px', // ✅ Margen aumentado
                border: '2px solid #cbd5e1',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: styles.cardShadow
            }}>
                <h2 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px', // ✅ Espacio aumentado
                    marginBottom: '14px', // ✅ Margen aumentado
                    color: styles.primaryColor,
                    fontSize: '20px', // ✅ Tamaño aumentado
                    fontWeight: '900',  // ✅ Extra negrita
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    borderBottom: '2px solid #cbd5e1',
                    paddingBottom: '10px' // ✅ Padding aumentado
                }}>
                    {isRTL ? 'وصف المنتج 📝' : '📝 Description du Produit'}
                </h2>
                <div style={{
                    fontSize: '16px', // ✅ Tamaño aumentado
                    color: '#374151',
                    lineHeight: '1.7',
                    textAlign: isRTL ? 'right' : 'left',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    fontWeight: '600'  // ✅ Negrita
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
                                color: '#1e293b',  // ✅ Sin azul
                                cursor: 'pointer',
                                fontWeight: '800',  // ✅ Extra negrita
                                marginLeft: isRTL ? '0' : '10px', // ✅ Margen aumentado
                                marginRight: isRTL ? '10px' : '0', // ✅ Margen aumentado
                                fontSize: '15px', // ✅ Tamaño aumentado
                                display: 'inline-block',
                                marginTop: '8px', // ✅ Margen aumentado
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

    // 🔹 SECCIÓN 3: INFO BÁSICA - TEXTO MÁS GRANDE
    const generateBasicInfoSection = () => {
        return (
            <div style={{
                backgroundColor: '#eff6ff',
                padding: '18px', // ✅ Padding aumentado
                borderRadius: '12px',
                marginBottom: '16px', // ✅ Margen aumentado
                border: '2px solid #93c5fd',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: styles.cardShadow,
            }}>
                <h2 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px', // ✅ Espacio aumentado
                    marginBottom: '14px', // ✅ Margen aumentado
                    color: styles.primaryColor,
                    fontSize: '20px', // ✅ Tamaño aumentado
                    fontWeight: '900', // ✅ Extra negrita
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    borderBottom: '2px solid #93c5fd',
                    paddingBottom: '10px' // ✅ Padding aumentado
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

    // 🔹 SECCIÓN 4: CARACTERÍSTICAS - TEXTO MÁS GRANDE
    const generateFeaturesSection = () => {
        return (
            <div style={{
                backgroundColor: '#f0fdf4',
                padding: '18px', // ✅ Padding aumentado
                borderRadius: '12px',
                marginBottom: '16px', // ✅ Margen aumentado
                border: '2px solid #86efac',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: styles.cardShadow
            }}>
                <h2 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px', // ✅ Espacio aumentado
                    marginBottom: '14px', // ✅ Margen aumentado
                    color: styles.successColor,
                    fontSize: '20px', // ✅ Tamaño aumentado
                    fontWeight: '900', // ✅ Extra negrita
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    borderBottom: '2px solid #86efac',
                    paddingBottom: '10px' // ✅ Padding aumentado
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

    // 🔹 SECCIÓN 5: PRECIO - TEXTO MÁS GRANDE
    const generatePricingSection = () => {
        if (!post.price) return null;

        return (
            <div style={{
                backgroundColor: '#fffbeb',
                padding: '18px', // ✅ Padding aumentado
                borderRadius: '12px',
                marginBottom: '16px', // ✅ Margen aumentado
                border: '2px solid #fbbf24',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: styles.cardShadow
            }}>
                <h2 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px', // ✅ Espacio aumentado
                    marginBottom: '14px', // ✅ Margen aumentado
                    color: styles.warningColor,
                    fontSize: '20px', // ✅ Tamaño aumentado
                    fontWeight: '900', // ✅ Extra negrita
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    borderBottom: '2px solid #fbbf24',
                    paddingBottom: '10px' // ✅ Padding aumentado
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

    // 🔹 SECCIÓN 6: UBICACIÓN Y CONTACTO - TEXTO MÁS GRANDE
    const generateLocationSection = () => {
        return (
            <div style={{
                backgroundColor: '#faf5ff',
                padding: '18px', // ✅ Padding aumentado
                borderRadius: '12px',
                marginBottom: '16px', // ✅ Margen aumentado
                border: '2px solid #e9d5ff',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: styles.cardShadow
            }}>
                <h2 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px', // ✅ Espacio aumentado
                    marginBottom: '14px', // ✅ Margen aumentado
                    color: styles.purpleColor,
                    fontSize: '20px', // ✅ Tamaño aumentado
                    fontWeight: '900', // ✅ Extra negrita
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    borderBottom: '2px solid #e9d5ff',
                    paddingBottom: '10px' // ✅ Padding aumentado
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

    // 🔹 SECCIÓN 7: CONTACTO Y COMPRA - TEXTO MÁS GRANDE CON TECLADO TELEFÓNICO
    const generateContactSection = () => {
        return (
            <div style={{
                background: styles.contactGradient,
                color: 'white',
                padding: '18px',
                borderRadius: '10px',
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box',
            }}>
                <h2 style={{
                    margin: '0 0 12px 0', // ✅ Margen aumentado
                    fontSize: '18px', // ✅ Tamaño aumentado
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px', // ✅ Espacio aumentado
                    flexWrap: 'wrap',
                    fontWeight: '800' // ✅ Extra negrita
                }}>
                    {isRTL ? 'جاهز للشراء؟ 📞' : '📞 Prêt à Acheter ?'}
                </h2>

                <p style={{ 
                    marginBottom: '14px', // ✅ Margen aumentado
                    fontSize: '16px', // ✅ Tamaño aumentado
                    opacity: '0.95',
                    padding: '0 10px', // ✅ Padding aumentado
                    lineHeight: '1.5',
                    wordBreak: 'break-word',
                    fontWeight: '600' // ✅ Negrita
                }}>
                    {isRTL 
                        ? 'لا تفوت هذه الفرصة! اتصل بالبائع الآن.'
                        : t('contact.dontMiss', 'Ne manquez pas cette opportunité ! Contactez le vendeur dès maintenant.')
                    }
                </p>

                {post.phone && (
                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        padding: '14px 18px', // ✅ Padding aumentado
                        borderRadius: '8px',
                        display: 'inline-block',
                        marginBottom: '14px', // ✅ Margen aumentado
                        maxWidth: '100%',
                        wordBreak: 'break-word'
                    }}>
                        <div style={{ 
                            fontSize: '13px', // ✅ Tamaño aumentado
                            opacity: '0.85', 
                            marginBottom: '6px', // ✅ Margen aumentado
                            fontWeight: '700' // ✅ Negrita
                        }}>
                            {isRTL ? 'اتصل بالبائع 📞' : '📞 Contactez le vendeur'}
                        </div>
                        <div 
                            style={{ 
                                fontSize: '18px', // ✅ Tamaño aumentado
                                fontWeight: '900', // ✅ Extra negrita
                                direction: 'ltr',
                                cursor: 'pointer',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                display: 'inline-block',
                                minWidth: '200px',
                                border: '1px solid rgba(255,255,255,0.3)',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => {
                                window.location.href = `tel:${post.phone}`;
                            }}
                            onTouchStart={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                                e.currentTarget.style.transform = 'scale(0.98)';
                            }}
                            onTouchEnd={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            {post.phone}
                        </div>
                        <div style={{
                            fontSize: '12px',
                            opacity: '0.7',
                            marginTop: '6px',
                            fontStyle: 'italic'
                        }}>
                            {isRTL ? 'انقر للاتصال' : 'Cliquez pour appeler'}
                        </div>
                    </div>
                )}

                <p style={{ 
                    fontSize: '15px', // ✅ Tamaño aumentado
                    opacity: '0.9', 
                    margin: '0',
                    wordBreak: 'break-word',
                    fontWeight: '700' // ✅ Negrita
                }}>
                    {isRTL 
                        ? '🛍️ تسوق بثقة تامة!'
                        : t('contact.guarantee', 'Achetez en toute confiance !') + ' 🛍️'
                    }
                </p>
            </div>
        );
    };

    // 🎯 RENDER PRINCIPAL MEJORADO
    return (
        <div style={{
            direction: isRTL ? 'rtl' : 'ltr',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            lineHeight: '1.5',
            color: '#2d3748',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '14px', // ✅ Padding aumentado
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