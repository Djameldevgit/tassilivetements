import React, { memo, useState, useEffect } from 'react';
import { Container, Carousel, Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const HeaderCarousel = memo(({
    carouselHeight = '170px',
    animationSpeed = 500,
    autoPlayInterval = 3000,
    showIndicators = true,
    showControls = false,
    imageBorderRadius = '8px',
    overlayOpacity = 0.3
}) => {
    const { t, i18n } = useTranslation('headercarousel');
    const currentLang = i18n.language;
    const isRTL = currentLang === 'ar';
    
    const [index, setIndex] = useState(0);

    // 🔥 IMÁGENES DE ROPA CON FALLBACKS MEJORADOS
    const clothingImages = [
        {
            src: "/images/clothing/fashion-banner-1.jpg",
            alt: "Moda Verano 2024",
            title: t('summerFashion', "Nouvelle Collection Été"),
            description: t('summerDesc', "Découvrez les dernières tendances"),
            // Fallback: gradiente de colores en caso de error
            fallbackColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        },
        {
            src: "/images/clothing/mens-collection.jpg", 
            alt: "Collection Homme",
            title: t('mensCollection', "Style Masculin Élégant"),
            description: t('mensDesc', "Vêtements premium pour hommes"),
            fallbackColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        },
        {
            src: "/images/clothing/00.png",
            alt: "Mode Feminine",
            title: t('womensFashion', "Élégance Féminine"),
            description: t('womensDesc', "Robes et tenues élégantes"),
            fallbackColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
        },
        {
            src: "/images/clothing/01.png",
            alt: "Collection Enfants", 
            title: t('kidsCollection', "Mode Enfants"),
            description: t('kidsDesc', "Vêtements mignons pour enfants"),
            fallbackColor: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
        },
        {
            src: "/images/clothing/03.png",
            alt: "Vêtements Sport",
            title: t('sportsWear', "Collection Sportive"),
            description: t('sportsDesc', "Confort et performance"),
            fallbackColor: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
        },
        {
            src: "/images/clothing/04.png",
            alt: "Accessoires Mode",
            title: t('accessories', "Accessoires Tendances"),
            description: t('accessoriesDesc', "Complétez votre look"),
            fallbackColor: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
        }
    ];

    // 🔥 ESTADO PARA MANEJAR ERRORES DE IMAGEN
    const [imageErrors, setImageErrors] = useState({});

    const handleImageError = (imageIndex) => {
        setImageErrors(prev => ({
            ...prev,
            [imageIndex]: true
        }));
    };

    // 🔥 AUTO-PLAY
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prevIndex => 
                prevIndex === clothingImages.length - 1 ? 0 : prevIndex + 1
            );
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [autoPlayInterval, clothingImages.length]);

    // 🔥 ESTILOS MEMOIZADOS
    const carouselStyle = {
        height: carouselHeight,
        borderRadius: imageBorderRadius,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
    };

    const imageStyle = {
        width: '100%',
        height: carouselHeight,
        objectFit: 'cover',
        filter: 'brightness(0.9)',
        transition: `all ${animationSpeed}ms ease-in-out`
    };

    const fallbackStyle = (imageIndex) => ({
        width: '100%',
        height: carouselHeight,
        background: clothingImages[imageIndex].fallbackColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '2rem',
        fontWeight: 'bold'
    });

    const overlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(45deg, rgba(0,0,0,${overlayOpacity}) 0%, rgba(0,0,0,0.2) 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: isRTL ? 'flex-end' : 'flex-start',
        padding: '0 2rem',
        color: 'white',
        textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
    };

    const contentStyle = {
        maxWidth: '60%',
        textAlign: isRTL ? 'right' : 'left',
        animation: `fadeInUp ${animationSpeed}ms ease-out`
    };

    const titleStyle = {
        fontSize: '1.1rem',
        fontWeight: '700',
        marginBottom: '0.3rem',
        fontFamily: "'Inter', sans-serif",
        background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    };

    const descriptionStyle = {
        fontSize: '0.8rem',
        opacity: 0.9,
        fontWeight: '500',
        marginBottom: '0'
    };

    const indicatorStyle = {
        bottom: '8px',
        marginBottom: '0'
    };

    const indicatorButtonStyle = {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        margin: '0 3px',
        border: 'none',
        transition: 'all 0.3s ease'
    };

    // 🔥 CSS ANIMATIONS
    const cssStyles = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .carousel-indicators button {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin: 0 3px;
            border: none;
            transition: all 0.3s ease;
        }
        
        .carousel-indicators button.active {
            transform: scale(1.3);
            background-color: #ffffff !important;
        }
        
        .carousel-item {
            transition: transform ${animationSpeed}ms ease-in-out;
        }
    `;

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <>
            <style>{cssStyles}</style>
            
            <Container fluid className="px-0" dir={isRTL ? 'rtl' : 'ltr'}>
                <Carousel
                    activeIndex={index}
                    onSelect={handleSelect}
                    indicators={showIndicators}
                    controls={showControls}
                    fade={true}
                    interval={null}
                    style={carouselStyle}
                    className="custom-carousel"
                >
                    {clothingImages.map((image, idx) => (
                        <Carousel.Item key={idx}>
                            <div style={{ position: 'relative' }}>
                                {/* 🔥 IMAGEN CON FALLBACK MEJORADO */}
                                {!imageErrors[idx] ? (
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        style={imageStyle}
                                        loading="lazy"
                                        onError={() => handleImageError(idx)}
                                    />
                                ) : (
                                    // 🔥 FALLBACK CON GRADIENTE DE COLORES
                                    <div style={fallbackStyle(idx)}>
                                        <span>👕</span>
                                    </div>
                                )}
                                
                                {/* 🔥 OVERLAY CON TEXTO */}
                                <div style={overlayStyle}>
                                    <div style={contentStyle}>
                                        <h4 style={titleStyle}>
                                            {image.title}
                                        </h4>
                                        <p style={descriptionStyle}>
                                            {image.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>

                {/* 🔥 INDICADORES PERSONALIZADOS */}
                {showIndicators && (
                    <div 
                        className="carousel-indicators position-relative justify-content-center mt-2"
                        style={indicatorStyle}
                    >
                        {clothingImages.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className={idx === index ? 'active bg-white' : 'bg-secondary'}
                                aria-label={`Slide ${idx + 1}`}
                                style={indicatorButtonStyle}
                                onClick={() => handleSelect(idx)}
                            />
                        ))}
                    </div>
                )}
            </Container>
        </>
    );
});

HeaderCarousel.displayName = 'HeaderCarousel';

export default HeaderCarousel;