import React from 'react';
import { useTranslation } from 'react-i18next';
import Carousel from 'react-bootstrap/Carousel';
import { useSelector } from 'react-redux';

function HeaderCarousel() {
  const { t } = useTranslation('common');
  const { languageReducer } = useSelector(state => state);
  const isRTL = languageReducer?.language === 'ar';

  // Rutas de las imágenes en la carpeta public/images/
  const carouselImages = [
    '/images/banner1.jpg',
    '/images/banner2.jpg', 
    '/images/banner3.jpg',
    '/images/banner4.jpg',
    '/images/banner5.jpg'
  ];

  // Textos traducidos para cada slide
  const slides = [
    {
      title: t('carousel.title1', 'Nouvelle Collection Printemps'),
      description: t('carousel.desc1', 'Découvrez les dernières tendances de la saison')
    },
    {
      title: t('carousel.title2', 'Soldes Exceptionnelles'),
      description: t('carousel.desc2', 'Jusqu\'à -50% sur toute la boutique')
    },
    {
      title: t('carousel.title3', 'Livraison Gratuite'),
      description: t('carousel.desc3', 'Partout en Algérie à partir de 3000 DZD')
    },
    {
      title: t('carousel.title4', 'Mode Homme & Femme'),
      description: t('carousel.desc4', 'Des styles uniques pour tous les goûts')
    },
    {
      title: t('carousel.title5', 'Qualité Garantie'),
      description: t('carousel.desc5', 'Des matériaux premium et une confection soignée')
    }
  ];

  return (
    <Carousel 
      data-bs-theme="light" 
      fade 
      interval={4000}
      indicators={true}
      controls={true}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        height: 'auto',
        minHeight: '300px'
      }}
    >
      {carouselImages.map((image, index) => (
        <Carousel.Item key={index}>
          <div 
            className="d-block w-100"
            style={{
              height: '60vh',
              maxHeight: '500px',
              minHeight: '300px',
              overflow: 'hidden',
              backgroundColor: '#f8f9fa'
            }}
          >
            <img
              src={image}
              alt={slides[index].title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/800x400/8b5cf6/ffffff?text=Tassili+${index + 1}`;
              }}
            />
          </div>
          <Carousel.Caption 
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '10px',
              padding: '20px',
              bottom: '20px',
              left: '10%',
              right: '10%',
              textAlign: isRTL ? 'right' : 'left'
            }}
          >
            <h3 
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: '700',
                marginBottom: '10px',
                color: '#ffffff'
              }}
            >
              {slides[index].title}
            </h3>
            <p 
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                fontWeight: '500',
                color: '#f0f0f0',
                marginBottom: '0'
              }}
            >
              {slides[index].description}
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default HeaderCarousel;