import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

const HeaderCarousel = () => {
    const slides = [
        {
            image: "/images/clothing/04.jpg",
            title: "Nouvelle Collection Printemps",
            description: "Découvrez les dernières tendances de la saison"
        },
        {
            image: "/images/clothing/00.jpg",
            title: "Soldes d'Été",
            description: "Jusqu'à -50% sur toute la collection été"
        },
        {
            image: "/images/clothing/01.jpg",
            title: "Collection Homme",
            description: "Style et élégance pour chaque occasion"
        },
        {
            image: "/images/clothing/03.jpg",
            title: "Collection Femme",
            description: "Élégance et confort pour votre quotidien"
        }
    ];

    return (
        <Carousel data-bs-theme="dark" fade interval={3000}>
            {slides.map((slide, index) => (
                <Carousel.Item key={index}>
                    <img
                        className="d-block w-100"
                        src={slide.image}
                        alt={slide.title}
                        style={{
                            height: 'clamp(180px, 40vw, 350px)',
                            objectFit: 'cover'
                        }}
                    />
                    <Carousel.Caption style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        borderRadius: '8px',
                        padding: '15px 20px'
                    }}>
                        <h3 style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                            {slide.title}
                        </h3>
                        <p style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                            {slide.description}
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default HeaderCarousel;