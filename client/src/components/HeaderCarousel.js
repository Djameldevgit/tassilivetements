import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

const HeaderCarousel = () => {
    const slides = [
        {
            image: "/images/clothing/04.png",
            title: "Nouvelle Collection Printemps",
            description: "Découvrez les dernières tendances de la saison"
        },
        {
            image: "/images/clothing/00.png",
            title: "Soldes d'Été",
            description: "Jusqu'à -50% sur toute la collection été"
        },
        {
            image: "/images/clothing/01.png",
            title: "Collection Homme",
            description: "Style et élégance pour chaque occasion"
        },
        {
            image: "/images/clothing/03.png",
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
                    <Carousel.Caption>
                        <h3>{slide.title}</h3>
                        <p>{slide.description}</p>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default HeaderCarousel;
 