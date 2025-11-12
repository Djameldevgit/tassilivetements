import React from 'react';
import { useTranslation } from 'react-i18next';
import Carousel from 'react-bootstrap/Carousel';
import { useSelector } from 'react-redux';

const HeaderCarousel = () => {
    const { t, i18n } = useTranslation('carouselhome');
    const languageReducer = useSelector(state => state.languageReducer);
    
    // 🆕 DETECCIÓN RTL MEJORADA
    const isRTL = i18n.language === 'ar' || languageReducer?.language === 'ar';

    const slides = [
        {
            image: "/images/clothing/04.jpg",
            titleKey: "slides.spring_collection.title",
            descriptionKey: "slides.spring_collection.description"
        },
        {
            image: "/images/clothing/00.jpg",
            titleKey: "slides.summer_sales.title", 
            descriptionKey: "slides.summer_sales.description"
        },
        {
            image: "/images/clothing/01.jpg",
            titleKey: "slides.men_collection.title",
            descriptionKey: "slides.men_collection.description"
        },
        {
            image: "/images/clothing/03.jpg",
            titleKey: "slides.women_collection.title",
            descriptionKey: "slides.women_collection.description"
        }
    ];

    return (
        <Carousel 
            data-bs-theme="dark" 
            fade 
            interval={3000}
            dir={isRTL ? "rtl" : "ltr"}
            // 🆕 ELIMINAR INDICADORES Y FLECHAS
            indicators={false}
            nextIcon={null}
            prevIcon={null}
            controls={false}
        >
            {slides.map((slide, index) => (
                <Carousel.Item key={index}>
                    <img
                        className="d-block w-100"
                        src={slide.image}
                        alt={t(slide.titleKey)}
                        style={{
                            height: 'clamp(180px, 40vw, 350px)',
                            objectFit: 'cover'
                        }}
                    />
                    <Carousel.Caption style={{
                        // 🆕 FONDO MÁS TRANSPARENTE
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '12px',
                        padding: '14px 18px',
                        // 🆕 CENTRADO Y EN LA PARTE INFERIOR
                        bottom: '15px',
                        left: '50%',
                        right: 'auto',
                        transform: 'translateX(-50%)',
                        width: '90%',
                        maxWidth: '500px',
                        margin: '0 auto',
                        // 🆕 TEXTO CENTRADO
                        textAlign: 'center',
                        direction: isRTL ? 'rtl' : 'ltr',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                    }}>
                        <h3 style={{ 
                            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)',
                            fontSize: 'clamp(16px, 4vw, 20px)',
                            fontWeight: '700',
                            marginBottom: '6px',
                            color: '#ffffff',
                            lineHeight: '1.3'
                        }}>
                            {t(slide.titleKey)}
                        </h3>
                        <p style={{ 
                            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)',
                            fontSize: 'clamp(12px, 3vw, 14px)',
                            fontWeight: '400',
                            marginBottom: '0',
                            color: '#f0f0f0',
                            lineHeight: '1.4',
                            opacity: '0.1'
                        }}>
                            {t(slide.descriptionKey)}
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default HeaderCarousel;